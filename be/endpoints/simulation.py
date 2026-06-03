from fastapi import APIRouter
import subprocess
import sys
from pathlib import Path
from db import SessionLocal
from sqlalchemy import text
from fastapi import Query

router = APIRouter(
    prefix="/simulation",
    tags=["Simulation"]
)


@router.post("/start")
def start_simulation():

    simulation_path = (
        Path(__file__)
        .resolve()
        .parents[1]
        / "simulation"
        / "bus_simulation.py"
    )

    subprocess.Popen(
        [
            sys.executable,
            str(simulation_path)
        ]
    )

    return {
        "message": "Simulation started"
    }
    
@router.get("/live")
def get_live_buses(
    line_id: int | None = Query(
        default=None
    )
):
    db = SessionLocal()

    if line_id:

        query = """
        SELECT DISTINCT ON (bus_id)
            bus_id,
            bus_name,
            line_id,
            lat,
            lon,
            vel,
            time
        FROM bus_locations
        WHERE line_id = :line_id
        ORDER BY
            bus_id,
            time DESC
        """

        result = db.execute(
            text(query),
            {
                "line_id": line_id
            }
        )

    else:

        query = """
        SELECT DISTINCT ON (bus_id)
            bus_id,
            bus_name,
            line_id,
            lat,
            lon,
            vel,
            time
        FROM bus_locations
        ORDER BY
            bus_id,
            time DESC
        """

        result = db.execute(
            text(query)
        )

    return [
        dict(row._mapping)
        for row in result
    ]