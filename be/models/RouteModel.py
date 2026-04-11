from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class Route(BaseModel):
    id: Optional[int] = None
    lat: float
    long: float
    line_id: int

class RouteCreate(BaseModel):
    lat: float
    long: float
    line_id: int
    order_index: int
