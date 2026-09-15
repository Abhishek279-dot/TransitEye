from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.bus import Bus

router = APIRouter(prefix="/api/buses", tags=["Buses"])


@router.get("/")
def get_buses(db: Session = Depends(get_db)):
    buses = db.scalars(select(Bus)).all()
    return [
        {
            "bus_id": bus.bus_id,
            "route_name": bus.route_name,
            "bus_status": bus.bus_status,
            "created_at": bus.created_at,
        }
        for bus in buses
    ]
