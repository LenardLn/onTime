from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db import get_db
from helpers.get_current_user import get_current_user
from models.db_schemas.Bus import Bus as BusDB
from models.db_schemas.Line import Line as LineDB
from models.BusModel import BusCreate, BusUpdate, BusResponse
from models.errors.Errors import (
    AdminRequiredError,
    BusAlreadyExistsError,
    BusNotFoundError,
    LineNotFoundError,
)

router = APIRouter(
    prefix="/buses",
    tags=["buses"],
)


def _require_admin(user: dict):
    if user.get("roles") != "Admin":
        raise AdminRequiredError()


def _serialize(bus: BusDB, line_name) -> dict:
    return {
        "id": bus.id,
        "name": bus.name,
        "line_id": bus.line_id,
        "line_name": line_name,
    }


@router.get("", response_model=List[BusResponse])
async def get_buses(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """List every bus with its assigned line.

    Any authenticated account can read this (the driver app uses it to know
    which line a bus belongs to); only admins can mutate it below."""
    rows = (
        db.query(BusDB, LineDB.name)
        .outerjoin(LineDB, BusDB.line_id == LineDB.id)
        .order_by(BusDB.name)
        .all()
    )
    return [_serialize(bus, line_name) for bus, line_name in rows]


@router.post("", response_model=BusResponse)
async def create_bus(
    data: BusCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    _require_admin(current_user)

    name = data.name.strip()
    if db.query(BusDB).filter(BusDB.name == name).first():
        raise BusAlreadyExistsError()

    line = db.query(LineDB).filter(LineDB.id == data.line_id).first()
    if not line:
        raise LineNotFoundError()

    bus = BusDB(name=name, line_id=data.line_id)
    db.add(bus)
    db.commit()
    db.refresh(bus)

    return _serialize(bus, line.name)


@router.put("/{bus_id}", response_model=BusResponse)
async def update_bus(
    bus_id: int,
    data: BusUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    _require_admin(current_user)

    bus = db.query(BusDB).filter(BusDB.id == bus_id).first()
    if not bus:
        raise BusNotFoundError()

    if data.name is not None:
        name = data.name.strip()
        clash = (
            db.query(BusDB)
            .filter(BusDB.name == name, BusDB.id != bus_id)
            .first()
        )
        if clash:
            raise BusAlreadyExistsError()
        bus.name = name

    if data.line_id is not None:
        line = db.query(LineDB).filter(LineDB.id == data.line_id).first()
        if not line:
            raise LineNotFoundError()
        bus.line_id = data.line_id

    db.commit()
    db.refresh(bus)

    line_name = db.query(LineDB.name).filter(LineDB.id == bus.line_id).scalar()
    return _serialize(bus, line_name)


@router.delete("/{bus_id}")
async def delete_bus(
    bus_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    _require_admin(current_user)

    bus = db.query(BusDB).filter(BusDB.id == bus_id).first()
    if not bus:
        raise BusNotFoundError()

    db.delete(bus)
    db.commit()

    return {
        "message": "Bus deleted successfully",
        "deleted_id": bus_id,
    }
