from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from db import get_db
from models.db_schemas.Station import Station as StationDB
from models.StationModel import StationCreate, Station


router = APIRouter(
    prefix="/stations",
    tags=["stations"],
)


# POST /station
@router.post("", response_model=Station)
async def create_station(
    data: StationCreate,
    db: Session = Depends(get_db)
):

    new_station = StationDB(
        name=data.name,
        line_id=data.line_id,
        lat=data.lat,
        long=data.long,
        order_index=data.order_index
    )

    db.add(new_station)
    db.commit()
    db.refresh(new_station)

    return new_station


# GET /stations
@router.get("", response_model=List[Station])
async def get_stations(
    db: Session = Depends(get_db)
):

    stations = db.query(StationDB).all()

    return stations


# GET /stations/{id} 
@router.get("/", response_model=List[Station])
async def get_stations(
    line_ids: Optional[List[int]] = Query(default=None),
    db: Session = Depends(get_db)
):
    # Base query
    query = db.query(StationDB)
    
    if not query:
        raise HTTPException(
            status_code=404,
            detail="Station not found"
        )

    # Filter by line_ids if provided
    if line_ids:
        query = query.filter(StationDB.line_id.in_(line_ids))

    # Order for correct display
    stations = query.order_by(
        StationDB.line_id,
        StationDB.order_index
    ).all()

    return stations
