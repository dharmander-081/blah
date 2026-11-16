import random
from faker import Faker
import psycopg2
from psycopg2.extras import execute_values

# USE YOUR EXACT SUPABASE PROJECT HOST BELOW (replace YOUR_PASSWORD)
DATABASE_URL = "postgresql://postgres.xtknlbuzyiqhyrdabcjh:itsmedhruv10@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres"

fake = Faker()
departments = [
    "Computer Science",
    "Information Technology",
    "Electronics",
    "Mechanical",
    "Civil",
]

print("Connecting to Supabase PostgreSQL...")
conn = psycopg2.connect(DATABASE_URL)
cursor = conn.cursor()

# DISABLE TIMEOUTS COMPLETELY FOR THIS CONNECTION
cursor.execute("SET statement_timeout = 0;")

print("Generating 5,000 student records in memory...")

students_data = []
academics_data = []
attendance_data = []
lms_data = []
placement_data = []

for i in range(1, 5001):
  student_id = f"STU{i:04d}"
  full_name = fake.name()
  department = random.choice(departments)
  semester = random.randint(1, 8)
  email = f"{student_id.lower()}@campus.edu"
  students_data.append((student_id, full_name, department, semester, email))

  # Academics
  cgpa = round(random.uniform(5.0, 9.8), 2)
  backlogs = (
      0
      if cgpa > 7.5
      else random.choice([0, 0, 1, 2] if cgpa > 6.0 else [1, 2, 3, 4])
  )
  exam_score_avg = min(max(round(cgpa * 9.5 + random.uniform(-5, 5), 2), 30.0), 100.0)
  academics_data.append((student_id, cgpa, backlogs, exam_score_avg))

  # Attendance
  attendance_pct = round(random.uniform(50.0, 98.0), 2)
  classes_total = 120
  classes_attended = int((attendance_pct / 100) * classes_total)
  attendance_data.append(
      (student_id, attendance_pct, classes_attended, classes_total)
  )

  # LMS Activity
  login_freq = random.randint(2, 25)
  assignment_comp = round(random.uniform(40.0, 100.0), 2)
  video_watch = round(random.uniform(30.0, 95.0), 2)
  lms_data.append(
      (student_id, login_freq, assignment_comp, video_watch)
  )

  # Placement Metrics
  aptitude = round(random.uniform(40.0, 95.0), 2)
  coding = round(random.uniform(30.0, 98.0), 2)
  interview = round(random.uniform(5.0, 9.9), 1)
  placement_data.append((student_id, aptitude, coding, interview))

print("Inserting data into Supabase...")

batch_size = 500
for i in range(0, len(students_data), batch_size):
  execute_values(
      cursor,
      "INSERT INTO students (student_id, full_name, department, semester, email)"
      " VALUES %s ON CONFLICT (student_id) DO NOTHING",
      students_data[i : i + batch_size],
  )
  execute_values(
      cursor,
      "INSERT INTO academics (student_id, cgpa, backlogs, exam_score_avg) VALUES"
      " %s",
      academics_data[i : i + batch_size],
  )
  execute_values(
      cursor,
      "INSERT INTO attendance (student_id, overall_attendance_pct,"
      " classes_attended, classes_total) VALUES %s",
      attendance_data[i : i + batch_size],
  )
  execute_values(
      cursor,
      "INSERT INTO lms_activity (student_id, login_frequency_weekly,"
      " assignment_completion_pct, video_watch_rate_pct) VALUES %s",
      lms_data[i : i + batch_size],
  )
  execute_values(
      cursor,
      "INSERT INTO placement_metrics (student_id, aptitude_score, coding_score,"
      " mock_interview_rating) VALUES %s",
      placement_data[i : i + batch_size],
  )
  conn.commit()
  print(f"Inserted batch {i // batch_size + 1} / 10...")

cursor.close()
conn.close()
print("Successfully populated 5,000 student records into Supabase!")