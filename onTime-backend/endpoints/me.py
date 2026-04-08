import os
from fastapi import APIRouter, Depends, HTTPException, Request
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from db import get_db
from models.db_schemas import User
from dotenv import load_dotenv
from models.errors import Errors

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"

router = APIRouter()


@router.get("/me")
def get_me(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(status_code=401, detail=Errors.INVALID_TOKEN)

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")

        if not user_id:
            raise HTTPException(status_code=401, detail="errors.invalid_token")

    except JWTError:
        raise HTTPException(status_code=401, detail="errors.invalid_token")

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=401, detail="errors.not_found_user")

    return {
        "id": user.id,
        "email": user.email
    }
