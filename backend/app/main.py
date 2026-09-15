from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.db import Base, engine
from app.models import Alert, Bus, Incident, IncidentMedia
from app.routes.buses import router as buses_router
from app.routes.incidents import router as incidents_router

# Import models above so SQLAlchemy knows about all tables before create_all().

app = FastAPI(title="PS26124 Urban Intelligence API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(buses_router)
app.include_router(incidents_router)


@app.on_event("startup")
def create_tables() -> None:
    """Create missing tables when the application starts."""
    Base.metadata.create_all(bind=engine)


@app.get("/")
def home():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"message": "FastAPI is running", "database": "MySQL connected through SQLAlchemy"}
    except Exception as exc:
        return {"message": "FastAPI is running", "database": "Connection failed", "error": str(exc)}
