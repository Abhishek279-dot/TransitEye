from ultralytics import YOLO
from huggingface_hub import hf_hub_download
from datetime import datetime
import json


# Download pretrained model
weights_path = hf_hub_download(
    repo_id="samdutse/pothole-yolov8",
    filename="best.pt"
)

# Load model
model = YOLO(weights_path)

# Display model classes
print("Model Classes:", model.names)

# Run pothole detection on video
results = model.predict(
    r"C:\Users\sangi\OneDrive\Desktop\SIH\Datasets\Detection_Model\2ndPothole.mp4",
    conf=0.4,
    save=True
)

# Inspect detection results
total_detections = 0

for frame_number, result in enumerate(results):

    if result.boxes is not None and len(result.boxes) > 0:

        for box in result.boxes:

            class_id = int(box.cls[0])
            class_name = model.names[class_id]
            confidence = float(box.conf[0])

            total_detections += 1

            print(
                f"Frame: {frame_number} | "
                f"Class: {class_name} | "
                f"Confidence: {confidence:.2f}"
            )

print("\nTotal Detections:", total_detections)
print("Output Video Saved At:", results[0].save_dir)

import json

# Collect all detections for JSON report
detection_data = []

for frame_number, result in enumerate(results):

    if result.boxes is not None and len(result.boxes) > 0:

        for box in result.boxes:

            confidence = float(box.conf[0])
            class_id = int(box.cls[0])
            class_name = model.names[class_id]

            detection_data.append({
                "frame_number": frame_number,
                "event_type": class_name.lower(),
                "confidence": round(confidence, 2)
            })

# Save detections to JSON file
with open("pothole_detections.json", "w") as file:
    json.dump(detection_data, file, indent=4)

print("JSON file created successfully!")
print("Total JSON records:", len(detection_data))
print("File: pothole_detections.json")



# Create one summarized incident
if detection_data:

    # Get highest confidence detection
    max_confidence = max(
        item["confidence"] for item in detection_data
    )

    incident = {
        "bus_id": "PMPML-108",
        "event_type": "pothole",
        "confidence": round(max_confidence, 2),
        "latitude": 18.5204,
        "longitude": 73.8567,
        "status": "Detected",
        "plate_number": None,
        "location_name": "Demo Video Location",
        "notes": "Pothole detected from road video"
    }

    # Save API-ready incident JSON
    with open("pothole_incident.json", "w") as file:
        json.dump(incident, file, indent=4)

    print("API-ready incident JSON created!")
    print("File: pothole_incident.json")

else:
    print("No potholes detected. Incident JSON not created.")