from enum import Enum


class Errors(str, Enum):
    INVALID_TOKEN = "errors.invalid_token"
    NOT_FOUND_USER = "errors.not_found_user"
    NOT_AUTHENTICATED = "errors.not_authenticated"
    LINE_NOT_FOUND = "errors.line_not_found"
    ROUTE_NOT_FOUND = "errors.route_not_found"
    STATION_NOT_FOUND = "errors.station_not_found"


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

class NoLineIdsProvided(AppError):
    def __init__(self):
        super().__init__(
            message="No line ids provided",
            error_code="error.not_line_ids_provided",
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


class LineNotFoundError(AppError):
    def __init__(self):
        super().__init__(
            message="Line not found",
            error_code=Errors.LINE_NOT_FOUND,
            status_code=404
        )


class RouteNotFoundError(AppError):
    def __init__(self):
        super().__init__(
            message="Route not found",
            error_code=Errors.ROUTE_NOT_FOUND,
            status_code=404
        )


class StationNotFoundError(AppError):
    def __init__(self):
        super().__init__(
            message="Station not found",
            error_code=Errors.STATION_NOT_FOUND,
            status_code=404
        )


class BusNotFoundError(AppError):
    def __init__(self):
        super().__init__(
            message="Bus not found",
            error_code="errors.bus_not_found",
            status_code=404
        )


class BusAlreadyExistsError(AppError):
    def __init__(self):
        super().__init__(
            message="A bus with this name already exists",
            error_code="errors.bus_exists",
            status_code=409
        )


class NotADriverError(AppError):
    def __init__(self):
        super().__init__(
            message="Account is not a driver",
            error_code="errors.not_a_driver",
            status_code=403
        )


class AdminRequiredError(AppError):
    def __init__(self):
        super().__init__(
            message="Admin access required",
            error_code="errors.admin_required",
            status_code=403
        )


class CannotDeleteSelfError(AppError):
    def __init__(self):
        super().__init__(
            message="You cannot delete your own account",
            error_code="errors.cannot_delete_self",
            status_code=400
        )


class TooManyRequestsError(AppError):
    def __init__(self):
        super().__init__(
            message="Too many attempts. Please wait and try again.",
            error_code="errors.too_many_requests",
            status_code=429
        )


class LineStationExistsError(AppError):
    def __init__(self):
        super().__init__(
            message="Station is already attached to this line",
            error_code="errors.line_station_exists",
            status_code=409
        )


class LineStationNotFoundError(AppError):
    def __init__(self):
        super().__init__(
            message="Line-station link not found",
            error_code="errors.line_station_not_found",
            status_code=404
        )
