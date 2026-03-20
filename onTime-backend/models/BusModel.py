from pydantic import BaseModel
from typing import Optional


class BusCreate(BaseModel):
    name: str
