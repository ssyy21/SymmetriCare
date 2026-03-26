def calculate_score(features):
    """
    Calculate posture score (0–100)
    Lower imbalance → higher score
    """

    shoulder_penalty = features["shoulder_diff"] * 100
    hip_penalty = features["hip_diff"] * 100
    neck_penalty = features["neck_tilt"] * 100
    spine_penalty = features["spine_angle"] * 100

    total_penalty = (
        0.3 * shoulder_penalty +
        0.2 * hip_penalty +
        0.2 * neck_penalty +
        0.3 * spine_penalty
    )

    score = max(0, 100 - total_penalty)

    return round(score, 2)