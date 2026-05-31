from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import get_db
from models.LocationModel import LocationUpdate
from models.db_schemas.Bus import Bus
from models.db_schemas.BusLocation import BusLocation
from models.errors.Errors import BusNotFoundError
from datetime import datetime
import pytz

router = APIRouter()


@router.post("/locations")
async def save_location(data: LocationUpdate, db: Session = Depends(get_db)):
    """Receive a GPS update from the driver app and store it in bus_locations."""
    bus = db.query(Bus).filter(Bus.id == data.bus_id).first()
    if not bus:
        raise BusNotFoundError()

    utc_dt = datetime.utcfromtimestamp(data.tst).replace(tzinfo=pytz.utc)
    local_tz = pytz.timezone("Europe/Bucharest")
    simulation_time = utc_dt.astimezone(local_tz).replace(tzinfo=None)

    location = BusLocation(
        line_id=bus.line_id,
        lat=data.lat,
        lon=data.lon,
        vel=data.vel if data.vel is not None else 0,
        simulation_time=simulation_time,
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
            "simulation_time": str(location.simulation_time),
        },
    }
