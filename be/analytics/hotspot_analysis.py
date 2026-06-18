def traffic_hotspots(
    df,
    threshold=10
):

    return df[
        df["vel"] < threshold
    ]
    
def top_congestion_points(df):

    return (
        df.sort_values(
            by="vel"
        )
        .head(100)
    )