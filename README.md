# TransitEye – AI-Powered Urban Intelligence Platform

**SIH Problem Statement:** SIH26124

TransitEye is an AI-powered urban intelligence platform that uses cameras installed on public transport vehicles to monitor road conditions and identify urban infrastructure problems in real time.

The platform aims to help authorities detect, monitor, and manage road-related incidents such as potholes, waterlogging, traffic congestion, damaged road signs, and pedestrian safety issues.

## Key Features

- **Pothole Detection:** Identifies potholes using computer vision.
- **Waterlogging Detection:** Detects water accumulation on roads.
- **Traffic Monitoring:** Monitors vehicle density and traffic congestion.
- **Road Sign Detection:** Identifies damaged or problematic traffic signs.
- **Pedestrian Safety:** Helps identify potentially unsafe pedestrian situations.
- **Incident Mapping:** Displays detected incidents on an interactive map.
- **Incident Tracking:** Tracks incidents through different stages:
  - Detected
  - Verified
  - Assigned
  - Action Taken
  - Resolved
- **Fleet Monitoring:** Provides an overview of bus fleet coverage and detected incidents.

## Technology Stack

### AI & Computer Vision
- Python
- OpenCV
- YOLOv8
- ByteTrack
- EasyOCR

### Frontend
- React.js
- JavaScript
- Leaflet
- OpenStreetMap

### Backend
- FastAPI
- Python
- REST APIs

### Database
- MySQL
- SQLAlchemy

## System Workflow

1. Cameras capture road-facing video from public transport vehicles.
2. AI models process the video and detect road-related incidents.
3. The system associates incidents with GPS coordinates.
4. Incident information is sent to the backend through REST APIs.
5. The dashboard displays incidents on an interactive map.
6. Authorities can track and update incident status.

## Project Structure

```text
TransitEye/
│
├── backend/
│   ├── main.py
│   ├── models/
│   ├── routes/
│   ├── schemas.py
│   └── db.py
│
├── Detection_Model/
│   ├── Model.py
│   ├── api_test.py
│   └── send_incident.py
│
├── Frontend/
│   ├── src/
│   └── public/
│
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js and npm
- MySQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Abhishek279-dot/TransitEye.git
cd TransitEye
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

### 3. Frontend Setup

Open another terminal:

```bash
cd Frontend
npm install
npm run dev
```

### 4. Database Configuration

Configure your MySQL database credentials using environment variables or the project's database configuration.

Make sure the required database and tables are created before running the backend.

## Privacy & Security

- Face and number plate blurring where applicable.
- Secure handling of incident information.
- Role-based access control.
- Appropriate data retention policies.

## Future Enhancements

- Real-time integration with public transport cameras.
- Live GPS tracking and fleet monitoring.
- Improved AI detection accuracy.
- Automated incident prioritization.
- Integration with municipal authority systems.

## Project Team

**Team Name:** TransitEye

**Project:** Smart India Hackathon 2026

## License

This project is currently developed for educational and hackathon purposes.
