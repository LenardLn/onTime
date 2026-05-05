from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.db_schemas.Base import Base


class Line(Base):
    __tablename__ = "lines"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    name: Mapped[str] = mapped_column(String, nullable=False)

    routes: Mapped[list["Route"]] = relationship(
        back_populates="line",
        cascade="all, delete-orphan"
    )
    
    line_stations = relationship("LineStation", back_populates="line")
