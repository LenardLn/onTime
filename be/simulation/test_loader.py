import sys
from pathlib import Path

sys.path.append(
    str(Path(__file__).resolve().parents[1])
)

import models.db_schemas

from db import SessionLocal
from simulation.route_loader import load_waypoints
from models.db_schemas.Line import Line

db = SessionLocal()

waypoints = load_waypoints(
    db,
    8
)

print(
    f"Waypoint count: {len(waypoints)}"
)

for p in waypoints[:10]:
    print(
        p.order_index,
        p.lat,
        p.long
    )
    
from simulation.route_loader import load_stations

stations = load_stations(
    db,
    8
)

print(
    f"Stations: {len(stations)}"
)

for s in stations[:10]:
    print(
        s.name,
        s.lat,
        s.long
    )
    
from simulation.station_logic import is_near_station

first_station = stations[0]

print(
    is_near_station(
        (
            first_station.lat,
            first_station.long
        ),
        first_station
    )
)