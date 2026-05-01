from dotenv import load_dotenv
import os
import psycopg2
from datetime import datetime, timezone

load_dotenv()

db_url = os.getenv("DATABASE_URL")
conn = psycopg2.connect(db_url)
cur = conn.cursor()

cur.execute("SELECT current_database(), current_schema();")
print(cur.fetchone())

file_path = "C:/Users/Erwin/Desktop/onTime-backend/Excel-TXT--NeonDB/Stations.txt"

rows = []

for_user_id = 2

with open(file_path, "r", encoding="utf-8") as f:
    for line in f:
        station_id, name, line_id, lat, long, order_index = line.strip().split("\t")

        rows.append((
            int(station_id),
            name,
            int(line_id),
            float(lat),
            float(long),
            int(order_index),
            datetime.now(timezone.utc),
            for_user_id
        ))

cur.executemany("""
    INSERT INTO stations (station_id, name, line_id, lat, long, order_index, created_at, created_by)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
""", rows)

conn.commit()
cur.close()
conn.close()