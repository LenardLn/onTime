from pydantic import BaseModel
from typing import Optional


class LocationUpdate(BaseModel):
    bus_id: int
    lat: float
    lon: float
    tst: int
    vel: Optional[float] = 0
