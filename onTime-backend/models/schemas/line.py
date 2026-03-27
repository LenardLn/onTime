# schemas.py
from pydantic import BaseModel


class LineSchema(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True  # very important for SQLAlchemy models
