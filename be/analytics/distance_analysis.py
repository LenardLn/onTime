from math import radians, sin, cos, sqrt, atan2

import pandas as pd


def haversine_distance(
    lat1: float,
    lon1: float,
    lat2: float,
    lon2: float
) -> float:
    """
    Distance in kilometers.
    """

    r = 6371.0

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = (
        sin(dlat / 2) ** 2
        + cos(radians(lat1))
        * cos(radians(lat2))
        * sin(dlon / 2) ** 2
    )

    c = 2 * atan2(
        sqrt(a),
        sqrt(1 - a)
    )

    return r * c


def calculate_distances(df: pd.DataFrame):

    df = df.copy()

    df = df.sort_values(
        by=["bus_id", "time"]
    )

    df["prev_lat"] = (
        df.groupby("bus_id")["lat"]
        .shift(1)
    )

    df["prev_lon"] = (
        df.groupby("bus_id")["lon"]
        .shift(1)
    )

    df["segment_distance_km"] = df.apply(
        lambda row:
            haversine_distance(
                row["prev_lat"],
                row["prev_lon"],
                row["lat"],
                row["lon"]
            )
            if pd.notnull(row["prev_lat"])
            else 0,
        axis=1
    )

    return df


def total_system_distance(df):

    df = calculate_distances(df)

    return round(
        df["segment_distance_km"].sum(),
        2
    )


def total_distance_per_bus(df):

    df = calculate_distances(df)

    return (
        df.groupby("bus_name")
        ["segment_distance_km"]
        .sum()
        .reset_index()
        .rename(
            columns={
                "segment_distance_km":
                "distance_km"
            }
        )
        .sort_values(
            by="distance_km",
            ascending=False
        )
    )


def total_distance_per_route(df):

    df = calculate_distances(df)

    return (
        df.groupby("line_name")
        ["segment_distance_km"]
        .sum()
        .reset_index()
        .rename(
            columns={
                "segment_distance_km":
                "distance_km"
            }
        )
        .sort_values(
            by="distance_km",
            ascending=False
        )
    )


def average_trip_distance(df):

    df = calculate_distances(df)

    return (
        df.groupby("bus_name")
        ["segment_distance_km"]
        .sum()
        .mean()
    )


def top_10_buses_by_distance(df):

    return (
        total_distance_per_bus(df)
        .head(10)
    )
    

def most_active_bus(df):

    return (
        df.groupby(
            ["bus_id", "bus_name"]
        )
        .size()
        .reset_index(
            name="records"
        )
        .sort_values(
            by="records",
            ascending=False
        )
        .head(1)
    )
    
def top_10_active_buses(df):

    return (
        df.groupby(
            ["bus_id", "bus_name"]
        )
        .size()
        .reset_index(
            name="records"
        )
        .sort_values(
            by="records",
            ascending=False
        )
        .head(10)
    )