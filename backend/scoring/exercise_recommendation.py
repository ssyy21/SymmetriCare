def get_exercise_recommendations(features):
    exercises = []

    if features["shoulder_diff"] > 0.05:
        exercises.append({
            "exercise": "Shoulder Rolls",
            "description": "Roll your shoulders slowly backward 10 times"
        })

    if features["neck_tilt"] > 0.05:
        exercises.append({
            "exercise": "Chin Tucks",
            "description": "Pull your chin back and hold for 5 seconds"
        })

    if features["spine_angle"] > 0.05:
        exercises.append({
            "exercise": "Sit Straight",
            "description": "Keep your back straight and engage core"
        })

    if features["hip_diff"] > 0.05:
        exercises.append({
            "exercise": "Pelvic Tilt",
            "description": "Tilt pelvis forward and backward slowly"
        })

    if not exercises:
        exercises.append({
            "exercise": "Maintain Posture",
            "description": "Your posture looks good, keep it up!"
        })

    return exercises