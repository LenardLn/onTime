from simulation.geo import distance_m


"""
Moves a simulated bus towards the next route point.

The bus does not instantly jump from one route point to another.
If the next point is farther away than the distance that can be
covered during the current simulation step, an intermediate position
is generated and returned with arrived=False.

This means that multiple coordinates may be produced before a route
point is finally reached. Once the target point is reached,
arrived=True is returned and the simulator proceeds to the next
route point.
"""

def move_toward(
    current,
    target,
    speed_kmh,
    seconds
):
    """
    current = (lat, lon)
    target = (lat, lon)
    """

    meters_per_second = speed_kmh / 3.6

    distance_can_move = (
        meters_per_second * seconds
    )

    total_distance = distance_m(current, target)

    if total_distance <= distance_can_move:
        return target, True

    ratio = (
        distance_can_move / total_distance
    )

    new_lat = (
        current[0]
        + (target[0] - current[0]) * ratio
    )

    new_lon = (
        current[1]
        + (target[1] - current[1]) * ratio
    )

    return (
        (new_lat, new_lon),
        False
    )