import { Academics, Attendance, LmsActivity, PlacementMetrics, RiskScore, EmployabilityScore } from './types';

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

export function calculateRisk(academics: Academics, attendance: Attendance, lms: LmsActivity): RiskScore {
  const attendanceGap = clamp((75 - attendance.overall_attendance_pct) / 30, 0, 1);
  const backlogFactor = clamp(academics.backlogs / 4, 0, 1);
  const prevLogin = lms.prev_login_frequency > 0 ? lms.prev_login_frequency : 0.5;
  const lmsDropoff = clamp(1 - (lms.login_frequency_weekly / prevLogin), 0, 1);
  const academicSlide = clamp((academics.prev_cgpa - academics.cgpa) / 1.5, 0, 1);

  const total = 40 * attendanceGap + 25 * backlogFactor + 20 * lmsDropoff + 15 * academicSlide;

  let band: 'critical' | 'moderate' | 'safe' = 'safe';
  if (total >= 60) band = 'critical';
  else if (total >= 30) band = 'moderate';

  return {
    total,
    band,
    attendance_contribution: 40 * attendanceGap,
    backlog_contribution: 25 * backlogFactor,
    lms_contribution: 20 * lmsDropoff,
    academic_contribution: 15 * academicSlide
  };
}

export function calculateEmployability(academics: Academics, placement: PlacementMetrics): EmployabilityScore {
  const coding_component = 0.30 * placement.coding_score;
  const aptitude_component = 0.25 * placement.aptitude_score;
  const cgpa_component = 0.25 * (academics.cgpa * 10);
  const interview_component = 0.20 * (placement.mock_interview_rating * 10);
  
  return {
    total: coding_component + aptitude_component + cgpa_component + interview_component,
    coding_component,
    aptitude_component,
    cgpa_component,
    interview_component
  };
}
