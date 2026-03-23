from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from db import get_db
from models.db_schemas.User import User
from models.AuthModel import Register
from helpers.auth import hash_password
from fastapi import HTTPException


router = APIRouter()


@router.post("/register")
def register(data: Register, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="errors.email_not_unique")

    user = User(
        email=data.email,
        password=hash_password(data.password),
        created_at=datetime.now()
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"status": "user created", "id": user.id}
