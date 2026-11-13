import requests

API_URL = "http://127.0.0.1:8000/incidents"

incident = {
    "bus_id": "PMPML-108",
    "event_type": "pothole",
    "confidence": 0.95,
    "latitude": 18.5204,
    "longitude": 73.8567,
    "status": "Detected",
    "plate_number": None,
    "location_name": "Python API Test",
    "notes": "Incident sent from AI/ML Python code"
}

try:
    response = requests.post(API_URL, json=incident, timeout=10)

    print("Status Code:", response.status_code)
    print("Response:", response.text)

except requests.exceptions.RequestException as e:
    print("API Error:", e)