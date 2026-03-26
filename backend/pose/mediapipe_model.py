import mediapipe as mp
import cv2

mp_pose = mp.solutions.pose

pose = mp_pose.Pose(static_image_mode=False)

def get_pose_landmarks(frame):
    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(image)

    if results.pose_landmarks:
        return results.pose_landmarks.landmark
    return None