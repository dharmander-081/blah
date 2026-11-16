import os
import streamlit as st
import pandas as pd
import psycopg2
import plotly.express as px
import plotly.graph_objects as go
from dotenv import load_dotenv

load_dotenv()

# --- Page Setup ---
st.set_page_config(
    page_title="EduPulse | Student Analytics & Early Warning AI",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded",
)

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres.xtknlbuzyiqhyrdabcjh:itsmedhruv10@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?sslmode=require"
)

# Custom Styling
st.markdown("""
<style>
    .metric-card {
        background-color: #f8f9fa;
        border-radius: 10px;
        padding: 15px;
        border-left: 5px solid #4F46E5;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .risk-high {
        color: #EF4444;
        font-weight: bold;
    }
    .risk-med {
        color: #F59E0B;
        font-weight: bold;
    }
    .risk-low {
        color: #10B981;
        font-weight: bold;
    }
</style>
""", unsafe_allow_html=True)

# --- Fetch Data from Supabase ---
@st.cache_data(ttl=300)
def load_data():
    conn = psycopg2.connect(DATABASE_URL)
    query = """
    SELECT 
        s.student_id,
        s.full_name,
        s.department,
        s.semester,
        s.email,
        a.cgpa,
        a.backlogs,
        a.exam_score_avg,
        att.overall_attendance_pct,
        att.classes_attended,
        att.classes_total,
        lms.login_frequency_weekly,
        lms.assignment_completion_pct,
        lms.video_watch_rate_pct,
        pm.aptitude_score,
        pm.coding_score,
        pm.mock_interview_rating
    FROM students s
    LEFT JOIN academics a ON s.student_id = a.student_id
    LEFT JOIN attendance att ON s.student_id = att.student_id
    LEFT JOIN lms_activity lms ON s.student_id = lms.student_id
    LEFT JOIN placement_metrics pm ON s.student_id = pm.student_id;
    """
    df = pd.read_sql_query(query, conn)
    conn.close()
    
    # Calculate Risk Score (0 - 100) & Status
    # Risk factors: low attendance (<75), backlogs (>0), low CGPA (<6.5), low LMS engagement
    df["risk_score"] = (
        (100 - df["overall_attendance_pct"]) * 0.35 +
        (df["backlogs"] * 15).clip(upper=35) +
        ((10 - df["cgpa"]) * 5).clip(lower=0, upper=30)
    ).round(1)
    
    def get_risk_category(score):
        if score >= 40:
            return "High Risk"
        elif score >= 25:
            return "Moderate Risk"
        return "Safe"
        
    df["risk_category"] = df["risk_score"].apply(get_risk_category)
    
    # Placement Readiness Score (0 - 100)
    df["placement_readiness"] = (
        (df["cgpa"] / 10.0 * 25) +
        (df["aptitude_score"] * 0.25) +
        (df["coding_score"] * 0.30) +
        (df["mock_interview_rating"] / 10.0 * 20)
    ).round(1)
    
    return df

try:
    with st.spinner("Connecting to Supabase and fetching student intelligence data..."):
        df = load_data()
except Exception as e:
    st.error(f"Error connecting to Supabase: {e}")
    st.stop()

# --- Sidebar Filters ---
st.sidebar.image("https://cdn-icons-png.flaticon.com/512/3135/3135810.png", width=60)
st.sidebar.title("EduPulse Controls")
st.sidebar.caption("AI-Powered Student Success Dashboard")

departments = ["All"] + sorted(df["department"].dropna().unique().tolist())
selected_dept = st.sidebar.selectbox("Filter by Department", departments)

semesters = ["All"] + sorted(df["semester"].dropna().unique().tolist())
selected_sem = st.sidebar.selectbox("Filter by Semester", semesters)

risk_filter = st.sidebar.multiselect(
    "Filter by Risk Level",
    ["High Risk", "Moderate Risk", "Safe"],
    default=["High Risk", "Moderate Risk", "Safe"]
)

# Apply filters
filtered_df = df.copy()
if selected_dept != "All":
    filtered_df = filtered_df[filtered_df["department"] == selected_dept]
if selected_sem != "All":
    filtered_df = filtered_df[filtered_df["semester"] == selected_sem]
if risk_filter:
    filtered_df = filtered_df[filtered_df["risk_category"].isin(risk_filter)]

# --- Header Section ---
st.title("🎓 EduPulse : Student Analytics & Risk Early Warning System")
st.markdown("Real-time campus intelligence powered by **Supabase PostgreSQL & Streamlit**.")

# --- Key Metrics Row ---
col1, col2, col3, col4, col5 = st.columns(5)
total_students = len(filtered_df)
avg_cgpa = filtered_df["cgpa"].mean() if total_students > 0 else 0
avg_att = filtered_df["overall_attendance_pct"].mean() if total_students > 0 else 0
high_risk_count = len(filtered_df[filtered_df["risk_category"] == "High Risk"])
avg_readiness = filtered_df["placement_readiness"].mean() if total_students > 0 else 0

col1.metric("Enrolled Students", f"{total_students:,}")
col2.metric("Average CGPA", f"{avg_cgpa:.2f} / 10")
col3.metric("Avg Attendance", f"{avg_att:.1f}%")
col4.metric("🚨 At-Risk Students", f"{high_risk_count}", delta=f"{(high_risk_count/total_students*100):.1f}%" if total_students > 0 else "0", delta_color="inverse")
col5.metric("Avg Placement Score", f"{avg_readiness:.1f} / 100")

st.divider()

