from fastapi import APIRouter, Depends
from models.LineModel import LineCreate
from sqlalchemy.orm import Session
from helpers import logger
from db import get_db
from sqlalchemy import text
from sqlalchemy.orm import Session
from models.db_schemas.Line import Line
from models.errors.Errors import LineAlreadyExistsError


router = APIRouter()

router = APIRouter(
    prefix="/line",
    tags=["line"],
)


@router.post("/")
async def create_line(data: LineCreate, db: Session = Depends(get_db)):

    existingLine = db.query(Line).filter(Line.name == data.name).first()

    if existingLine:
        raise LineAlreadyExistsError()

    new_bus = Line(
        name=data.name,
    )

    db.add(new_bus)
    db.commit()
    db.refresh(new_bus)

    return {"status": "created"}


@router.get("/")
async def get_all_lines(db: Session = Depends(get_db)):
    lines = db.query(Line).all()
    return lines
