from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from helpers.get_current_user import get_current_user
from db import get_db
from models.db_schemas.User import User

router = APIRouter(
    prefix="/logout",
    tags=["auth"],
)


@router.post("")
def logout(
    response: Response,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    db.query(User).filter(User.id == user["id"]).update(
        {"token_version": User.token_version + 1}
    )
    db.commit()

    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=True,
        samesite="none"
    )

    return {"message": "logged out"}