# --- Tabs for Clean Navigation ---
tab1, tab2, tab3, tab4 = st.tabs([
    "🚨 Early Warning & Dropout Risk", 
    "📊 Academic & Department Insights", 
    "💼 Placement Readiness & Skills", 
    "📋 Student Directory & Explorer"
])

# --- TAB 1: Early Warning & Dropout Risk ---
with tab1:
    st.subheader("At-Risk Student Intervention Dashboard")
    st.caption("Identifies students who need immediate mentoring based on attendance drops, backlogs, and academic trends.")
    
    col_t1_1, col_t1_2 = st.columns([1, 1])
    
    with col_t1_1:
        fig_risk_dist = px.pie(
            filtered_df, 
            names="risk_category", 
            title="Student Population by Risk Category",
            color="risk_category",
            color_discrete_map={"High Risk": "#EF4444", "Moderate Risk": "#F59E0B", "Safe": "#10B981"},
            hole=0.45
        )
        st.plotly_chart(fig_risk_dist, use_container_width=True)
        
    with col_t1_2:
        fig_scatter = px.scatter(
            filtered_df,
            x="overall_attendance_pct",
            y="cgpa",
            color="risk_category",
            size="backlogs",
            hover_data=["student_id", "full_name", "department"],
            title="Attendance vs CGPA (Bubble size = Backlogs)",
            color_discrete_map={"High Risk": "#EF4444", "Moderate Risk": "#F59E0B", "Safe": "#10B981"},
            labels={"overall_attendance_pct": "Attendance (%)", "cgpa": "CGPA"}
        )
        # Add warning reference lines
        fig_scatter.add_vline(x=75, line_dash="dash", line_color="orange", annotation_text="Min 75% Attendance")
        fig_scatter.add_hline(y=6.0, line_dash="dash", line_color="red", annotation_text="Min 6.0 CGPA")
        st.plotly_chart(fig_scatter, use_container_width=True)

    st.markdown("### ⚠️ Priority Action List (High Risk Students)")
    high_risk_df = filtered_df[filtered_df["risk_category"] == "High Risk"].sort_values(by="risk_score", ascending=False)
    
    st.dataframe(
        high_risk_df[[
            "student_id", "full_name", "department", "semester", "cgpa", 
            "backlogs", "overall_attendance_pct", "risk_score", "email"
        ]].head(15),
        use_container_width=True,
        hide_index=True
    )

# --- TAB 2: Academic & Department Insights ---
with tab2:
    st.subheader("Department Performance & Academic Benchmarks")
    col_t2_1, col_t2_2 = st.columns([1, 1])
    
    with col_t2_1:
        dept_summary = df.groupby("department")[["cgpa", "exam_score_avg", "overall_attendance_pct"]].mean().reset_index()
        fig_dept_bar = px.bar(
            dept_summary,
            x="department",
            y="cgpa",
            color="department",
            title="Average CGPA by Department",
            text_auto=".2f"
        )
        st.plotly_chart(fig_dept_bar, use_container_width=True)
        
    with col_t2_2:
        fig_lms = px.scatter(
            filtered_df,
            x="login_frequency_weekly",
            y="assignment_completion_pct",
            color="department",
            title="LMS Engagement: Login Frequency vs Assignment Completion",
            labels={"login_frequency_weekly": "Weekly Logins", "assignment_completion_pct": "Assignments Completed (%)"}
        )
        st.plotly_chart(fig_lms, use_container_width=True)

# --- TAB 3: Placement Readiness & Skills ---
with tab3:
    st.subheader("Placement Preparation & Employability Metrics")
    col_t3_1, col_t3_2 = st.columns([1, 1])
    
    with col_t3_1:
        fig_coding_apt = px.scatter(
            filtered_df,
            x="aptitude_score",
            y="coding_score",
            color="placement_readiness",
            color_continuous_scale="Viridis",
            title="Aptitude vs Coding Scores (Colored by Overall Readiness)",
            hover_data=["student_id", "full_name"]
        )
        st.plotly_chart(fig_coding_apt, use_container_width=True)
        
    with col_t3_2:
        fig_interview_hist = px.histogram(
            filtered_df,
            x="mock_interview_rating",
            nbins=15,
            title="Mock Interview Ratings Distribution (1-10)",
            color_discrete_sequence=["#6366F1"]
        )
        st.plotly_chart(fig_interview_hist, use_container_width=True)

    st.markdown("### 🏆 Top 10 Placement-Ready Candidates")
    top_candidates = filtered_df.sort_values(by="placement_readiness", ascending=False).head(10)
    st.dataframe(
        top_candidates[[
            "student_id", "full_name", "department", "cgpa", 
            "aptitude_score", "coding_score", "mock_interview_rating", "placement_readiness"
        ]],
        use_container_width=True,
        hide_index=True
    )

# --- TAB 4: Student Directory & Search ---
with tab4:
    st.subheader("Student Intelligence Directory")
    search_query = st.text_input("🔍 Search student by ID or Name:")
    
    display_table = filtered_df.copy()
    if search_query:
        display_table = display_table[
            display_table["student_id"].str.contains(search_query, case=False, na=False) |
            display_table["full_name"].str.contains(search_query, case=False, na=False)
        ]
        
    st.dataframe(
        display_table[[
            "student_id", "full_name", "department", "semester", "cgpa", 
            "backlogs", "overall_attendance_pct", "risk_category", "placement_readiness"
        ]],
        use_container_width=True,
        hide_index=True
    )

st.caption("EduPulse Platform • Built for Hackathon Demo")
