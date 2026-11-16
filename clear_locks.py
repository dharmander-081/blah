import psycopg2

DATABASE_URL = "postgresql://postgres.xtknlbuzyiqhyrdabcjh:itsmedhruv10@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres"

conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

# Cancel/terminate any stuck backends
cur.execute("""
    SELECT pg_terminate_backend(pid) 
    FROM pg_stat_activity 
    WHERE pid <> pg_backend_pid() 
      AND state != 'idle';
""")
conn.commit()
print("Terminated stuck sessions!")

# Check table count
cur.execute("SELECT count(*) FROM students;")
print("Students count:", cur.fetchone()[0])

cur.close()
conn.close()
