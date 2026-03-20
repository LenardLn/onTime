from fastapi import APIRouter
from models.BusModel import BusCreate
from sql.buses_sql import CREATE_BUS, GET_ALL_BUSES
from helpers import logger
from db import engine
from sqlalchemy import text


router = APIRouter()

router = APIRouter(
    prefix="/bus",
    tags=["bus"],
)


@router.post("/")
async def create_bus(data: BusCreate):
    print(data.name)
    try:
        with engine.connect() as conn:
            conn.execute(text(CREATE_BUS), {"name": data.name})
            conn.commit()
        return data

    except Exception as e:
        logger.error(f"Error fetching buses: {e}")
        return {"status": "error", "message": str(e)}


@router.get("/")
async def get_all_buses():
    try:
        with engine.connect() as conn:
            result = conn.execute(text(GET_ALL_BUSES)).mappings().all()    # // transform data to be of type {id: name:}
            return result

    except Exception as e:
        logger.error(f"Error fetching buses: {e}")
        return {"status": "error", "message": str(e)}
