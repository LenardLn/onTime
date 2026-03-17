from datetime import datetime
from fastapi import APIRouter
from sqlalchemy import text
from models.AuthModel import Register
from helpers.logger import logger
from db import engine
from helpers.auth import hash_password

router = APIRouter()


@router.post("/register")
async def register(data: Register):
    try:
        hashed = hash_password(data.password)
        time = datetime.now()
        payload = {
            "password": hashed,
            "email": data.email,
            "created_at": time
        }
        with engine.begin() as conn:  # auto-commit
            conn.execute(text("""
            INSERT INTO users(password, email, created_at)
            VALUES (:password, :email, :created_at)
        """), payload)

        return {"status": "user created"}

    except Exception as e:
        logger.error(f"Register error: {e}")
        return {"status": "error", "detail": str(e)}
