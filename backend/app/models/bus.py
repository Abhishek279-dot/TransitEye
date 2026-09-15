from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.db import Base


class Bus(Base):
    __tablename__ = "buses"

    bus_id: Mapped[str] = mapped_column(String(20), primary_key=True)
    route_name: Mapped[str | None] = mapped_column(String(100))
    bus_status: Mapped[str] = mapped_column(String(20), default="Active")
    created_at: Mapped[object] = mapped_column(DateTime, server_default=func.current_timestamp())
