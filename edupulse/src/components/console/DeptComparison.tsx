import React, { useMemo } from 'react';
import { useAppStore } from '@/data/store';

export function DeptComparison() {
  const students = useAppStore(state => state.students);
  const filters = useAppStore(state => state.filters);

  const deptData = useMemo(() => {
    const filtered = students.filter(student => {
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

    const depts: Record<string, { cgpaSum: number, attSum: number, riskCount: number, count: number }> = {};
    
    filtered.forEach(s => {
      const d = s.department;
      if (!depts[d]) {
        depts[d] = { cgpaSum: 0, attSum: 0, riskCount: 0, count: 0 };
      }
      depts[d].cgpaSum += s.academics.cgpa;
      depts[d].attSum += s.attendance.overall_attendance_pct;
      if (s.risk.band === 'critical' || s.risk.band === 'moderate') {
        depts[d].riskCount++;
      }
      depts[d].count++;
    });

    const result = Object.entries(depts).map(([name, stats]) => ({
      name,
      cgpa: stats.cgpaSum / stats.count,
      attendance: stats.attSum / stats.count,
      riskPct: (stats.riskCount / stats.count) * 100,
    }));

    result.sort((a, b) => b.cgpa - a.cgpa);
    return result;
  }, [students]);

  const maxCgpa = 10; // CGPA is out of 10

  return (
    <div className="w-full">
      <div className="flex flex-col gap-1">
        {deptData.map(d => (
          <div key={d.name} className="flex items-center gap-3" style={{ height: '28px' }}>
            <div className="w-32 text-[12.5px] truncate text-[var(--text-muted)]" title={d.name}>
              {d.name}
            </div>
            <div className="flex-1 h-full relative flex items-center">
              <div 
                className="h-full bg-[var(--text-faint)] opacity-20 absolute left-0 top-0 rounded-r-sm"
                style={{ width: `${(d.cgpa / maxCgpa) * 100}%` }}
              />
              <div 
                className="absolute font-mono text-[12.5px] text-[var(--text)]"
                style={{ left: `calc(${(d.cgpa / maxCgpa) * 100}% + 8px)` }}
              >
                {d.cgpa.toFixed(2)}
              </div>
            </div>
            
            {/* Small inline stats for attendance and risk per department */}
            <div className="flex gap-4 text-[11px] w-32 justify-end text-[var(--text-faint)]">
              <div className="flex flex-col items-end">
                <span>ATT</span>
                <span className="font-mono">{d.attendance.toFixed(0)}%</span>
              </div>
              <div className="flex flex-col items-end">
                <span>RISK</span>
                <span className="font-mono">{d.riskPct.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
