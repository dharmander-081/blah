import React from 'react';
import { KpiStrip } from './KpiStrip';
import { CampusQuadrant } from './CampusQuadrant';
import { DeptComparison } from './DeptComparison';

const MOCK_ACTIVITIES = [
  { id: 1, text: 'Mentor Sharma logged a meeting with STU0142', time: '2h ago', risk: 'safe' },
  { id: 2, text: 'STU0891 attendance dropped below 60%', time: '4h ago', risk: 'critical' },
  { id: 3, text: 'Placement cell marked 23 students eligible for Infosys drive', time: '6h ago', risk: 'safe' },
  { id: 4, text: 'STU0432 missed 3 consecutive assessments in Data Structures', time: '8h ago', risk: 'moderate' },
  { id: 5, text: 'System flagged 12 students for unusual LMS inactivity', time: '1d ago', risk: 'moderate' },
  { id: 6, text: 'Mid-term grades synced from ERP for Computer Science department', time: '1d ago', risk: 'safe' },
  { id: 7, text: 'Counselor notes updated for 4 at-risk students', time: '2d ago', risk: 'safe' },
  { id: 8, text: 'STU0911 CGPA improved to 8.2, removed from watch list', time: '2d ago', risk: 'safe' },
];

export function Cockpit() {
  return (
    <div className="w-full flex flex-col h-full overflow-auto bg-[var(--bg)] text-[var(--text)]">
      <KpiStrip />
      
      <div className="px-6 py-8 flex flex-col gap-10">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column - Campus Health (60%) */}
          <div className="flex-[3] flex flex-col min-w-0">
            <div className="text-[11px] uppercase tracking-[0.04em] text-[var(--text-faint)] mb-3">Campus Health</div>
            <CampusQuadrant />
          </div>

          {/* Right Column - Dept Comparison (40%) */}
          <div className="flex-[2] flex flex-col min-w-0">
            <div className="text-[11px] uppercase tracking-[0.04em] text-[var(--text-faint)] mb-3">Department Benchmarks</div>
            <DeptComparison />
          </div>
        </div>

        {/* Activity Feed */}
        <div className="flex flex-col">
          <div className="text-[11px] uppercase tracking-[0.04em] text-[var(--text-faint)] mb-3">Recent Activity</div>
          <div className="flex flex-col">
            {MOCK_ACTIVITIES.map((activity, index) => {
              let dotColor = '#30A46C'; // safe
              if (activity.risk === 'critical') dotColor = '#E5484D';
              if (activity.risk === 'moderate') dotColor = '#F5A524';

              return (
                <div key={activity.id} className="flex items-center py-3 border-t border-[var(--border)] gap-3">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: dotColor }} />
                  <div className="text-[13px] text-[var(--text-muted)] flex-1">{activity.text}</div>
                  <div className="text-[11px] font-mono text-[var(--text-faint)]">{activity.time}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
