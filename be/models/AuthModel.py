from typing import Literal, Optional
from pydantic import BaseModel, EmailStr

UserRole = Literal["Driver", "Admin"]


class Register(BaseModel):
    password: str
    email: EmailStr
    role: UserRole = "Admin"
    id: Optional[int] = None


class Login(BaseModel):
    password: str
    email: EmailStr
    # Drivers (mobile app) log in with their bus name; the admin panel omits it.
    bus_name: Optional[str] = None
    id: Optional[int] = None


class UpdateEmail(BaseModel):
    email: EmailStr
    password: str


class UpdatePassword(BaseModel):
    current_password: str
    new_password: str
