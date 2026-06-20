import matplotlib.pyplot as plt


def route_usage_chart(df):

    plt.figure(figsize=(10, 6))

    plt.bar(
        df["line_name"],
        df["records"]
    )

    plt.title("Route Usage")
    plt.xlabel("Route")
    plt.ylabel("Records")

    plt.tight_layout()

    plt.savefig(
        "exports/route_usage.png"
    )

    plt.close()


def speed_distribution(df):

    plt.figure(figsize=(12, 6))

    plt.hist(
        df["vel"],
        bins=30
    )

    plt.title("Speed Distribution")
    plt.xlabel("Speed (km/h)")
    plt.ylabel("Frequency")

    plt.tight_layout()

    plt.savefig(
        "exports/speed_distribution.png"
    )

    plt.close()


def speed_by_route_chart(df):

    plt.figure(figsize=(10, 6))

    plt.bar(
        df["line_name"],
        df["avg_speed"]
    )

    plt.title("Average Speed By Route")
    plt.xlabel("Route")
    plt.ylabel("Average Speed (km/h)")

    plt.tight_layout()

    plt.savefig(
        "exports/speed_by_route.png"
    )

    plt.close()


def speed_by_hour_chart(df):

    plt.figure(figsize=(12, 6))

    plt.plot(
        df["hour"],
        df["avg_speed"],
        marker="o"
    )

    plt.title("Average Speed By Hour")
    plt.xlabel("Hour")
    plt.ylabel("Average Speed (km/h)")

    plt.grid(True)

    plt.tight_layout()

    plt.savefig(
        "exports/speed_by_hour.png"
    )

    plt.close()


def distance_by_route_chart(df):

    plt.figure(figsize=(10, 6))

    plt.bar(
        df["line_name"],
        df["distance_km"]
    )

    plt.title("Distance Travelled By Route")
    plt.xlabel("Route")
    plt.ylabel("Distance (km)")

    plt.tight_layout()

    plt.savefig(
        "exports/distance_by_route.png"
    )

    plt.close()


def distance_by_bus_chart(df):

    plt.figure(figsize=(14, 7))

    plt.bar(
        df["bus_name"],
        df["distance_km"]
    )

    plt.title("Distance Travelled By Bus")
    plt.xlabel("Bus")
    plt.ylabel("Distance (km)")

    plt.xticks(rotation=45)

    plt.tight_layout()

    plt.savefig(
        "exports/distance_by_bus.png"
    )

    plt.close()


def top_10_buses_chart(df):

    plt.figure(figsize=(12, 6))

    plt.barh(
        df["bus_name"],
        df["distance_km"]
    )

    plt.title("Top 10 Buses By Distance")
    plt.xlabel("Distance (km)")
    plt.ylabel("Bus")

    plt.tight_layout()

    plt.savefig(
        "exports/top_10_buses.png"
    )

    plt.close()


def congestion_chart(df):

    plt.figure(figsize=(10, 6))

    plt.hist(
        df["vel"],
        bins=20
    )

    plt.axvline(
        x=10,
        linestyle="--"
    )

    plt.title("Congestion Distribution")
    plt.xlabel("Speed (km/h)")
    plt.ylabel("Frequency")

    plt.tight_layout()

    plt.savefig(
        "exports/congestion_distribution.png"
    )

    plt.close()


def route_comparison_chart(df):

    plt.figure(figsize=(10, 6))

    plt.bar(
        df["line_name"],
        df["records"]
    )

    plt.title("Route Comparison")
    plt.xlabel("Route")
    plt.ylabel("Collected Records")

    plt.tight_layout()

    plt.savefig(
        "exports/route_comparison.png"
    )

    plt.close()
    
def activity_by_hour_chart(df):

    plt.figure(figsize=(12, 6))

    plt.plot(
        df["hour"],
        df["records"],
        marker="o"
    )

    plt.title("Activity By Hour")
    plt.xlabel("Hour")
    plt.ylabel("GPS Records")

    plt.grid(True)

    plt.tight_layout()

    plt.savefig(
        "exports/activity_by_hour.png"
    )

    plt.close()
    

