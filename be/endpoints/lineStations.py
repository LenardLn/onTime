from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from db import get_db
from sqlalchemy.orm import Session
from models.RouteModel import Route, RouteCreate, RouteUpdate
from helpers.get_current_user import get_current_user
from models.db_schemas.Route import Route as RouteDB
from models.db_schemas.Station import Station as StationDB
from datetime import datetime, timezone
from models.db_schemas.User import User as UserDB
from models.db_schemas.LineStation import LineStation as LineStationDb
from models.errors.Errors import RouteNotFoundError, StationNotFoundError, LineNotFoundError

router = APIRouter(
    prefix="/line-stations",
    tags=["line-stations"],
)


@router.get("")
async def get_routes(
    db: Session = Depends(get_db)
):

    query = db.query(StationDB).order_by(
        StationDB.line_id,
        StationDB.order_index
    ).all()

    line_stations = []
    for station in query:
        line_station = LineStationDb(
            line_id=station.line_id,
            station_id=station.id,
            order_index=station.order_index,
            created_by=2
        )

        line_stations.append(line_station)

    db.add_all(line_stations)
    db.commit()

    return {
        "message": "success"
    }
