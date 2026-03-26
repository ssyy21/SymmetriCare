from fastapi import FastAPI, UploadFile, File
import cv2
import numpy as np

from fastapi.responses import FileResponse
from pose.mediapipe_model import get_pose_landmarks
from features.feature_extraction import extract_features
from scoring.scoring import calculate_score

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins (for hackathon)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "SymmetriCare Backend Running"}



import base64

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    contents = await file.read()

    np_arr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    landmarks = get_pose_landmarks(frame)

    if landmarks is None:
        return {
            "score": 0,
            "message": ["No person detected"],
            "image": None
        }

    # ===== Extract features =====
    features = extract_features(landmarks)
    score = calculate_score(features)

    # ===== Feedback =====
    def get_posture_feedback(features):
        messages = []

        if features["shoulder_diff"] > 0.05:
            messages.append("Fix Shoulder Alignment")

        if features["neck_tilt"] > 0.05:
            messages.append("Straighten Your Neck")

        if features["spine_angle"] > 0.05:
            messages.append("Sit Straight")

        if features["hip_diff"] > 0.05:
            messages.append("Balance Your Hips")

        if not messages:
            messages.append("Good Posture")

        return messages

    messages = get_posture_feedback(features)

    # ===== DRAW LINES (THIS IS THE MAGIC PART) =====

    h, w, _ = frame.shape

    def draw_line(p1, p2, color=(255, 0, 0)):
        x1, y1 = int(p1.x * w), int(p1.y * h)
        x2, y2 = int(p2.x * w), int(p2.y * h)
        cv2.line(frame, (x1, y1), (x2, y2), color, 2)

    left_shoulder = landmarks[11]
    right_shoulder = landmarks[12]
    left_hip = landmarks[23]
    right_hip = landmarks[24]

    # Shoulder line
    draw_line(left_shoulder, right_shoulder, (255, 0, 0))

    # Hip line
    draw_line(left_hip, right_hip, (255, 0, 0))

    # Spine line
    shoulder_mid = (
        int(((left_shoulder.x + right_shoulder.x) / 2) * w),
        int(((left_shoulder.y + right_shoulder.y) / 2) * h),
    )

    hip_mid = (
        int(((left_hip.x + right_hip.x) / 2) * w),
        int(((left_hip.y + right_hip.y) / 2) * h),
    )

    cv2.line(frame, shoulder_mid, hip_mid, (0, 255, 255), 3)

    # ===== CONVERT IMAGE TO BASE64 =====

    _, buffer = cv2.imencode('.jpg', frame)
    image_base64 = base64.b64encode(buffer).decode('utf-8')

    # ===== RETURN RESPONSE =====

    return {
        "score": score,
        "message": messages,
        "image": image_base64
    }

@app.post("/generate-report")
async def generate_report_api(file: UploadFile = File(...)):
    contents = await file.read()

    np_arr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    landmarks = get_pose_landmarks(frame)

    if landmarks is None:
        return {"error": "No pose detected"}

    features = extract_features(landmarks)
    score = calculate_score(features)

    from scoring.exercise_recommendation import get_exercise_recommendations
    exercises = get_exercise_recommendations(features)

    # Save image temporarily
    image_path = "temp.jpg"
    cv2.imwrite(image_path, frame)

    from utils.pdf_report import generate_pdf_report
    pdf_path = generate_pdf_report(score, features, exercises, image_path)

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename="Posture_Report.pdf"
    )