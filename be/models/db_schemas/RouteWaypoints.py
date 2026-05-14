from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, Float, ForeignKey, DateTime, Index
from models.db_schemas.Base import Base
from typing import Optional
from datetime import datetime, timezone


class Route_Waypoints(Base):
    __tablename__ = "route_waypoints"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    lat: Mapped[float] = mapped_column(Float, nullable=False)
    long: Mapped[float] = mapped_column(Float, nullable=False)

    line_id: Mapped[int] = mapped_column(
        ForeignKey("lines.id"),
        nullable=False,
        index=True
    )

    line: Mapped["Line"] = relationship(back_populates="waypoints")

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    created_by: Mapped[Optional[int]] = mapped_column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    order_index: Mapped[int] = mapped_column(Integer, nullable=False)

    __table_args__ = (
        Index("idx_line_order", "line_id", "order_index"),
    )
