def speed_statistics(df):

    return {
        "avg_speed": df["vel"].mean(),
        "max_speed": df["vel"].max(),
        "min_speed": df["vel"].min(),
        "median_speed": df["vel"].median(),
        "std_speed": df["vel"].std()
    }
    
def speed_by_route(df):

    return (
        df.groupby("line_name")
        ["vel"]
        .mean()
        .reset_index(
            name="avg_speed"
        )
    )
    
def speed_by_hour(df):

    df["hour"] = df["time"].dt.hour

    return (
        df.groupby("hour")
        ["vel"]
        .mean()
        .reset_index(
            name="avg_speed"
        )
    )
    
def speed_by_bus(df):

    return (
        df.groupby(
            ["bus_id", "bus_name"]
        )["vel"]
        .mean()
        .reset_index(
            name="avg_speed"
        )
        .sort_values(
            by="avg_speed",
            ascending=False
        )
    )
    
def fastest_bus(df):

    return (
        speed_by_bus(df)
        .head(1)
    )
    
def slowest_bus(df):

    return (
        speed_by_bus(df)
        .tail(1)
    )