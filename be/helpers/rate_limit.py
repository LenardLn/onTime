"""Lightweight in-memory rate limiting for brute-force protection.

This is intentionally dependency-free (no Redis): state lives in this process,
so limits reset on restart and are not shared across multiple workers. That is
fine as defense-in-depth on a single instance; for horizontal scaling, swap the
backing store for Redis.
"""

import time
import threading
from collections import defaultdict, deque

from fastapi import Request

from models.errors.Errors import TooManyRequestsError


def client_ip(request: Request) -> str:
    """Best-effort client IP. Behind a proxy (e.g. Render) the real client is in
    X-Forwarded-For; fall back to the socket peer otherwise."""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


class RequestRateLimiter:
    """Sliding-window limiter used as a FastAPI dependency. Caps how many
    requests a single client IP may make to a route within the window."""

    def __init__(self, max_requests: int, window_seconds: int):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._hits: dict[str, deque] = defaultdict(deque)
        self._lock = threading.Lock()

    def __call__(self, request: Request) -> None:
        key = client_ip(request)
        now = time.monotonic()
        cutoff = now - self.window_seconds
        with self._lock:
            hits = self._hits[key]
            while hits and hits[0] < cutoff:
                hits.popleft()
            if len(hits) >= self.max_requests:
                raise TooManyRequestsError()
            hits.append(now)


class LoginFailureLimiter:
    """Per-account lockout. Counts only *failed* attempts and clears them on a
    successful login, so legitimate users are not penalised. Independent of IP,
    so it also stops distributed guessing against a single account."""

    def __init__(self, max_failures: int, window_seconds: int):
        self.max_failures = max_failures
        self.window_seconds = window_seconds
        self._failures: dict[str, deque] = defaultdict(deque)
        self._lock = threading.Lock()

    def _prune(self, key: str, now: float) -> None:
        cutoff = now - self.window_seconds
        failures = self._failures[key]
        while failures and failures[0] < cutoff:
            failures.popleft()

    def check(self, key: str) -> None:
        """Raise if this key is currently locked out."""
        now = time.monotonic()
        with self._lock:
            self._prune(key, now)
            if len(self._failures[key]) >= self.max_failures:
                raise TooManyRequestsError()

    def record_failure(self, key: str) -> None:
        now = time.monotonic()
        with self._lock:
            self._prune(key, now)
            self._failures[key].append(now)

    def reset(self, key: str) -> None:
        with self._lock:
            self._failures.pop(key, None)
