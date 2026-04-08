from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db import get_db
from models.db_schemas.Station import Station as StationDB
from models.StationModel import StationCreate, Station

router = APIRouter(
    prefix="/stations",
    tags=["stations"],
)


# POST /station
@router.post("/", response_model=Station)
async def create_station(
    data: StationCreate,
    db: Session = Depends(get_db)
):

    new_station = StationDB(
        name=data.name,
        line_id=data.line_id,
        lat=data.lat,
        long=data.long
    )

    db.add(new_station)
    db.commit()
    db.refresh(new_station)

    return new_station


# GET /stations
@router.get("/", response_model=List[Station])
async def get_stations(
    db: Session = Depends(get_db)
):

    stations = db.query(StationDB).all()

    return stations


# GET /stations/{id}
@router.get("/{id}", response_model=Station)
async def get_station(
    id: int,
    db: Session = Depends(get_db)
):

    station = db.query(StationDB).filter(
        StationDB.id == id
    ).first()

    if not station:

        raise HTTPException(
            status_code=404,
            detail="Station not found"
        )

    return station