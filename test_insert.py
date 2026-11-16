import psycopg2

DATABASE_URL = "postgresql://postgres.xtknlbuzyiqhyrdabcjh:itsmedhruv10@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres"

print("Connecting to Supabase...")
conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

print("Testing simple insert...")
try:
    cur.execute("INSERT INTO students (student_id, full_name, department, semester, email) VALUES ('STU0001', 'Test Student', 'Computer Science', 4, 'test@campus.edu') ON CONFLICT DO NOTHING;")
    conn.commit()
    print("Committed!")
    cur.execute("SELECT count(*) FROM students;")
    print("Current student count in DB:", cur.fetchone()[0])
except Exception as e:
    print("Error:", e)
finally:
    cur.close()
    conn.close()
