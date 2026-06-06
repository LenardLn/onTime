from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import get_db
from models.LocationModel import LocationUpdate
from models.db_schemas.Bus import Bus
from models.db_schemas.BusLocation import BusLocation
from models.errors.Errors import BusNotFoundError
from helpers.get_current_user import get_current_user
from datetime import datetime
import pytz

router = APIRouter()


@router.post("/locations")
async def save_location(
    data: LocationUpdate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """Receive a GPS update from the driver app and store it in bus_locations.

    Requires a valid driver token (Bearer header from the app), so anonymous
    clients can no longer inject fake positions."""
    bus = db.query(Bus).filter(Bus.id == data.bus_id).first()
    if not bus:
        raise BusNotFoundError()

    utc_dt = datetime.utcfromtimestamp(data.tst).replace(tzinfo=pytz.utc)
    local_tz = pytz.timezone("Europe/Bucharest")
    local_time = utc_dt.astimezone(local_tz).replace(tzinfo=None)

    location = BusLocation(
        line_id=bus.line_id,
        lat=data.lat,
        lon=data.lon,
        vel=data.vel if data.vel is not None else 0,
        time=local_time,
        bus_id=bus.id,
        bus_name=bus.name,
    )

    db.add(location)
    db.commit()
    db.refresh(location)

    return {
        "status": "ok",
        "data": {
            "id": location.id,
            "bus_id": location.bus_id,
            "bus_name": location.bus_name,
            "line_id": location.line_id,
            "lat": location.lat,
            "lon": location.lon,
            "vel": location.vel,
            "time": str(location.time),
        },
    }
