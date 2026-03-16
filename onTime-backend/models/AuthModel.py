from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


class Register(BaseModel):
    password: str
    email: EmailStr
    created_at: datetime
    id: Optional[int] = None


class Login(BaseModel):
    password: str
    email: EmailStr
    id: Optional[int] = None
