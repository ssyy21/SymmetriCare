import sqlite3

conn = sqlite3.connect("posture.db", check_same_thread=False)
cursor = conn.cursor()

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

conn.commit()