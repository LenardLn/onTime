from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from db import get_db
from sqlalchemy.orm import Session
from models.RouteModel import Route, RouteCreate, RouteUpdate
from helpers.get_current_user import get_current_user
from models.db_schemas.Route import Route as RouteDB
from models.db_schemas.Station import Station as StationDB
from datetime import datetime, timezone
from models.db_schemas.User import User as UserDB
from models.errors.Errors import RouteNotFoundError, StationNotFoundError, LineNotFoundError

router = APIRouter()

router = APIRouter(
    prefix="/route",
    tags=["route"],
)


@router.get("/", response_model=Route)
async def get_routes(
    line_ids: Optional[List[int]] = Query(default=None),
    station_ids: Optional[List[int]] = Query(default=None),
    db: Session = Depends(get_db)
):
    query = db.query(RouteDB, UserDB).join(
        UserDB,
        RouteDB.created_by == UserDB.id
    )
        

    if station_ids:
        lines = db.query(StationDB.line_id).filter(
            StationDB.station_id.in_(station_ids)
        ).distinct().all()

        if not lines:
            raise StationNotFoundError()

        station_line_ids = [line[0] for line in lines]

        if line_ids:
            line_ids = list(set(line_ids) & set(station_line_ids))
        else:
            line_ids = station_line_ids

    if line_ids:
        query = query.filter(RouteDB.line_id.in_(line_ids))
        

    rows = query.order_by(
        RouteDB.line_id,
        RouteDB.order_index
    ).all()
    
    if not rows:
        raise LineNotFoundError()

    latest_route, latest_user =  max(
        rows,
        key=lambda row: row[0].created_at
    )

    return {
        "routes": [
            {
                "id": route.id,
                "lat": route.lat,
                "long": route.long,
                "line_id": route.line_id,
                "order_index": route.order_index,
            }
            for route, _ in rows
        ],
        "created_at": str(latest_route.created_at),
        "created_by": {
            "id": latest_user.id,
            "email": latest_user.email,
        } if latest_user else None,
    }
    
# individual create for now, will need to be able to add array of items
@router.post("", response_model=Route)
async def create_route(data: RouteCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):

    new_route = RouteDB(
        lat=data.lat,
        long=data.long,
        line_id=data.line_id,
        created_by=user["id"],
        order_index=data.order_index,
        created_at=datetime.now(timezone.utc)
    )

    db.add(new_route)
    db.commit()
    db.refresh(new_route)

    return {
        "routes": [{
            "id": new_route.id,
            "lat": new_route.lat,
            "long": new_route.long,
            "line_id": new_route.line_id,
            "order_index": new_route.order_index,
        }],
        "created_at": str(new_route.created_at),
        "created_by": {
            "id": user["id"],
            "email": user["email"],
        }
    }

@router.put("/{id}", response_model=Route)
async def update_route(
    id: int,
    data: RouteUpdate,
    db: Session = Depends(get_db),
):
    route = db.query(RouteDB).filter(RouteDB.id == id).first()

    if not route:
        raise RouteNotFoundError()

    if data.lat is not None:
        route.lat = data.lat
    if data.long is not None:
        route.long = data.long
    if data.line_id is not None:
        route.line_id = data.line_id
    if data.order_index is not None:
        route.order_index = data.order_index

    db.commit()
    db.refresh(route)

    user = db.query(UserDB).filter(UserDB.id == route.created_by).first()

    return {
        "routes": [{
            "id": route.id,
            "lat": route.lat,
            "long": route.long,
            "line_id": route.line_id,
            "order_index": route.order_index,
        }],
        "created_at": str(route.created_at),
        "created_by": {
            "id": user.id,
            "email": user.email,
        } if user else None,
    }
    
@router.delete("/line/{line_id}")
async def delete_route_by_line(
    line_id: int,
    db: Session = Depends(get_db),
):
    
    deleted_count = db.query(RouteDB).filter(RouteDB.line_id == line_id).delete(synchronize_session=False)

    if deleted_count == 0:
        raise RouteNotFoundError()

    db.commit()

    return {
        "message": "All routes deleted for line_id",
        "line_id": line_id,
        "deleted_count": deleted_count
    }