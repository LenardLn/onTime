from dotenv import load_dotenv
import os
import psycopg2
from datetime import datetime

load_dotenv()

db_url = os.getenv("DATABASE_URL")
conn = psycopg2.connect(db_url)

cur = conn.cursor()

file_path = "C:/Users/Erwin/Desktop/onTime-backend/Excel-TXT--NeonDB/Routes.txt"

with open(file_path, "r", encoding="utf-8") as f:
    next(f)

    for line in f:
        lat, long, line_id, created_at, created_by, order_index = line.strip().split("\t")

        created_at = datetime.strptime(created_at, "%m/%d/%Y %H:%M")

        cur.execute("""
            INSERT INTO routes (lat, long, line_id, created_at, created_by, order_index)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (lat, long, line_id, created_at, created_by, order_index))

conn.commit()
cur.close()
conn.close()