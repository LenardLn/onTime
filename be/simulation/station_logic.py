from geopy.distance import geodesic


def is_near_station(
    bus_position,
    station,
    threshold_meters=20
):
    """
    bus_position = (lat, lon)
    station = Station object
    """

    distance = geodesic(
        bus_position,
        (
            station.lat,
            station.long
        )
    ).meters

    return distance <= threshold_meters