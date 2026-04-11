import re
from typing import List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from models.LineModel import LineModel
from sqlalchemy.orm import Session
from helpers import logger
from db import get_db
from sqlalchemy.orm import Session
from models.db_schemas.Line import Line
from models.RouteModel import Route, RouteCreate
from helpers.get_current_user import get_current_user
from models.db_schemas.Route import Route as RouteDB
from models.errors.Errors import TxtFileRequiredError, TxtRoutesUploadFormatError


router = APIRouter()

router = APIRouter(
    prefix="/route",
    tags=["route"],
)


# individual create for now, will need to be able to add array of items
@router.post("")
async def create_route(data: RouteCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):

    new_route = RouteDB(
        lat=data.lat,
        long=data.long,
        line_id=data.line_id,
        created_by=user["id"]
    )

    db.add(new_route)
    db.commit()
    db.refresh(new_route)

    return new_route


@router.post("/file/{line_id}")
async def create_route(file: UploadFile = File(...), db: Session = Depends(get_db), user=Depends(get_current_user), line_id: int = None):
    content = await file.read()
    lines = content.decode("utf-8").splitlines()

    if not file.filename.endswith(".txt"):
        raise TxtFileRequiredError()

    new_routes = []

    for line in lines:
        values = re.findall(r"(?:Lat|Long|Index):\s*([-\d.]+)", line)

        if len(values) != 3:
            continue  # if raw line does not match expected format, skip it

        lat = values[0]
        long = values[1]
        index = values[2]

        new_route = RouteDB(
            lat=float(lat.strip()),
            long=float(long.strip()),
            line_id=line_id,
            order_index=index,
            created_by=user["id"]
        )
        new_routes.append(new_route)

    db.bulk_save_objects(new_routes)
    db.commit()

    return "created"
