from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.orm import Session
from db import get_db
from models.db_schemas.User import User
from models.db_schemas.Bus import Bus
from models.AuthModel import Login
from helpers.auth import verify_password, create_access_token, hash_password
from helpers.rate_limit import RequestRateLimiter, LoginFailureLimiter
from models.errors.Errors import InvalideCredentials, BusNotFoundError

router = APIRouter(
    prefix="/login",
    tags=["auth"],
)

# Defense-in-depth against brute force: cap raw requests per IP, and lock out an
# individual account after repeated failures (cleared on a successful login).
ip_rate_limiter = RequestRateLimiter(max_requests=30, window_seconds=300)
login_failures = LoginFailureLimiter(max_failures=8, window_seconds=900)

# Used to keep response timing constant when the email doesn't exist, so an
# attacker can't enumerate valid emails by measuring how long the request takes.
_DUMMY_HASH = hash_password("timing-equalization-placeholder")


@router.post("")
def login(
    data: Login,
    response: Response,
    request: Request,
    db: Session = Depends(get_db),
    _: None = Depends(ip_rate_limiter),
):
    email_key = data.email.lower()
    login_failures.check(email_key)

    user = db.query(User).filter(User.email == data.email).first()

    # Drivers (mobile app) send a bus_name; the admin panel logs in without one.
    expected_role = "Driver" if data.bus_name else "Admin"

    # Run a hash verify even when the user is missing (constant-time-ish), and
    # return one generic error for bad password OR wrong-role accounts so we
    # never reveal which part was wrong.
    password_ok = verify_password(
        data.password, user.password if user else _DUMMY_HASH
    )
    if not user or not password_ok or str(user.roles) != expected_role:
        login_failures.record_failure(email_key)
        raise InvalideCredentials()

    bus = None
    if data.bus_name:
        bus = db.query(Bus).filter(Bus.name == data.bus_name).first()
        if not bus:
            raise BusNotFoundError()

    login_failures.reset(email_key)

    token = create_access_token({
        "sub": user.email,
        "user_id": user.id
    }, user.token_version)

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=60 * 60 * 24
    )

    return {
        "status": "logged in",
        # Returned in the body so native apps (no cookie jar) can send it back
        # as an Authorization: Bearer header. The browser admin uses the cookie.
        "token": token,
        "bus": {
            "id": bus.id,
            "name": bus.name,
            "line_id": bus.line_id,
        } if bus else None,
    }
