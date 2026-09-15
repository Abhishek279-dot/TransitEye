# PS26124 Urban Intelligence API

## Corrected package structure

```text
SIH_Py_backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── db.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── bus.py
│   │   ├── incidents.py
│   │   ├── incident_media.py
│   │   └── alert.py
│   └── routes/
│       ├── __init__.py
│       └── buses.py
├── .env.example
├── requirements.txt
└── README.md
```

## Setup

1. Create and activate a virtual environment.
2. Install dependencies: `pip install -r requirements.txt`
3. Copy `.env.example` to `.env` and put your real MySQL password in `DATABASE_URL`.
4. Make sure the MySQL database `ps26124_urban_intelligence` exists.
5. From the project root run:

```bash
uvicorn app.main:app --reload
```

Do **not** run model files directly. Running through `uvicorn app.main:app` keeps package imports valid and fixes the `attempted relative import with no known parent package` problem.
