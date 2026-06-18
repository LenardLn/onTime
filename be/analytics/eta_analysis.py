from distance_analysis import haversine_distance

def eta_minutes(
    distance_km,
    speed_kmh
):

    if speed_kmh <= 0:
        return None

    return (
        distance_km / speed_kmh
    ) * 60
    

def current_eta(
    bus_lat,
    bus_lon,
    station_lat,
    station_lon,
    speed
):

    distance = haversine_distance(
        bus_lat,
        bus_lon,
        station_lat,
        station_lon
    )

    return eta_minutes(
        distance,
        speed
    )
    

import pandas as pd

from distance_analysis import (
    haversine_distance
)


def nearest_station(
    bus_lat,
    bus_lon,
    stations_df
):

    nearest = None

    min_distance = float("inf")

    for _, station in stations_df.iterrows():

        distance = haversine_distance(
            bus_lat,
            bus_lon,
            station["lat"],
            station["long"]
        )

        if distance < min_distance:

            min_distance = distance

            nearest = station

    return nearest


def eta_for_bus(
    bus_row,
    stations_df
):

    station = nearest_station(
        bus_row["lat"],
        bus_row["lon"],
        stations_df
    )

    eta = current_eta(
        bus_row["lat"],
        bus_row["lon"],
        station["lat"],
        station["long"],
        bus_row["vel"]
    )

    return {
        "bus_id": bus_row["bus_id"],
        "bus_name": bus_row["bus_name"],
        "line_id": bus_row["line_id"],
        "nearest_station": station["name"],
        "speed": round(bus_row["vel"], 2),
        "eta_minutes": round(eta, 2)
        if eta is not None
        else None
    }
    
    
def eta_for_all_buses(
    bus_df,
    stations_df
):

    results = []

    latest_positions = (
        bus_df
        .sort_values("time")
        .groupby("bus_id")
        .tail(1)
    )

    for _, bus in latest_positions.iterrows():

        results.append(
            eta_for_bus(
                bus,
                stations_df
            )
        )

    return pd.DataFrame(results)