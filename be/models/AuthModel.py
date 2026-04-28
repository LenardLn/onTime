from typing import Optional
from pydantic import BaseModel, EmailStr


class Register(BaseModel):
    password: str
    email: EmailStr
    id: Optional[int] = None


class Login(BaseModel):
    password: str
    email: EmailStr
    id: Optional[int] = None
