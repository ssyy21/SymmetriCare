import cv2

from pose.mediapipe_model import get_pose_landmarks
from features.feature_extraction import extract_features
from scoring.scoring import calculate_score
from scoring.exercise_recommendation import get_exercise_recommendations
from utils.pdf_report import generate_pdf_report


def draw_line(frame, p1, p2, color=(255, 0, 0)):
    h, w, _ = frame.shape
    x1, y1 = int(p1.x * w), int(p1.y * h)
    x2, y2 = int(p2.x * w), int(p2.y * h)
    cv2.line(frame, (x1, y1), (x2, y2), color, 2)


cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    landmarks = get_pose_landmarks(frame)

    if landmarks:
        # =========================
        # DRAW VISUAL LINES
        # =========================
        left_shoulder = landmarks[11]
        right_shoulder = landmarks[12]
        left_hip = landmarks[23]
        right_hip = landmarks[24]

        draw_line(frame, left_shoulder, right_shoulder)
        draw_line(frame, left_hip, right_hip)

        # Midpoints
        shoulder_mid_x = (left_shoulder.x + right_shoulder.x) / 2
        shoulder_mid_y = (left_shoulder.y + right_shoulder.y) / 2

        hip_mid_x = (left_hip.x + right_hip.x) / 2
        hip_mid_y = (left_hip.y + right_hip.y) / 2

        h, w, _ = frame.shape

        shoulder_mid = (int(shoulder_mid_x * w), int(shoulder_mid_y * h))
        hip_mid = (int(hip_mid_x * w), int(hip_mid_y * h))

        # Spine line
        cv2.line(frame, shoulder_mid, hip_mid, (0, 255, 255), 3)

        # Midpoints
        cv2.circle(frame, shoulder_mid, 5, (0, 255, 0), -1)
        cv2.circle(frame, hip_mid, 5, (0, 255, 0), -1)

        # =========================
        # FEATURE + SCORE
        # =========================
        features = extract_features(landmarks)
        score = calculate_score(features)
        exercises = get_exercise_recommendations(features)

        # =========================
        # COLOR LOGIC
        # =========================
        if score > 80:
            color = (0, 255, 0)
        elif score > 60:
            color = (0, 165, 255)
        else:
            color = (0, 0, 255)

        # Display score
        cv2.putText(frame, f"Score: {score}",
                    (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1, color, 2)
        
        cv2.putText(frame, "Press 'C' to download report",
            (20, 420),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6, (255, 255, 255), 1)

        # =========================
        # FEEDBACK
        # =========================
        messages = []

        if features["shoulder_diff"] > 0.05:
            messages.append("Fix Shoulder Alignment")

        if features["neck_tilt"] > 0.05:
            messages.append("Straighten Your Neck")

        if features["spine_angle"] > 0.05:
            messages.append("Sit Straight (Spine Tilt)")

        if features["hip_diff"] > 0.05:
            messages.append("Balance Your Hips")

        if not messages:
            messages.append("Good Posture")

        y = 80
        for msg in messages:
            cv2.putText(frame, msg,
                        (20, y),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.7, (0, 0, 255), 2)
            y += 30

 

    # =========================
    # KEY HANDLING (VERY IMPORTANT)
    # =========================
    key = cv2.waitKey(10) & 0xFF

    if key == ord('c') and landmarks:
        image_path = "captured_frame.jpg"
        cv2.imwrite(image_path, frame)

        filename = generate_pdf_report(score, features, exercises, image_path)

        print(f"PDF Report saved as {filename}")

    if key == ord('q'):
        break

    cv2.imshow("SymmetriCare - Live", frame)

cap.release()
cv2.destroyAllWindows()