from pydantic import BaseModel
from typing import Optional

class LocationUpdate(BaseModel):
    lat: float
    lon: float
    tst: int
    batt: Optional[int] = None
    acc: Optional[float] = None
    alt: Optional[int] = None
    vel: Optional[float] = None
    topic: Optional[str] = None
    
