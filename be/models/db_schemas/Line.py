from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.db_schemas.LineStation import LineStation
from models.db_schemas.Route import Route
from models.db_schemas.Base import Base


class Line(Base):
    __tablename__ = "lines"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    name: Mapped[str] = mapped_column(String, nullable=False)

    routes: Mapped[list[Route]] = relationship(
        "Route",
        back_populates="line",
        cascade="all, delete-orphan"
    )

    waypoints = relationship(
        "Route_Waypoints", back_populates="line", cascade="all, delete-orphan")

    line_stations: Mapped[list[LineStation]] = relationship(
        "LineStation",
        back_populates="line",
        order_by="LineStation.order_index",
        cascade="all, delete-orphan"
    )
