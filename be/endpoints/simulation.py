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

# Track the running simulation so we never have two runs writing conflicting
# positions for the same bus ids (which makes the live view jump back/forward).
_sim_process: subprocess.Popen | None = None


@router.post("/start")
def start_simulation():
    global _sim_process

    # Stop any simulation that is still running before starting a fresh one.
    if _sim_process is not None and _sim_process.poll() is None:
        _sim_process.terminate()
        try:
            _sim_process.wait(timeout=5)
        except Exception:
            _sim_process.kill()

    simulation_path = (
        Path(__file__)
        .resolve()
        .parents[1]
        / "simulation"
        / "bus_simulation.py"
    )

    _sim_process = subprocess.Popen(
        [
            sys.executable,
            str(simulation_path)
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    return {
        "message": "Simulation started"
    }


@router.post("/stop")
def stop_simulation():
    global _sim_process

    if _sim_process is not None and _sim_process.poll() is None:
        _sim_process.terminate()
        try:
            _sim_process.wait(timeout=5)
        except Exception:
            _sim_process.kill()

    _sim_process = None

    return {
        "message": "Simulation stopped"
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
            id DESC
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
            id DESC
        """

        result = db.execute(
            text(query)
        )

    return [
        dict(row._mapping)
        for row in result
    ]