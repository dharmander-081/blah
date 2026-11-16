import { useMemo } from 'react';
import { useAppStore } from '@/data/store';

export function KpiStrip() {
  const students = useAppStore(state => state.students);
  const filters = useAppStore(state => state.filters);

  const filtered = useMemo(() => {
    return students.filter(student => {
      if (filters.department && student.department !== filters.department) return false;
      if (filters.semester && student.semester !== filters.semester) return false;
      if (filters.riskBand.length > 0 && !filters.riskBand.includes(student.risk.band)) return false;
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = student.full_name.toLowerCase().includes(query);
        const matchesId = student.student_id.toLowerCase().includes(query);
        if (!matchesName && !matchesId) return false;
      }
      return true;
    });
  }, [students, filters]);

  const total = filtered.length;
  
  let totalCgpa = 0;
  let totalAttendance = 0;
  let atRiskCount = 0;
  let placementReadyCount = 0;

  filtered.forEach(s => {
    totalCgpa += s.academics.cgpa;
    totalAttendance += s.attendance.overall_attendance_pct;
    if (s.risk.band === 'critical' || s.risk.band === 'moderate') {
      atRiskCount++;
    }
    if (s.employability.total > 65) {
      placementReadyCount++;
    }
  });

  const avgCgpa = total > 0 ? (totalCgpa / total).toFixed(2) : '0.00';
  const avgAttendance = total > 0 ? (totalAttendance / total).toFixed(1) : '0.0';
  const atRiskPct = total > 0 ? ((atRiskCount / total) * 100).toFixed(1) : '0.0';

  const isAttendanceLow = parseFloat(avgAttendance) < 75;

  return (
    <div className="flex flex-row items-center divide-x divide-[var(--border)] border-b border-[var(--border)] w-full">
      <div className="px-6 py-3 flex flex-col justify-center flex-1">
        <div className="text-[11px] uppercase tracking-[0.04em] text-[var(--text-faint)] mb-1">Enrolled</div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono tabular-nums text-2xl text-[var(--text)]">{total}</span>
          <span className="text-xs text-[var(--text-faint)]">12 new this month</span>
        </div>
      </div>

      <div className="px-6 py-3 flex flex-col justify-center flex-1">
        <div className="text-[11px] uppercase tracking-[0.04em] text-[var(--text-faint)] mb-1">Avg CGPA</div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono tabular-nums text-2xl text-[var(--text)]">{avgCgpa}</span>
          <span className="text-xs text-[var(--text-faint)]">+0.2 vs last sem</span>
        </div>
      </div>

      <div className="px-6 py-3 flex flex-col justify-center flex-1">
        <div className="text-[11px] uppercase tracking-[0.04em] text-[var(--text-faint)] mb-1">Attendance</div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono tabular-nums text-2xl text-[var(--text)]">{avgAttendance}%</span>
          <span className={`text-xs ${isAttendanceLow ? 'text-[#F5A524]' : 'text-[var(--text-faint)]'}`}>
            {isAttendanceLow ? 'Below target' : '+1.2% this week'}
          </span>
        </div>
      </div>

      <div className="px-6 py-3 flex flex-col justify-center flex-1">
        <div className="text-[11px] uppercase tracking-[0.04em] text-[var(--text-faint)] mb-1">At Risk</div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono tabular-nums text-2xl text-[var(--text)]">{atRiskCount}</span>
          <span className="text-xs text-[var(--text-faint)]">{atRiskPct}% of total</span>
        </div>
      </div>

      <div className="px-6 py-3 flex flex-col justify-center flex-1">
        <div className="text-[11px] uppercase tracking-[0.04em] text-[var(--text-faint)] mb-1">Placement Ready</div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono tabular-nums text-2xl text-[var(--text)]">{placementReadyCount}</span>
          <span className="text-xs text-[var(--text-faint)]">Eligible</span>
        </div>
      </div>
    </div>
  );
}
