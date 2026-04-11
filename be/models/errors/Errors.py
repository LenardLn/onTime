from enum import Enum


class Errors(str, Enum):
    INVALID_TOKEN = "errors.invalid_token"
    NOT_FOUND_USER = "errors.not_found_user"
    NOT_AUTHENTICATED = "errors.not_authenticated"


class AppError(Exception):
    def __init__(self, message: str, error_code: str, status_code: int = 400):
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        super().__init__(message)


class EmailExistsError(AppError):
    def __init__(self):
        super().__init__(
            message="Email already exists",
            error_code="errors.email_exists",
            status_code=409
        )


class InvalideCredentials(AppError):
    def __init__(self):
        super().__init__(
            message="Invalid credentials",
            error_code="errors.invalid_credentials",
            status_code=401
        )


class NotAuthenticatedError(AppError):
    def __init__(self):
        super().__init__(
            message="Not authenticated",
            error_code="error.not_authenticated",
            status_code=401
        )


class LineAlreadyExistsError(AppError):
    def __init__(self):
        super().__init__(
            message="Line already exista",
            error_code="error.line_exists",
            status_code=409
        )


class TxtFileRequiredError(AppError):

    def __init__(self):
        super().__init__(
            message="File must be a .txt",
            error_code="error.txt_file_required",
            status_code=409
        )


class TxtRoutesUploadFormatError(AppError):

    def __init__(self):
        super().__init__(
            message="File must contain Lat: value, Long: value and Index: value for each line",
            error_code="error.txt_routes_upload_format",
            status_code=409
        )


class InvalidTokenError(AppError):
    def __init__(self):
        super().__init__(
            message="Invalid token",
            error_code=Errors.INVALID_TOKEN,
            status_code=401
        )


class InvalidUserError(AppError):
    def __init__(self):
        super().__init__(
            message="User not found",
            error_code=Errors.NOT_FOUND_USER,
            status_code=404
        )
