import pandas as pd


def activity_by_hour(df: pd.DataFrame):

    temp = df.copy()

    temp["hour"] = temp["time"].dt.hour

    return (
        temp.groupby("hour")
        .size()
        .reset_index(name="records")
        .sort_values("hour")
    )


def activity_by_weekday(df: pd.DataFrame):

    temp = df.copy()

    temp["weekday"] = temp["time"].dt.day_name()

    return (
        temp.groupby("weekday")
        .size()
        .reset_index(name="records")
    )


def busiest_hour(df: pd.DataFrame):

    hourly = activity_by_hour(df)

    return hourly.loc[
        hourly["records"].idxmax()
    ]


def active_buses_by_hour(df: pd.DataFrame):

    temp = df.copy()

    temp["hour"] = temp["time"].dt.hour

    return (
        temp.groupby("hour")["bus_id"]
        .nunique()
        .reset_index(name="active_buses")
        .sort_values("hour")
    )


def trips_by_hour(df: pd.DataFrame):

    temp = df.copy()

    temp["hour"] = temp["time"].dt.hour

    return (
        temp.groupby("hour")["line_id"]
        .count()
        .reset_index(name="gps_records")
        .sort_values("hour")
    )


def peak_traffic_windows(
    df: pd.DataFrame,
    top_n: int = 3
):

    hourly = activity_by_hour(df)

    return (
        hourly.sort_values(
            by="records",
            ascending=False
        )
        .head(top_n)
    )


def activity_by_route_and_hour(df: pd.DataFrame):

    temp = df.copy()

    temp["hour"] = temp["time"].dt.hour

    return (
        temp.groupby(
            ["line_name", "hour"]
        )
        .size()
        .reset_index(name="records")
        .sort_values(
            ["line_name", "hour"]
        )
    )


def first_record_time(df: pd.DataFrame):

    return df["time"].min()


def last_record_time(df: pd.DataFrame):

    return df["time"].max()


def dataset_duration_hours(df: pd.DataFrame):

    duration = (
        df["time"].max()
        - df["time"].min()
    )

    return round(
        duration.total_seconds() / 3600,
        2
    )


def records_per_day(df: pd.DataFrame):

    temp = df.copy()

    temp["date"] = temp["time"].dt.date

    return (
        temp.groupby("date")
        .size()
        .reset_index(name="records")
        .sort_values("date")
    )


def active_buses_per_day(df: pd.DataFrame):

    temp = df.copy()

    temp["date"] = temp["time"].dt.date

    return (
        temp.groupby("date")["bus_id"]
        .nunique()
        .reset_index(name="active_buses")
    )


def route_activity_share(df: pd.DataFrame):

    total = len(df)

    result = (
        df.groupby("line_name")
        .size()
        .reset_index(name="records")
    )

    result["percentage"] = (
        result["records"] / total
    ) * 100

    return result.sort_values(
        by="percentage",
        ascending=False
    )
    
    
def quietest_hour(df):

    hourly = activity_by_hour(df)

    return hourly.loc[
        hourly["records"].idxmin()
    ]
    
    
def speed_by_period(df):

    temp = df.copy()

    temp["hour"] = temp["time"].dt.hour

    def period(hour):

        if 6 <= hour < 12:
            return "Morning"

        if 12 <= hour < 18:
            return "Afternoon"

        if 18 <= hour < 24:
            return "Evening"

        return "Night"

    temp["period"] = temp["hour"].apply(period)

    return (
        temp.groupby("period")
        ["vel"]
        .mean()
        .reset_index(
            name="avg_speed"
        )
    )