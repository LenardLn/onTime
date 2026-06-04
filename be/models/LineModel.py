from typing import Optional
from pydantic import BaseModel


class LineCreate(BaseModel):
    name: str


class LineModel(BaseModel):
    id: Optional[int] = None
    name: str
    has_route: bool
