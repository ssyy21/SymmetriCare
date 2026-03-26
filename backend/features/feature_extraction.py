from utils.helpers import calculate_angle

def get_midpoint(p1, p2):
    return [(p1.x + p2.x) / 2, (p1.y + p2.y) / 2]

def extract_features(landmarks):
    # Key points
    left_shoulder = landmarks[11]
    right_shoulder = landmarks[12]
    left_hip = landmarks[23]
    right_hip = landmarks[24]
    nose = landmarks[0]

    # Midpoints
    shoulder_mid = get_midpoint(left_shoulder, right_shoulder)
    hip_mid = get_midpoint(left_hip, right_hip)

    # Shoulder imbalance
    shoulder_diff = abs(left_shoulder.y - right_shoulder.y)

    # Hip imbalance
    hip_diff = abs(left_hip.y - right_hip.y)

    # Neck tilt (horizontal deviation)
    neck_tilt = abs(nose.x - shoulder_mid[0])

    # Spine angle (relative to vertical)
    spine_angle = abs(shoulder_mid[0] - hip_mid[0])

    return {
        "shoulder_diff": shoulder_diff,
        "hip_diff": hip_diff,
        "neck_tilt": neck_tilt,
        "spine_angle": spine_angle
    }