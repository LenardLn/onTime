from pydantic import BaseModel
from typing import Optional


class Station(BaseModel):
    id: Optional[int] = None
    name: str
    line_id: int
    lat: float
    long: float


class StationCreate(BaseModel):
    name: str
    line_id: int
    lat: float
    long: float