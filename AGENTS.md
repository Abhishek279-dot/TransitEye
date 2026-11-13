# Project Context for AI Coding Assistants

> This file is read by AI coding tools (Gemini CLI, Cursor, Windsurf, Aider, etc.)
> to stay consistent across every team member's laptop. Do not delete this file.
> If your AI tool suggests something that contradicts this file, follow this file.

## 1. Project Overview

- **Event:** Smart India Hackathon (SIH) 2026
- **Problem Statement ID:** 26124
- **Title:** AI-Powered Mobile Urban Intelligence Platform Using Public Transport Fleet
- **Organization:** Bharat Electronics Limited (BEL)
- **Category:** Software | **Theme:** Smart Automation

**One-line summary:** We turn public transport bus cameras into mobile AI sensors.
Onboard edge AI detects road defects, traffic density, and unsafe situations from
bus camera video, sends only lightweight event data (not raw video) to a backend,
and a GIS dashboard shows these events to transport authorities for action.

**Pilot city:** Pune (PMPML), used for demo data only. The system itself must
stay generic/city-agnostic — do not hardcode Pune-specific logic, coordinates,
or PMPML-specific assumptions into the core architecture.

## 2. Tech Stack (do not substitute these without team agreement)

| Layer | Technology | Notes |
|---|---|---|
| Object Detection | YOLOv8 (Ultralytics) | vehicles, potholes, pedestrians, signs, waterlogging |
| Object Tracking | ByteTrack | via `model.track(..., tracker='bytetrack.yaml')` |
| Number Plate OCR | EasyOCR | only runs on flagged incidents, not every vehicle |
| Backend | FastAPI | NOT Flask, NOT Django |
| Database | MySQL | NOT Firebase, NOT MongoDB, NOT PostgreSQL |
| Frontend | React + react-leaflet | map tiles from OpenStreetMap, no Google Maps API key |
| Communication | REST API, JSON | WebSocket optional/future scope only |

## 3. Folder Structure (target layout)

```
/ai-ml
  /detection        -> YOLOv8 detection + tracking scripts
  /training          -> dataset prep + fine-tuning notebooks/scripts
  /models            -> trained .pt model files
/backend
  /app
    main.py
    models.py        -> Pydantic schemas
    routes/
    db.py            -> MySQL/SQLAlchemy connection
  requirements.txt
/frontend
  /src
    components/
    pages/
  package.json
/database
  schema.sql
  sample_data.sql
AGENTS.md            -> this file, keep at repo root
```

## 4. Event JSON Schema (single source of truth — every module must match this exactly)

```json
{
  "event_type": "pothole",
  "confidence": 0.93,
  "latitude": 18.5204,
  "longitude": 73.8567,
  "timestamp": "2026-09-05T10:32:15",
  "bus_id": "PMPML-102",
  "status": "Detected",
  "plate_number": null
}
```

- `event_type` values used across the project: `pothole`, `waterlogging`,
  `traffic_congestion`, `unsafe_pedestrian`, `traffic_sign_issue`, `hit_and_run`
- `status` values (in order): `Detected` -> `Verified` -> `Assigned` -> `Action Taken` -> `Resolved`
- `plate_number` is `null` unless the event is a `hit_and_run` type
- AI/ML side produces this exact structure. Backend accepts this exact structure.
  If any field name needs to change, update it here first, then in all three
  layers (AI/ML, backend, database) at the same time.

## 5. Naming & Coding Conventions

- Python: `snake_case` for variables/functions, `PascalCase` for classes
- JavaScript/React: `camelCase` for variables/functions, `PascalCase` for components
- Database columns: `snake_case`, matches the JSON schema field names exactly
- API routes: plural nouns, e.g. `/events`, not `/getEvents` or `/event`
- Commit messages: short present-tense, e.g. `add pothole detection script`,
  not `Fixed stuff` or `update`

## 6. Do NOT Do This

- Do NOT use Flask or Django for backend — this project uses FastAPI only
- Do NOT use Firebase, MongoDB, or PostgreSQL — this project uses MySQL only
- Do NOT hardcode Pune/PMPML-specific values into core logic — keep it generic,
  Pune data is for the demo/pilot only
- Do NOT send raw video to the backend — only send the event JSON + optional
  snapshot/short clip. Bandwidth minimization is a core requirement of this PS
- Do NOT claim the AI model detects "missing" traffic signs — we only detect
  signs that ARE present, or flag damaged/unreadable ones. Detecting absence
  requires reference-map data we don't have
- Do NOT build a real feedback-loop/retraining pipeline — this is future scope
  only. Authorities can mark events Verified/Incorrect, but automatic retraining
  is NOT part of this prototype
- Do NOT invent new event_type or status values without updating this file first
- Do NOT commit API keys, database passwords, or `.env` files to GitHub

## 7. Current Priority (for a 25-day prototype)

**Must have:** vehicle detection (YOLOv8), vehicle tracking/counting (ByteTrack),
pothole detection, event + GPS + timestamp packaging, backend integration.

**Should have:** pedestrian detection, waterlogging detection, traffic sign detection.

**Advanced / if time allows:** number plate detection + OCR, unsafe pedestrian
situation, hit-and-run detection.
