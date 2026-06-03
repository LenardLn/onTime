from sqlalchemy import Column, Integer, Text, ForeignKey
from models.db_schemas.Base import Base

class Bus(Base):
    __tablename__ = "buses"

    id = Column(Integer, primary_key=True)

    name = Column(Text, unique=True)

    line_id = Column(
        Integer,
        ForeignKey("lines.id")
    )