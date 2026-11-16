import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/data/store';
import { Calendar, Briefcase, Lock, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar
} from 'recharts';

const Section: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="mb-8">
    <div className="text-[11px] uppercase tracking-[0.04em] text-[var(--text-faint)] mb-3">
      {label}
    </div>
    {children}
  </div>
);

export const StudentDrawer: React.FC = () => {
  const { drawerStudentId, drawerStudent, closeDrawer, students } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (drawerStudentId) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [drawerStudentId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeDrawer]);

  const student = drawerStudent();
  const isVisible = !!drawerStudentId;

  if (!student) {
    return (
      <>
        <div
          className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-[220ms] ease-out ${
            isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={closeDrawer}
        />
        <div
          className={`fixed inset-y-0 right-0 z-50 w-[480px] bg-[var(--surface)] border-l border-[var(--border)] shadow-lg transition-transform duration-[220ms] ease-out flex flex-col ${
            isVisible ? 'translate-x-0' : 'translate-x-full'
          }`}
        />
      </>
    );
  }

  // Derived metrics
  const cgpaDelta = student.academics.cgpa - student.academics.prev_cgpa;
  const cgpaColor =
    cgpaDelta > 0 ? '#30A46C' : cgpaDelta < 0 ? '#E5484D' : 'var(--text-muted)';
  const cgpaSign = cgpaDelta > 0 ? '+' : '';
  const sparklineData = student.academics.semester_cgpas.map((cgpa, i) => ({
    name: `Sem ${i + 1}`,
    cgpa
  }));

  const att = student.attendance.overall_attendance_pct;
  const attColor = att >= 75 ? '#30A46C' : '#E5484D';
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (att / 100) * circumference;

  const avgLogin =
    students.reduce((acc, s) => acc + s.lms.login_frequency_weekly, 0) /
    (students.length || 1);
  const maxLogin = Math.max(...students.map((s) => s.lms.login_frequency_weekly), 1);

  const radarData = [
    { subject: 'Aptitude', A: student.placement.aptitude_score, fullMark: 100 },
    { subject: 'Coding', A: student.placement.coding_score, fullMark: 100 },
    { subject: 'Interview', A: student.placement.mock_interview_rating * 10, fullMark: 100 },
    { subject: 'CGPA', A: student.academics.cgpa * 10, fullMark: 100 }
  ];

  const risk = student.risk;
  const totalContrib =
    risk.attendance_contribution +
    risk.backlog_contribution +
    risk.lms_contribution +
    risk.academic_contribution;
  const attPct = (risk.attendance_contribution / totalContrib) * 100 || 0;
  const backPct = (risk.backlog_contribution / totalContrib) * 100 || 0;
  const lmsPct = (risk.lms_contribution / totalContrib) * 100 || 0;
  const acadPct = (risk.academic_contribution / totalContrib) * 100 || 0;
  const bandColor =
    risk.band === 'critical' ? '#E5484D' : risk.band === 'moderate' ? '#F5A524' : '#30A46C';

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-[220ms] ease-out ${
          isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-[480px] bg-[var(--surface)] border-l border-[var(--border)] shadow-2xl transition-transform duration-[220ms] ease-out flex flex-col ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* HEADER */}
        <div className="flex items-start justify-between p-6 border-b border-[var(--border)] shrink-0">
          <div className="flex gap-4 items-center">
            <div
              className="w-12 h-12 flex items-center justify-center rounded-[6px] font-bold text-lg"
              style={{
                backgroundColor: `hsla(${student.avatar_hue}, 70%, 50%, 0.15)`,
                color: `hsl(${student.avatar_hue}, 70%, 65%)`
              }}
            >
              {student.avatar_initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] font-medium text-[var(--text)]">
                  {student.full_name}
                </h2>
                <span className="font-mono text-sm text-[var(--text-muted)] tabular-nums">
                  {student.student_id}
                </span>
              </div>
              <div className="text-sm flex items-center gap-2 mt-1">
                <span className="text-[var(--text-muted)]">
                  {student.department} • Sem {student.semester}
                </span>
              </div>
              <div className="text-sm text-[var(--text-muted)] mt-0.5">{student.email}</div>
              <div className="mt-2">
                {student.consent.share_wellbeing_with_mentor ? (
                  <span className="inline-flex items-center px-1.5 py-0.5 border border-[var(--border)] rounded text-[10px] text-[var(--text-faint)] uppercase tracking-wider">
                    -- Shared with consent
                  </span>
                ) : (
                  <span className="inline-flex items-center px-1.5 py-0.5 border border-[var(--border)] rounded text-[10px] text-[var(--text-faint)] uppercase tracking-wider">
                    -- Aggregate only
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            className="text-[var(--text-faint)] hover:text-[var(--text)] transition-colors p-1 rounded focus:outline-none focus:ring-1 focus:ring-[#F5A524]"
          >
            <X size={16} />
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[var(--border-strong)] [&::-webkit-scrollbar-thumb]:rounded-full">
          {/* ACADEMIC HEALTH */}
          <Section label="Academic Health">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-[var(--border)] rounded-[8px]">
                <div className="text-[11px] uppercase tracking-[0.04em] text-[var(--text-faint)] mb-2">
                  CGPA Trend
                </div>
                <div className="flex items-end gap-3">
                  <div className="font-mono text-3xl text-[var(--text)] tabular-nums leading-none">
                    {student.academics.cgpa.toFixed(2)}
                  </div>
                  <div
                    className="font-mono text-sm tabular-nums leading-none mb-1"
                    style={{ color: cgpaColor }}
                  >
                    {cgpaSign}
                    {cgpaDelta.toFixed(2)}
                  </div>
                </div>
                <div className="h-[60px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparklineData}>
                      <Line
                        type="monotone"
                        dataKey="cgpa"
                        stroke="#F5A524"
                        strokeWidth={1.5}
                        dot={false}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="p-4 border border-[var(--border)] rounded-[8px] flex-1 flex flex-col justify-center">
                  <div className="text-[11px] uppercase tracking-[0.04em] text-[var(--text-faint)] mb-2">
                    Backlogs
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-2 text-sm font-mono text-[var(--text)] border border-[var(--border)] px-2 py-1 rounded-[6px]">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          student.academics.backlogs > 0 ? 'bg-[#E5484D]' : 'bg-[#30A46C]'
                        }`}
                      />
                      {student.academics.backlogs} backlogs
                    </span>
                  </div>
                </div>
                <div className="p-4 border border-[var(--border)] rounded-[8px] flex-1 flex flex-col justify-center">
                  <div className="text-[11px] uppercase tracking-[0.04em] text-[var(--text-faint)] mb-1">
                    Exam Avg
                  </div>
                  <div className="font-mono text-xl text-[var(--text)] tabular-nums">
                    {student.academics.exam_score_avg.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* ATTENDANCE */}
          <Section label="Attendance">
            <div className="flex items-center gap-6 p-4 border border-[var(--border)] rounded-[8px]">
              <div className="relative w-[80px] h-[80px] shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    className="stroke-[var(--border)] fill-none"
                    strokeWidth="6"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke={attColor}
                    className="fill-none transition-all duration-500"
                    strokeWidth="6"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-mono text-[13px] text-[var(--text)] tabular-nums">
                  {att}%
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="font-mono text-sm text-[var(--text)] tabular-nums">
                  {student.attendance.classes_attended} / {student.attendance.classes_total} classes
                </div>
                {att >= 75 ? (
                  <div className="text-sm" style={{ color: '#30A46C' }}>
                    On track
                  </div>
                ) : (
                  <div className="text-[13px] text-[var(--text-muted)] leading-tight mt-1">
                    Attend{' '}
                    {Math.ceil(
                      0.75 * student.attendance.classes_total -
                        student.attendance.classes_attended
                    )}{' '}
                    more classes to reach 75%
                  </div>
                )}
              </div>
            </div>
          </Section>

          {/* ENGAGEMENT */}
          <Section label="Engagement">
            <div className="space-y-5 p-4 border border-[var(--border)] rounded-[8px]">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[var(--text-muted)]">Login Frequency</span>
                  <span className="font-mono text-[var(--text)] tabular-nums">
                    {student.lms.login_frequency_weekly}/wk
                  </span>
                </div>
                <div className="h-1.5 flex w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-[4px] overflow-hidden">
                  <div
                    className="h-full bg-[#F5A524]"
                    style={{
                      width: `${(student.lms.login_frequency_weekly / maxLogin) * 100}%`
                    }}
                  />
                </div>
                <div className="text-[10px] text-[var(--text-faint)] mt-1.5">
                  Campus avg: {avgLogin.toFixed(1)}/wk
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[var(--text-muted)]">Assignment Completion</span>
                  <span className="font-mono text-[var(--text)] tabular-nums">
                    {student.lms.assignment_completion_pct}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-[4px] overflow-hidden">
                  <div
                    className="h-full bg-[#F5A524]"
                    style={{ width: `${student.lms.assignment_completion_pct}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-sm pt-1">
                <span className="text-[var(--text-muted)]">Video Watch Rate</span>
                <span className="font-mono text-[var(--text)] tabular-nums">
                  {student.lms.video_watch_rate_pct}%
                </span>
              </div>
            </div>
          </Section>

          {/* PLACEMENT READINESS */}
          <Section label="Placement Readiness">
            <div className="p-4 border border-[var(--border)] rounded-[8px] flex items-center gap-4">
              <div className="w-[160px] h-[160px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: 'var(--text-faint)', fontSize: 10 }}
                    />
                    <Radar
                      name="Student"
                      dataKey="A"
                      stroke="#F5A524"
                      fill="#F5A524"
                      fillOpacity={0.15}
                      isAnimationActive={false}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col items-center justify-center flex-1">
                <div className="text-[11px] uppercase tracking-[0.04em] text-[var(--text-faint)] mb-2">
                  Employability
                </div>
                <div className="font-mono text-4xl text-[var(--text)] tabular-nums">
                  {student.employability.total.toFixed(0)}
                </div>
                <div className="text-[10px] text-[var(--text-muted)] mt-1">/ 100</div>
              </div>
            </div>
          </Section>

          {/* RISK BREAKDOWN */}
          <Section label="Risk Breakdown">
            <div className="p-4 border border-[var(--border)] rounded-[8px]">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-[var(--text-muted)]">Total Risk Score</div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg text-[var(--text)] tabular-nums">
                    {risk.total}
                  </span>
                  <div className="flex items-center gap-1.5 border border-[var(--border)] px-2 py-0.5 rounded-[6px]">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: bandColor }}
                    />
                    <span className="text-[10px] uppercase tracking-wider text-[var(--text)] capitalize">
                      {risk.band}
                    </span>
                  </div>
                </div>
              </div>
              <div className="h-2 flex w-full bg-[var(--surface-2)] rounded-[4px] overflow-hidden mb-4">
                <div
                  className="h-full bg-[#E5484D]/80"
                  style={{ width: `${attPct}%` }}
                  title="Attendance"
                />
                <div
                  className="h-full bg-[#F5A524]/80"
                  style={{ width: `${backPct}%` }}
                  title="Backlogs"
                />
                <div
                  className="h-full bg-[#30A46C]/80"
                  style={{ width: `${acadPct}%` }}
                  title="Academic"
                />
                <div
                  className="h-full bg-[var(--text-faint)]"
                  style={{ width: `${lmsPct}%` }}
                  title="LMS"
                />
              </div>
              <div className="grid grid-cols-2 gap-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-[2px] bg-[#E5484D]/80" />
                  <span className="text-[var(--text-muted)]">Attendance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-[2px] bg-[#F5A524]/80" />
                  <span className="text-[var(--text-muted)]">Backlogs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-[2px] bg-[#30A46C]/80" />
                  <span className="text-[var(--text-muted)]">Academic Slide</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-[2px] bg-[var(--text-faint)]" />
                  <span className="text-[var(--text-muted)]">LMS Dropoff</span>
                </div>
              </div>
            </div>
          </Section>

          {/* WELLBEING */}
          <Section label="Wellbeing">
            {student.consent.share_wellbeing_with_mentor && student.checkins.length > 0 ? (
              <div className="p-4 border border-[var(--border)] rounded-[8px]">
                <div className="flex justify-between items-center mb-4">
                  <span className="inline-flex items-center px-1.5 py-0.5 border border-[var(--border)] rounded text-[10px] text-[var(--text-faint)] uppercase tracking-wider">
                    -- Shared with consent
                  </span>
                </div>
                {/* 14 days mood trend sparkline */}
                <div className="h-[40px] w-full mb-5">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[...student.checkins].slice(0, 14).reverse()}>
                      <Line
                        type="monotone"
                        dataKey="mood"
                        stroke="#F5A524"
                        strokeWidth={1.5}
                        dot={false}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col border border-[var(--border)] rounded-[6px] p-2 items-center">
                    <div className="text-[10px] uppercase text-[var(--text-faint)] mb-1">
                      Mood
                    </div>
                    <div className="font-mono text-sm text-[var(--text)] tabular-nums">
                      {student.checkins[0].mood}/5
                    </div>
                  </div>
                  <div className="flex flex-col border border-[var(--border)] rounded-[6px] p-2 items-center">
                    <div className="text-[10px] uppercase text-[var(--text-faint)] mb-1">
                      Sleep
                    </div>
                    <div className="font-mono text-sm text-[var(--text)] tabular-nums">
                      {student.checkins[0].sleep_hours}h
                    </div>
                  </div>
                  <div className="flex flex-col border border-[var(--border)] rounded-[6px] p-2 items-center">
                    <div className="text-[10px] uppercase text-[var(--text-faint)] mb-1">
                      Stress
                    </div>
                    <div className="font-mono text-sm text-[var(--text)] tabular-nums">
                      {student.checkins[0].stress}/5
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 border border-[var(--border)] rounded-[8px] flex items-center justify-center py-8 bg-[var(--surface-2)]">
                <div className="flex flex-col items-center gap-2 text-[var(--text-faint)]">
                  <Lock size={16} />
                  <span className="text-[13px]">Student has not shared wellbeing data</span>
                </div>
              </div>
            )}
          </Section>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--surface)] grid grid-cols-2 gap-3 shrink-0">
          <button
            onClick={() =>
              toast('Mentor session scheduled', {
                action: { label: 'Undo', onClick: () => {} }
              })
            }
            className="flex items-center justify-center gap-2 px-3 py-2 border border-[var(--border)] rounded-[6px] text-[13px] text-[var(--text)] hover:border-[#F5A524] hover:text-[#F5A524] transition-colors focus:outline-none focus:ring-1 focus:ring-[#F5A524]"
          >
            <Calendar size={14} /> Schedule mentor session
          </button>
          <button
            onClick={() =>
              toast('Marked eligible for drive', {
                action: { label: 'Undo', onClick: () => {} }
              })
            }
            className="flex items-center justify-center gap-2 px-3 py-2 border border-[var(--border)] rounded-[6px] text-[13px] text-[var(--text)] hover:border-[#F5A524] hover:text-[#F5A524] transition-colors focus:outline-none focus:ring-1 focus:ring-[#F5A524]"
          >
            <Briefcase size={14} /> Mark eligible for drive
          </button>
        </div>
      </div>
    </>
  );
};

