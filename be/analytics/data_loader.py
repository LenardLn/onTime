import pandas as pd
from sqlalchemy import create_engine

from config import DATABASE_URL

engine = create_engine(DATABASE_URL)


def load_bus_locations():
    query = """
        SELECT
            bl.id,
            bl.line_id,
            bl.lat,
            bl.lon,
            bl.vel,
            bl.time,
            bl.bus_id,
            bl.bus_name,
            l.name as line_name
        FROM bus_locations bl
        LEFT JOIN lines l
            ON bl.line_id = l.id
    """

    return pd.read_sql(query, engine)


def load_stations():

    query = """
        SELECT
            id,
            name,
            line_id,
            lat,
            long,
            order_index
        FROM stations
    """

    return pd.read_sql(
        query,
        engine
    )