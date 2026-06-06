from sqlalchemy.orm import Session

from models.db_schemas.Route import Route
from models.db_schemas.Station import Station


def load_route(
    db: Session,
    line_id: int
):

    return (
        db.query(Route)
        .filter(
            Route.line_id == line_id
        )
        .order_by(
            Route.order_index
        )
        .all()
    )


def load_stations(
    db: Session,
    line_id: int
):

    return (
        db.query(Station)
        .filter(
            Station.line_id == line_id
        )
        .order_by(
            Station.order_index
        )
        .all()
    )