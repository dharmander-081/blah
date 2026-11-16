export interface Student {
  student_id: string
  full_name: string
  department: 'Computer Science' | 'Information Technology' | 'Electronics' | 'Mechanical' | 'Civil'
  semester: number
  email: string
  interests: string[]
  bio: string
  avatar_initials: string
  avatar_hue: number
}

export interface Academics {
  student_id: string
  cgpa: number
  prev_cgpa: number
  backlogs: number
  exam_score_avg: number
  semester_cgpas: number[]
}

export interface Attendance {
  student_id: string
  overall_attendance_pct: number
  classes_attended: number
  classes_total: number
  weekly_trend: number[]
}

export interface LmsActivity {
  student_id: string
  login_frequency_weekly: number
  prev_login_frequency: number
  assignment_completion_pct: number
  video_watch_rate_pct: number
}

export interface PlacementMetrics {
  student_id: string
  aptitude_score: number
  coding_score: number
  mock_interview_rating: number
}

export interface Checkin {
  student_id: string
  date: string
  mood: number
  stress: number
  sleep_hours: number
  factors: string[]
  note?: string
}

export interface Consent {
  student_id: string
  share_wellbeing_with_mentor: boolean
  share_wellbeing_with_counselor: boolean
}

export interface Achievement {
  student_id: string
  title: string
  type: 'hackathon' | 'certification' | 'club_role' | 'competition' | 'project' | 'internship'
  date: string
  verified: boolean
  verifier_name?: string
}

export interface CampusPlace {
  id: string
  name: string
  type: 'academic' | 'food' | 'recreation' | 'help' | 'hostel'
  x: number
  y: number
  busyness: 'quiet' | 'moderate' | 'packed'
  hours: string
  seats_free?: number
  upcoming_event?: string
}

export interface RiskScore {
  total: number
  band: 'critical' | 'moderate' | 'safe'
  attendance_contribution: number
  backlog_contribution: number
  lms_contribution: number
  academic_contribution: number
}

export interface EmployabilityScore {
  total: number
  coding_component: number
  aptitude_component: number
  cgpa_component: number
  interview_component: number
}

export interface EnrichedStudent extends Student {
  academics: Academics
  attendance: Attendance
  lms: LmsActivity
  placement: PlacementMetrics
  risk: RiskScore
  employability: EmployabilityScore
  checkins: Checkin[]
  consent: Consent
  achievements: Achievement[]
}
