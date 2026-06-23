import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parents[1]))

# Romanian station names (ă, ț, ș) would crash print() on a non-UTF-8 console.
try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass
import time
from datetime import datetime, timedelta
from db import SessionLocal
from simulation.movement import move_toward
from simulation.geo import distance_m
from models.db_schemas.BusLocation import BusLocation
import random
from simulation.route_loader import load_route, load_stations
from simulation.station_logic import is_near_station
from models.db_schemas.Bus import Bus
from models.db_schemas.Route import Route

def passenger_probability(time):

    current_hour = time.hour
    if 6 <= current_hour < 8:
        return 1.00
    elif 8 <= current_hour < 12:
        return 0.95
    elif 12 <= current_hour < 15:
        return 0.80
    elif 15 <= current_hour < 18:
        return 0.75
    elif 18 <= current_hour < 21:
        return 0.60
    else:
        return 0.50


db = SessionLocal()

# Simulate every line that actually has a route drawn — no hard-coded ids, so
# whatever lines an admin has created routes for get buses automatically.
line_ids = [row[0] for row in db.query(Route.line_id).distinct().all()]

# Any bus can run any route (any driver can drive any bus), so keep a global
# pool and hand 5 buses to each route — preferring the line's own buses, then
# topping up from the rest. Each bus is used on only one route so its bus_id
# never appears on two lines at once.
all_buses = db.query(Bus).all()
used_bus_ids: set = set()

BUSES_PER_ROUTE = 5

buses = []

for line_id in line_ids:

    waypoints = load_route(
        db,
        line_id
    )

    # A route needs at least two points to move along.
    if len(waypoints) < 2:
        continue

    own = [
        b for b in all_buses
        if b.line_id == line_id and b.id not in used_bus_ids
    ]
    others = [
        b for b in all_buses
        if b.line_id != line_id and b.id not in used_bus_ids
    ]
    chosen = (own + others)[:BUSES_PER_ROUTE]
    count = len(chosen)
    if count == 0:
        continue

    stations = load_stations(db, line_id)

    for i, bus_record in enumerate(chosen):

        used_bus_ids.add(bus_record.id)

        start_index = min((i * len(waypoints)) // count, len(waypoints) - 1)

        start_index = min((i * len(waypoints)) // count, len(waypoints) - 1)

        buses.append(
            {
                "bus_id": bus_record.id,
                "bus_name": bus_record.name,
                "line_id": line_id,
                "waypoints": waypoints,
                "stations": stations,
                "current_index": start_index,
                "current_speed": 25,
                "visited_stations": set(),
                "traffic_factor": random.uniform(
                    0.8,
                    1.2
                ),
                "time": datetime.now(), # datetime(2026,6,1,6,0,0),
                "position": (
                    waypoints[start_index].lat,
                    waypoints[start_index].long
                ),
                "completed_routes": 0
            }
        )

# Run continuously until the /simulation/stop endpoint terminates this process.
while True:
    for bus in buses:
        if bus['current_speed'] < 40:
            bus['current_speed'] += random.uniform(3,6)
        else:
            bus['current_speed'] += random.uniform(-2,2)
                
        if random.random() < 0.05:
            bus['traffic_factor'] = random.uniform(
                0.8,
                1.2
            )

        speed = (
            bus['current_speed'] * bus['traffic_factor']
        )
        
        # Advance along the route by the distance the bus covers in this
        # 5-second step (matching the 5s write cadence below), crossing as many
        # of the dense (~40 m) waypoints as the current speed allows. Keeping it
        # real-time means each map update moves the bus a smaller, smoother step
        # instead of teleporting ~100 m.
        budget_m = (speed / 3.6) * 5
        arrived = False

        while budget_m > 0:
            next_index = bus['current_index'] + 1
            target = (
                bus['waypoints'][next_index].lat,
                bus['waypoints'][next_index].long
            )
            seg = distance_m(bus['position'], target)

            if seg > budget_m:
                # Partial move toward the next waypoint; budget used up.
                ratio = budget_m / seg
                bus['position'] = (
                    bus['position'][0] + (target[0] - bus['position'][0]) * ratio,
                    bus['position'][1] + (target[1] - bus['position'][1]) * ratio,
                )
                break

            # Reached the next waypoint; keep going with the remaining budget.
            bus['position'] = target
            budget_m -= seg
            bus['current_index'] = next_index
            arrived = True

            if bus['current_index'] >= len(bus['waypoints']) - 1:
                bus['completed_routes'] += 1
                print(
                    f"Bus {bus['bus_name']} completed "
                    f"{bus['completed_routes']} routes"
                )
                # Loop the route again; the simulator runs until it's stopped.
                bus['current_index'] = 0
                bus['position'] = (
                    bus['waypoints'][0].lat,
                    bus['waypoints'][0].long
                )
                bus['visited_stations'].clear()
                bus['traffic_factor'] = random.uniform(0.8, 1.2)
                break

        if random.random() < 0.05:
            print("Approaching red light...")
            bus['current_speed'] = max(bus['current_speed'] - random.uniform(5,10),0)
            
            if bus['current_speed'] < 5:
                red_light_time = random.randint(15,60)
                print(f"Red light. Waiting {red_light_time} seconds...")
                bus['time'] += timedelta(seconds=red_light_time)
        
        location = BusLocation(
            bus_id=bus['bus_id'],
            bus_name=bus['bus_name'],
            line_id=bus['line_id'],
            lat=bus['position'][0],
            lon=bus['position'][1],
            vel=speed,
            time=bus['time']
        )

        db.add(location)

        print(
            f"Line: {bus['line_id']} | "
            f"Bus: {bus['bus_name']} |"
            f"SimTime: {bus['time'].strftime('%H:%M:%S')} | "
            f"Speed: {round(speed,1)} km/h | "
            f"Arrived: {arrived}"
        )
        
        for station in bus['stations']:

            if station.station_id in bus['visited_stations']:
                continue
            
            
            if is_near_station(
                bus['position'],
                station
            ):

                print(
                    "Station ID:",
                    station.id
                )
            
                bus['visited_stations'].add(
                    station.station_id
                )

                has_passenger = (
                    random.random() < passenger_probability(bus['time'])
                )
                
                if has_passenger:
                    bus['current_speed'] = 0
                    wait_time = random.randint(5,15)
                    print(f"Station reached: {station.name}")
                    print(f"Waiting {wait_time} seconds...")
                    bus['time'] += timedelta(seconds=wait_time)
                    
                else:
                    print(f"Station skipped: {station.name}")

        bus['time'] += timedelta(
            seconds=5
        )

    db.commit()
    # Write each bus's position once every 5 real seconds, like the phone app.
    time.sleep(5)