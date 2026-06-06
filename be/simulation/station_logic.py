from simulation.geo import distance_m


def is_near_station(
    bus_position,
    station,
    threshold_meters=20
):
    """
    bus_position = (lat, lon)
    station = Station object
    """

    distance = distance_m(
        bus_position,
        (
            station.lat,
            station.long
        )
    )

    return distance <= threshold_meters