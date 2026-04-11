from fastapi import APIRouter, Depends, HTTPException, Request
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from models.errors.Errors import InvalidTokenError, InvalidUserError
from db import get_db
from models.db_schemas.User import User
import os
from dotenv import load_dotenv

load_dotenv()
JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"

router = APIRouter()


def get_current_user(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")

    if not token:
        raise InvalidTokenError()

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        token_version = payload.get("token_version", 0)
    except JWTError:
        raise InvalidTokenError()

    user = db.query(
        User.id,
        User.email,
        User.token_version
    ).filter(User.id == user_id).first()

    if not user:
        raise InvalidUserError()

    if token_version != user.token_version:
        raise InvalidTokenError()

    return user._asdict()
