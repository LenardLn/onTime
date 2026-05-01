from sqlalchemy.orm import declarative_base, Mapped, mapped_column
from sqlalchemy import Integer, String
from models.db_schemas.Base import Base


class Line(Base):
    __tablename__ = "lines"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