def activity_by_weekday_chart(df):

    plt.figure(figsize=(12, 6))

    plt.bar(
        df["weekday"],
        df["records"]
    )

    plt.title("Activity By Weekday")
    plt.xlabel("Weekday")
    plt.ylabel("Records")

    plt.xticks(rotation=45)

    plt.tight_layout()

    plt.savefig(
        "exports/activity_by_weekday.png"
    )

    plt.close()
    

def route_activity_share_chart(df):

    plt.figure(figsize=(8, 8))

    plt.pie(
        df["percentage"],
        labels=df["line_name"],
        autopct="%1.1f%%"
    )

    plt.title("Route Activity Share")

    plt.savefig(
        "exports/route_activity_share.png"
    )

    plt.close()
    

def speed_by_period_chart(df):

    plt.figure(figsize=(10, 6))

    plt.bar(
        df["period"],
        df["avg_speed"]
    )

    plt.title("Average Speed By Period")
    plt.xlabel("Period")
    plt.ylabel("Average Speed")

    plt.tight_layout()

    plt.savefig(
        "exports/speed_by_period.png"
    )

    plt.close()
    
    
def top_active_buses_chart(df):

    plt.figure(figsize=(12, 6))

    plt.barh(
        df["bus_name"],
        df["records"]
    )

    plt.title("Top Active Buses")
    plt.xlabel("GPS Records")

    plt.tight_layout()

    plt.savefig(
        "exports/top_active_buses.png"
    )

    plt.close()
    
    
def speed_by_bus_chart(df):

    plt.figure(figsize=(14, 7))

    plt.bar(
        df["bus_name"],
        df["avg_speed"]
    )

    plt.title("Average Speed By Bus")

    plt.xticks(rotation=90)

    plt.tight_layout()

    plt.savefig(
        "exports/speed_by_bus.png"
    )

    plt.close()
    
    
def speed_boxplot(df):

    plt.figure(figsize=(8, 6))

    plt.boxplot(
        df["vel"]
    )

    plt.title(
        "Speed Boxplot"
    )

    plt.ylabel(
        "Speed"
    )

    plt.savefig(
        "exports/speed_boxplot.png"
    )

    plt.close()
    
    
def speed_percentiles_chart(df):

    percentiles = [
        0.25,
        0.5,
        0.75,
        0.95,
        0.99
    ]

    values = [
        df["vel"].quantile(p)
        for p in percentiles
    ]

    plt.figure(figsize=(10, 6))

    plt.bar(
        ["25%", "50%", "75%", "95%", "99%"],
        values
    )

    plt.title(
        "Speed Percentiles"
    )

    plt.ylabel(
        "Speed"
    )

    plt.savefig(
        "exports/speed_percentiles.png"
    )

    plt.close()
    
    
def active_buses_by_hour_chart(df):

    plt.figure(figsize=(12, 6))

    plt.plot(
        df["hour"],
        df["active_buses"],
        marker="o"
    )

    plt.title(
        "Active Buses By Hour"
    )

    plt.xlabel(
        "Hour"
    )

    plt.ylabel(
        "Active Buses"
    )

    plt.grid(True)

    plt.tight_layout()

    plt.savefig(
        "exports/active_buses_by_hour.png"
    )

    plt.close()
    
    
def records_per_day_chart(df):

    plt.figure(figsize=(12, 6))

    plt.plot(
        df["date"],
        df["records"]
    )

    plt.title(
        "Records Per Day"
    )

    plt.xlabel(
        "Date"
    )

    plt.ylabel(
        "Records"
    )

    plt.xticks(rotation=45)

    plt.tight_layout()

    plt.savefig(
        "exports/records_per_day.png"
    )

    plt.close()