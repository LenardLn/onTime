from sqlalchemy import Integer, String, SmallInteger, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from models.db_schemas.Base import Base


class Bus(Base):
    __tablename__ = "buses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)

    line_id: Mapped[int] = mapped_column(
        SmallInteger,
        ForeignKey("lines.id"),
        nullable=False
    )
