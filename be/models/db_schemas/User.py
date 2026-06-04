from sqlalchemy.orm import declarative_base, Mapped, mapped_column
from sqlalchemy import Integer, String, Date
from datetime import datetime
from models.db_schemas.Base import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(Date, nullable=False)
    token_version: Mapped[int] = mapped_column(Integer, default=0)
    roles: Mapped[str] = mapped_column(String, nullable=False)
