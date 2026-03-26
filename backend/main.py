from fastapi import FastAPI, UploadFile, File
import cv2
import numpy as np
import base64
from fastapi.responses import FileResponse
from pose.mediapipe_model import get_pose_landmarks
from features.feature_extraction import extract_features
from scoring.scoring import calculate_score
import sqlite3
from datetime import datetime
from collections import Counter
from datetime import timedelta

conn = sqlite3.connect("posture.db", check_same_thread=False)
cursor = conn.cursor()

session_scores = []


cursor.execute("""
CREATE TABLE IF NOT EXISTS posture_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    score REAL,
    neck_tilt REAL,
    shoulder_diff REAL,
    spine_angle REAL,
    timestamp TEXT
)
""")

try:
    cursor.execute("ALTER TABLE posture_data ADD COLUMN hip_diff REAL")
except:
    pass

conn.commit()


app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins (for hackathon)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/end-session")
def end_session():
    if not session_scores:
        return {"message": "No data"}

    avg_score = sum(session_scores) / len(session_scores)

    cursor.execute("""
    INSERT INTO posture_data (score, timestamp)
    VALUES (?, ?)
    """, (avg_score, datetime.now().isoformat()))

    conn.commit()

    session_scores.clear()

    return {"avg_score": avg_score}
@app.get("/")
def home():
    return {"message": "SymmetriCare Backend Running"}

@app.get("/analytics")
def get_analytics():
    cursor.execute("SELECT score, neck_tilt, shoulder_diff, spine_angle, timestamp FROM posture_data")
    rows = cursor.fetchall()

    if not rows:
        return {}

    scores = []
    issues = []

    one_week_ago = datetime.now() - timedelta(days=7)

    weekly_scores = []

    for row in rows:
        score, neck, shoulder, spine, timestamp = row
        time_obj = datetime.fromisoformat(timestamp)

        scores.append(score)

        # Weekly filter
        if time_obj >= one_week_ago:
            weekly_scores.append(score)

        # Issue detection
        if neck > 0.05:
            issues.append("Forward Neck")

        if shoulder > 0.05:
            issues.append("Shoulder Imbalance")

        if spine > 0.05:
            issues.append("Spine Tilt")

    # Stats
    avg_score = sum(scores) / len(scores)
    best_score = max(scores)

    # Weekly improvement
    if len(weekly_scores) >= 2:
        improvement = weekly_scores[-1] - weekly_scores[0]
    else:
        improvement = 0

    # Most common issue
    most_common = Counter(issues).most_common(1)
    common_issue = most_common[0][0] if most_common else "None"

    return {
        "average": round(avg_score, 2),
        "best": best_score,
        "improvement": round(improvement, 2),
        "common_issue": common_issue
    }









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
    # ===== SAVE TO DATABASE =====

    cursor.execute("""
INSERT INTO posture_data (score, neck_tilt, shoulder_diff, spine_angle, hip_diff, timestamp)
VALUES (?, ?, ?, ?, ?, ?)
""", (
    score,
    features["neck_tilt"],
    features["shoulder_diff"],
    features["spine_angle"],
    features["hip_diff"],
    datetime.now().isoformat()
))

    conn.commit()


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

@app.get("/history")
def get_history():
    cursor.execute("SELECT * FROM posture_data")
    rows = cursor.fetchall()

    data = []
    for row in rows:
        data.append({
            "score": row[1],
            "neck_tilt": row[2],
            "shoulder_diff": row[3],
            "spine_angle": row[4],
            "timestamp": row[5]
        })

    return data