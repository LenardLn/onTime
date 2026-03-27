from pydantic import BaseModel


class LineCreate(BaseModel):
    name: str
