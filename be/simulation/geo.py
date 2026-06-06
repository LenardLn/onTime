from math import radians, sin, cos, asin, sqrt

EARTH_RADIUS_M = 6_371_000


def distance_m(a, b):
    """Great-circle (haversine) distance in meters between (lat, lon) points."""
    lat1, lon1 = a
    lat2, lon2 = b

    d_lat = radians(lat2 - lat1)
    d_lon = radians(lon2 - lon1)

    h = (
        sin(d_lat / 2) ** 2
        + cos(radians(lat1)) * cos(radians(lat2)) * sin(d_lon / 2) ** 2
    )

    return 2 * EARTH_RADIUS_M * asin(sqrt(h))
