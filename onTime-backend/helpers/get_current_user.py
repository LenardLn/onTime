from fastapi import APIRouter, Depends, HTTPException, Request
from jose import JWTError, jwt
from sqlalchemy.orm import Session
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
        raise HTTPException(status_code=401, detail="errors.invalid_token")

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
    except JWTError:
        raise HTTPException(status_code=401, detail="errors.invalid_token")

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=401, detail="errors.users_not_found")

    return user
