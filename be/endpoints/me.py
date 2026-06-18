import os
from fastapi import APIRouter, Depends, Request
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from db import get_db
from models.db_schemas import User
from models.AuthModel import UpdateEmail, UpdatePassword
from helpers.auth import verify_password, hash_password
from dotenv import load_dotenv
from models.errors.Errors import (
    EmailExistsError,
    InvalideCredentials,
    InvalidTokenError,
    InvalidUserError,
)

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"

router = APIRouter(
    prefix="/me",
    tags=["auth"],
)


def _get_user_from_cookie(request: Request, db: Session) -> User:
    token = request.cookies.get("access_token")

    if not token:
        raise InvalidTokenError()

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")

        if not user_id:
            raise InvalidTokenError()

    except JWTError:
        raise InvalidTokenError()

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise InvalidUserError()

    return user


@router.get("")
def get_me(request: Request, db: Session = Depends(get_db)):
    user = _get_user_from_cookie(request, db)

    return {
        "id": user.id,
        "email": user.email,
        "roles": user.roles,
    }


@router.put("/email")
def update_email(
    data: UpdateEmail,
    request: Request,
    db: Session = Depends(get_db),
):
    user = _get_user_from_cookie(request, db)

    if not verify_password(data.password, user.password):
        raise InvalideCredentials()

    existing = db.query(User).filter(
        User.email == data.email, User.id != user.id
    ).first()
    if existing:
        raise EmailExistsError()

    user.email = data.email
    db.commit()
    db.refresh(user)

    return {
        "id": user.id,
        "email": user.email,
        "roles": user.roles,
    }


@router.put("/password")
def update_password(
    data: UpdatePassword,
    request: Request,
    db: Session = Depends(get_db),
):
    user = _get_user_from_cookie(request, db)

    if not verify_password(data.current_password, user.password):
        raise InvalideCredentials()

    user.password = hash_password(data.new_password)
    db.commit()

    return {"status": "password updated"}
