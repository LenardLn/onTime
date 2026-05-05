from typing import Optional
import datetime
from datetime import timezone
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, ForeignKey, DateTime
from models.db_schemas.Base import Base
from datetime import datetime, timezone


class LineStation(Base):
    __tablename__ = "line_stations"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    line_id = mapped_column(ForeignKey("lines.id"))
    station_id = mapped_column(ForeignKey("stations.id"))

    line = relationship("Line", back_populates="line_stations")
    station = relationship("Station")

    order_index: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )
    created_by: Mapped[Optional[int]] = mapped_column(
        Integer,
        ForeignKey("users.id"),
        nullable=True)
