from typing import Optional
from datetime import datetime, timezone

from models.db_schemas.Line import Line
from models.db_schemas.LineStation import LineStation
from sqlalchemy import DateTime, Integer, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.db_schemas.Base import Base


class Route(Base):
    __tablename__ = "routes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    lat: Mapped[float] = mapped_column(Float, nullable=False)
    long: Mapped[float] = mapped_column(Float, nullable=False)

    line_id: Mapped[int] = mapped_column(
        ForeignKey("lines.id"),
        nullable=False,
        index=True
    )

    line: Mapped[Line] = relationship(back_populates="routes")

    created_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )

    created_by: Mapped[Optional[int]] = mapped_column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    order_index: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True
    )
