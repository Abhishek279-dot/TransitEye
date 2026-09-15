from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Incident, Bus
from app.schemas import IncidentCreate, IncidentOut, IncidentUpdate

router = APIRouter(prefix="/incidents", tags=["incidents"])

VALID_STATUSES = ["Detected", "Verified", "Assigned", "Action Taken", "Resolved"]


@router.post("", response_model=IncidentOut, status_code=201)
def create_incident(incident: IncidentCreate, db: Session = Depends(get_db)):
    """Receives an event JSON from the AI/ML side and stores it."""

    # Confirm the bus_id actually exists before inserting (avoids FK errors)
    bus_exists = db.query(Bus).filter(Bus.bus_id == incident.bus_id).first()
    if not bus_exists:
        raise HTTPException(status_code=404, detail=f"Bus '{incident.bus_id}' not found. Add it to the buses table first.")

    if incident.status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {VALID_STATUSES}")

    db_incident = Incident(
    bus_id=incident.bus_id,
    event_type=incident.event_type,
    confidence=incident.confidence,
    latitude=incident.latitude,
    longitude=incident.longitude,
    incidents_status=incident.status,
    plate_number=incident.plate_number,
    location_name=incident.location_name,
    notes=incident.notes,
)
    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)
    return db_incident


@router.get("", response_model=List[IncidentOut])
def get_incidents(
    event_type: Optional[str] = None,
    status: Optional[str] = None,
    bus_id: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Returns incidents for the frontend dashboard, with optional filters."""
    query = db.query(Incident)

    if event_type:
        query = query.filter(Incident.event_type == event_type)
    if status:
        query = query.filter(Incident.incidents_status == status)
    if bus_id:
        query = query.filter(Incident.bus_id == bus_id)

    return query.order_by(Incident.detected_at.desc()).all()


@router.patch("/{incident_id}", response_model=IncidentOut)
def update_incident(incident_id: int, update: IncidentUpdate, db: Session = Depends(get_db)):
    """Lets you update location, confidence, and/or status of an incident."""
    db_incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not db_incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    if update.status is not None:
        if update.status not in VALID_STATUSES:
            raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {VALID_STATUSES}")
        db_incident.incidents_status = update.status

    if update.latitude is not None:
        db_incident.latitude = update.latitude
    if update.longitude is not None:
        db_incident.longitude = update.longitude
    if update.confidence is not None:
        db_incident.confidence = update.confidence

    db.commit()
    db.refresh(db_incident)
    return db_incident