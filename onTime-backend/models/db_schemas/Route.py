import datetime
from typing import Optional
import datetime
from datetime import datetime, timezone
from sqlalchemy.orm import declarative_base, Mapped, mapped_column
from sqlalchemy import DateTime, Integer, String, DATETIME, Float
from sqlalchemy import Float

Base = declarative_base()


class Route(Base):
    __tablename__ = "routes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    lat: Mapped[float] = mapped_column(Float, nullable=False)
    long: Mapped[float] = mapped_column(Float, nullable=False)
    line_id: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )
    created_by: Mapped[int] = mapped_column(Integer, nullable=True)
    order_index: Mapped[int] = mapped_column(Integer, nullable=True)
    
