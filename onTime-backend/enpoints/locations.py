from fastapi import APIRouter
from db import engine
from models import LocationModel
from datetime import datetime
import pytz
from helpers import logger

router = APIRouter()


@router.post("/locations")
async def save_location(data: LocationModel):
    """Process OwnTracks JSON and save to DB."""
    try:
        topic = getattr(data, "topic", "")
        user_id, device_id = "unknown", "unknown"
        if topic:
            parts = topic.split("/")
            if len(parts) >= 3:
                user_id = parts[1]
                device_id = parts[2]

        tst_local = None
        if data.tst:
            utc_dt = datetime.utcfromtimestamp(
                data.tst).replace(tzinfo=pytz.utc)
            local_tz = pytz.timezone("Europe/Bucharest")
            tst_local = utc_dt.astimezone(local_tz).replace(tzinfo=None)

        processed = {
            "user_id": user_id,
            "device_id": device_id,
            "lat": data.lat,
            "lon": data.lon,
            "tst": tst_local,
            "batt": data.batt,
            "acc": data.acc,
            "alt": data.alt,
            "speed": data.vel
        }

        with engine.connect() as conn:
            conn.execute(
                """
                INSERT INTO locations (
                    user_id, device_id, lat, lon, tst, batt, acc, alt, speed
                ) VALUES (
                    :user_id, :device_id, :lat, :lon, :tst, :batt, :acc, :alt, :speed
                )
                """,
                processed
            )
            conn.commit()

        return {"status": "ok", "data": processed}\

    except Exception as e:
        logger.error(f"Error saving location: {e}")
        return {"status": "error", "message": str(e)}
