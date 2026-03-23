from enum import Enum


class Errors(str, Enum):
    INVALID_TOKEN = "errors.invalid_token"
    NOT_FOUND_USER = "errors.not_found_user"
    NOT_AUTHENTICATED = "errors.not_authenticated"
