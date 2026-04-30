from typing import Optional
import datetime
from datetime import timezone
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, Float, SmallInteger, ForeignKey, DateTime
from models.db_schemas.Base import Base
from datetime import datetime, timezone


class Station(Base):
    __tablename__ = "stations"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    station_id: Mapped[int] = mapped_column(Integer, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    line_id: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    lat: Mapped[float] = mapped_column(Float, nullable=False)
    long: Mapped[float] = mapped_column(Float, nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )
    
    created_by: Mapped[Optional[int]] = mapped_column(
        Integer, 
        ForeignKey("users.id"),
        nullable=True)