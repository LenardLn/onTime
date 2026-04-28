import re
from typing import List, Optional

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, Query
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
from models.db_schemas.Station import Station as StationDB

router = APIRouter()

router = APIRouter(
    prefix="/route",
    tags=["route"],
)


@router.get("/")
async def get_routes(
    line_ids: Optional[List[int]] = Query(default=None),
    station_name: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(RouteDB)

    # Filter by station name → convert to line_ids
    if station_name:
        lines = db.query(StationDB.line_id).filter(
            StationDB.name == station_name
        ).distinct().all()

        if not lines:
            raise HTTPException(404, "Station not found")

        station_line_ids = [l[0] for l in lines]

        if line_ids:
            # intersection of filters
            line_ids = list(set(line_ids) & set(station_line_ids))
        else:
            line_ids = station_line_ids

    # Apply line filter
    if line_ids:
        query = query.filter(RouteDB.line_id.in_(line_ids))

    routes = query.order_by(
        RouteDB.line_id,
        RouteDB.order_index
    ).all()

    return routes

# individual create for now, will need to be able to add array of items
@router.post("")
async def create_route(data: RouteCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):

    new_route = RouteDB(
        lat=data.lat,
        long=data.long,
        line_id=data.line_id,
        created_by=user["id"],
        order_index=data.order_index
    )

    db.add(new_route)
    db.commit()
    db.refresh(new_route)

    return new_route