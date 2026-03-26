from datetime import datetime

def generate_report(score, features, exercises):
    filename = f"posture_report_{datetime.now().strftime('%H%M%S')}.txt"

    with open(filename, "w") as f:
        f.write("POSTURE ANALYSIS REPORT\n")
        f.write("========================\n\n")

        f.write(f"Score: {score}/100\n\n")

        f.write("Detected Issues:\n")
        for key, value in features.items():
            f.write(f"- {key}: {round(value, 3)}\n")

        f.write("\nRecommended Exercises:\n")
        for ex in exercises:
            f.write(f"- {ex['exercise']}: {ex['description']}\n")

        f.write("\nGenerated on: " + str(datetime.now()))

    return filename