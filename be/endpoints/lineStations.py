from typing import List, Optional
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from db import get_db
from helpers.get_current_user import get_current_user
from models.db_schemas.Line import Line as LineDB
from models.db_schemas.Station import Station as StationDB
from models.db_schemas.LineStation import LineStation as LineStationDB
from models.LineStationModel import (
    LineStationCreate,
    LineStationData,
    LineStationList,
)
from models.errors.Errors import (
    LineNotFoundError,
    StationNotFoundError,
    LineStationExistsError,
    LineStationNotFoundError,
)

router = APIRouter(
    prefix="/line-stations",
    tags=["line-stations"],
)


def _serialize(row: LineStationDB) -> LineStationData:
    return LineStationData(
        id=row.id,
        line_id=row.line_id,
        station_id=row.station_id,
        order_index=row.order_index,
        line_name=row.line.name if row.line else None,
        station_name=row.station.name if row.station else None,
    )


@router.get("", response_model=LineStationList)
async def get_line_stations(
    station_id: Optional[int] = Query(default=None),
    line_id: Optional[int] = Query(default=None),
    db: Session = Depends(get_db),
):
    """List line-station links, optionally filtered by station or line.

    A single station can be linked to many lines (and vice versa) via this
    junction table, so the admin UI can attach one station to several routes.
    """
    query = db.query(LineStationDB)

    if station_id is not None:
        query = query.filter(LineStationDB.station_id == station_id)

    if line_id is not None:
        query = query.filter(LineStationDB.line_id == line_id)

    rows = query.order_by(
        LineStationDB.line_id,
        LineStationDB.order_index,
    ).all()

    return {"line_stations": [_serialize(row) for row in rows]}


@router.post("", response_model=LineStationData)
async def create_line_station(
    data: LineStationCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """Attach a station to a line."""
    station = (
        db.query(StationDB)
        .filter(StationDB.id == data.station_id)
        .first()
    )
    if not station:
        raise StationNotFoundError()

    line = db.query(LineDB).filter(LineDB.id == data.line_id).first()
    if not line:
        raise LineNotFoundError()

    existing = (
        db.query(LineStationDB)
        .filter(
            LineStationDB.line_id == data.line_id,
            LineStationDB.station_id == data.station_id,
        )
        .first()
    )
    if existing:
        raise LineStationExistsError()

    order_index = data.order_index
    if order_index is None:
        max_order = (
            db.query(func.max(LineStationDB.order_index))
            .filter(LineStationDB.line_id == data.line_id)
            .scalar()
        )
        order_index = (max_order + 1) if max_order is not None else 0

    link = LineStationDB(
        line_id=data.line_id,
        station_id=data.station_id,
        order_index=order_index,
        created_by=user["id"],
        created_at=datetime.now(timezone.utc),
    )

    db.add(link)
    db.commit()
    db.refresh(link)

    return _serialize(link)


@router.delete("/{id}")
async def delete_line_station(
    id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """Detach a station from a line."""
    link = db.query(LineStationDB).filter(LineStationDB.id == id).first()

    if not link:
        raise LineStationNotFoundError()

    db.delete(link)
    db.commit()

    return {
        "message": "Line-station link removed",
        "deleted_id": id,
    }
