import os
from fastapi import APIRouter, Depends, HTTPException, Request
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from db import get_db
from models.db_schemas import User
from dotenv import load_dotenv
from models.errors import Errors
from models.errors.Errors import InvalidTokenError, InvalidUserError

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"

router = APIRouter(
    prefix="/me",
    tags=["auth"],
)


@router.get("")
def get_me(request: Request, db: Session = Depends(get_db)):
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

    return {
        "id": user.id,
        "email": user.email
    }
