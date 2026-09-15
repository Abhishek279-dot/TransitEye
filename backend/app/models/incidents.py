from sqlalchemy import DECIMAL, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.db import Base


class Incident(Base):
    __tablename__ = "incidents"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    bus_id: Mapped[str] = mapped_column(
        String(20),
        ForeignKey("buses.bus_id", ondelete="CASCADE"),
        nullable=False
    )

    event_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    confidence: Mapped[float] = mapped_column(
        DECIMAL(4, 3),
        nullable=False
    )

    latitude: Mapped[float] = mapped_column(
        DECIMAL(10, 7),
        nullable=False
    )

    longitude: Mapped[float] = mapped_column(
        DECIMAL(10, 7),
        nullable=False
    )

    incidents_status: Mapped[str] = mapped_column(
        String(20),
        default="Detected"
    )

    plate_number: Mapped[str | None] = mapped_column(
        String(20)
    )

    detected_at: Mapped[object] = mapped_column(
        DateTime,
        server_default=func.current_timestamp()
    )

    location_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )