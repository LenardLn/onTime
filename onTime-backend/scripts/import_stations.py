from dotenv import load_dotenv
import os
import psycopg2

load_dotenv()

db_url = os.getenv("DATABASE_URL")
conn = psycopg2.connect(db_url)
cur = conn.cursor()

file_path = "C:/Users/Erwin/Desktop/onTime-backend/Excel-TXT--NeonDB/Stations.txt"

rows = []

with open(file_path, "r", encoding="utf-8") as f:
    for line in f:
        name, line_id, lat, long, order_index = line.strip().split("\t")

        rows.append((
            name,
            int(line_id),
            float(lat),
            float(long),
            int(order_index)
        ))

cur.executemany("""
    INSERT INTO stations (name, line_id, lat, long, order_index)
    VALUES (%s, %s, %s, %s, %s)
""", rows)

conn.commit()
cur.close()
conn.close()