from typing import Optional
from datetime import datetime

from sqlalchemy import Integer, Float, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from models.db_schemas.Base import Base


class BusLocation(Base):
    __tablename__ = "bus_locations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    line_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("lines.id"),
        nullable=False
    )

    lat: Mapped[float] = mapped_column(Float, nullable=False)
    lon: Mapped[float] = mapped_column(Float, nullable=False)
    vel: Mapped[float] = mapped_column(Float, nullable=False)

    time: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    bus_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    bus_name: Mapped[Optional[str]] = mapped_column(String, nullable=True)
