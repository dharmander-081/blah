import random
from faker import Faker
import psycopg2
from psycopg2.extras import execute_values

# Use direct session mode or direct port 6543 / 5432 with sslmode
DATABASE_URL = "postgresql://postgres.xtknlbuzyiqhyrdabcjh:itsmedhruv10@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?sslmode=require"

fake = Faker()
departments = [
    "Computer Science",
    "Information Technology",
    "Electronics",
    "Mechanical",
    "Civil",
]

print("Connecting to Supabase PostgreSQL (port 6543 pooler)...")
try:
    conn = psycopg2.connect(DATABASE_URL)
except Exception:
    print("Falling back to port 5432...")
    conn = psycopg2.connect("postgresql://postgres.xtknlbuzyiqhyrdabcjh:itsmedhruv10@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres?sslmode=require")

cursor = conn.cursor()

print("Generating 1,000 student records...")
students_data = []
academics_data = []
attendance_data = []
lms_data = []
placement_data = []

for i in range(1, 1001):
    student_id = f"STU{i:04d}"
    full_name = fake.name()
    department = random.choice(departments)
    semester = random.randint(1, 8)
    email = f"{student_id.lower()}@campus.edu"
    students_data.append((student_id, full_name, department, semester, email))

    # Academics
    cgpa = round(random.uniform(5.0, 9.8), 2)
    backlogs = 0 if cgpa > 7.5 else random.choice([0, 0, 1, 2] if cgpa > 6.0 else [1, 2, 3, 4])
    exam_score_avg = min(max(round(cgpa * 9.5 + random.uniform(-5, 5), 2), 30.0), 100.0)
    academics_data.append((student_id, cgpa, backlogs, exam_score_avg))

    # Attendance
    attendance_pct = round(random.uniform(50.0, 98.0), 2)
    classes_total = 120
    classes_attended = int((attendance_pct / 100) * classes_total)
    attendance_data.append((student_id, attendance_pct, classes_attended, classes_total))

    # LMS Activity
    login_freq = random.randint(2, 25)
    assignment_comp = round(random.uniform(40.0, 100.0), 2)
    video_watch = round(random.uniform(30.0, 95.0), 2)
    lms_data.append((student_id, login_freq, assignment_comp, video_watch))

    # Placement Metrics
    aptitude = round(random.uniform(40.0, 95.0), 2)
    coding = round(random.uniform(30.0, 98.0), 2)
    interview = round(random.uniform(5.0, 9.9), 1)
    placement_data.append((student_id, aptitude, coding, interview))

print("Inserting data in small batches...")
batch_size = 100
total_batches = len(students_data) // batch_size

for b in range(total_batches):
    start = b * batch_size
    end = start + batch_size
    
    execute_values(cursor, "INSERT INTO students (student_id, full_name, department, semester, email) VALUES %s ON CONFLICT (student_id) DO NOTHING", students_data[start:end])
    execute_values(cursor, "INSERT INTO academics (student_id, cgpa, backlogs, exam_score_avg) VALUES %s", academics_data[start:end])
    execute_values(cursor, "INSERT INTO attendance (student_id, overall_attendance_pct, classes_attended, classes_total) VALUES %s", attendance_data[start:end])
    execute_values(cursor, "INSERT INTO lms_activity (student_id, login_frequency_weekly, assignment_completion_pct, video_watch_rate_pct) VALUES %s", lms_data[start:end])
    execute_values(cursor, "INSERT INTO placement_metrics (student_id, aptitude_score, coding_score, mock_interview_rating) VALUES %s", placement_data[start:end])
    
    conn.commit()
    print(f"Committed batch {b + 1}/{total_batches} ({end} students)...")

cursor.close()
conn.close()
print("🎉 SUCCESS! All student records are now in Supabase!")
