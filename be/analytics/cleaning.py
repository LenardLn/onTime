import pandas as pd


def clean_data(df: pd.DataFrame):

    df = df.drop_duplicates()

    df = df.dropna(
        subset=[
            "lat",
            "lon",
            "vel",
            "time"
        ]
    )

    df = df[
        (df["lat"] >= -90)
        & (df["lat"] <= 90)
    ]

    df = df[
        (df["lon"] >= -180)
        & (df["lon"] <= 180)
    ]

    df["time"] = pd.to_datetime(df["time"])

    return df