from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class IncidentCreate(BaseModel):
    """What the AI/ML side sends us — matches the event schema."""
    
    bus_id: str
    event_type: str
    confidence: float = Field(..., ge=0, le=1)
    latitude: float
    longitude: float
    status: Optional[str] = "Detected"
    plate_number: Optional[str] = None
    location_name: Optional[str] = None
    notes: Optional[str] = None


class IncidentOut(BaseModel):
    """What we send back out to the frontend dashboard."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    bus_id: str
    event_type: str
    confidence: float
    latitude: float
    longitude: float
    status: str = Field(validation_alias="incidents_status")
    plate_number: Optional[str] = None
    timestamp: datetime = Field(validation_alias="detected_at")
    location_name: Optional[str] = None
    notes: Optional[str] = None


class IncidentStatusUpdate(BaseModel):
    status: str


class IncidentUpdate(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    confidence: Optional[float] = None
    status: Optional[str] = None
    location_name: Optional[str] = None
    notes: Optional[str] = None