from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import get_db
from models.db_schemas.User import User
from models.db_schemas.Bus import Bus
from models.AuthModel import Login
from helpers.auth import verify_password, create_access_token
from fastapi import Response
from models.errors.Errors import InvalideCredentials, BusNotFoundError, NotADriverError

router = APIRouter(
    prefix="/login",
    tags=["auth"],
)


@router.post("")
def login(data: Login, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.password):
        raise InvalideCredentials()

    if str(user.roles) != "Driver":
        raise NotADriverError()

    bus = db.query(Bus).filter(Bus.name == data.bus_name).first()

    if not bus:
        raise BusNotFoundError()

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
        "bus": {
            "id": bus.id,
            "name": bus.name,
            "line_id": bus.line_id,
        },
    }
