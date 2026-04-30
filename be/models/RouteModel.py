from datetime import datetime
from pydantic import BaseModel
from models.UserModel import UserResponse
from typing import Optional, List


class RouteData(BaseModel):
    id: int
    lat: float
    long: float
    line_id: int
    order_index: Optional[int] = None

    class Config:
        from_attributes = True


class Route(BaseModel):
    routes: List[RouteData]
    created_at: Optional[str] = None
    created_by: Optional[UserResponse] = None

    class Config:
        from_attributes = True


class RouteCreate(BaseModel):
    lat: float
    long: float
    line_id: int
    order_index: int
    

class RouteUpdate(BaseModel):
    id: Optional[int] = None
    lat: Optional[float] = None
    long: Optional[float] = None
    line_id: Optional[int] = None
    order_index: Optional[int] = None