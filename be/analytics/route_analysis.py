import pandas as pd


def trips_per_route(df):

    result = (
        df.groupby("line_name")
        .size()
        .reset_index(name="records")
        .sort_values(
            by="records",
            ascending=False
        )
    )

    return result

def buses_per_route(df):

    return (
        df.groupby("line_name")["bus_id"]
        .nunique()
        .reset_index(
            name="bus_count"
        )
    )
    
def busiest_route(df):

    return (
        trips_per_route(df)
        .head(1)
    )
    
def least_used_route(df):

    return (
        trips_per_route(df)
        .tail(1)
    )