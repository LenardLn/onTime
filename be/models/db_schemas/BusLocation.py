from sqlalchemy import (
    Column,
    Integer,
    Float,
    TIMESTAMP,
    ForeignKey,
    Text
)

from models.db_schemas.Base import Base

class BusLocation(Base):

    __tablename__ = "bus_locations"
    id = Column(Integer, primary_key=True)
    line_id = Column(
        Integer,
        ForeignKey("lines.id"),
        nullable=False
    )
    lat = Column(Float, nullable=False)
    lon = Column(Float, nullable=False)
    vel = Column(Float)
    simulation_time = Column(
        TIMESTAMP,
        nullable=False
    )
    bus_id = Column(
        Integer, 
        ForeignKey("buses.id"),
        nullable=False)
    bus_name = Column(
        Text,
        nullable=False
    )