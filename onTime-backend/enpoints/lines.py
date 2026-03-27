from typing import List

from fastapi import APIRouter, Depends, HTTPException
from models.LineModel import LineCreate
from sqlalchemy.orm import Session
from helpers import logger
from db import get_db
from sqlalchemy import text
from sqlalchemy.orm import Session
from models.db_schemas.Line import Line
from models.errors.Errors import LineAlreadyExistsError
from models.schemas.line import LineSchema


router = APIRouter()

router = APIRouter(
    prefix="/line",
    tags=["line"],
)


@router.post("/", response_model=LineSchema)
async def create_line(data: LineCreate, db: Session = Depends(get_db)):

    existingLine = db.query(Line).filter(Line.name == data.name).first()

    if existingLine:
        raise LineAlreadyExistsError()

    new_line = Line(
        name=data.name,
    )

    db.add(new_line)
    db.commit()
    db.refresh(new_line)

    return new_line


@router.get("/", response_model=List[LineSchema])
async def get_all_lines(db: Session = Depends(get_db)):
    try:
        lines = db.query(Line).all()
        return lines
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
