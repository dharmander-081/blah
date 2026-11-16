import React from 'react';
import { useAppStore } from '@/data/store';
import { ArrowUpRight, ArrowDownRight, CircleCheck } from 'lucide-react';

export default function HomeTab() {
  const currentStudent = useAppStore(state => state.currentStudent());
  
  if (!currentStudent) {
    return <div className="p-4 text-[15px] text-[#6B675C]">Loading student data...</div>;
  }

  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
  const formattedDate = today.toLocaleDateString('en-GB', dateOptions);

  const hasCheckedInToday = currentStudent.checkins.some(
    c => c.date === today.toISOString().split('T')[0]
  );

  const { cgpa, prev_cgpa } = currentStudent.academics;
  const { classes_attended, classes_total, overall_attendance_pct } = currentStudent.attendance;
  
  const cgpaTrend = cgpa >= prev_cgpa;
  const attendanceTarget = 75;
  const targetClasses = Math.ceil((0.75 * classes_total - classes_attended) / (1 - 0.75));

  return (
    <div className="flex flex-col">
      <div className="h-[44px] flex items-center px-4 shrink-0">
        <h1 className="text-[15px] font-medium text-[#1A1A17]">{formattedDate}</h1>
      </div>

      <div className="px-4 pb-6 space-y-6">
        {/* Academic health card */}
        <div className="bg-[#FBFAF7] border border-[#E4E0D6] rounded-[8px] p-4 flex flex-col space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-[0.04em] text-[#6B675C] mb-1">Current CGPA</span>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[24px] text-[#1A1A17]">{cgpa.toFixed(2)}</span>
                {cgpaTrend ? (
                  <ArrowUpRight size={16} strokeWidth={1.5} className="text-[#30A46C]" />
                ) : (
                  <ArrowDownRight size={16} strokeWidth={1.5} className="text-[#E5484D]" />
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[11px] uppercase tracking-[0.04em] text-[#6B675C]">Attendance</span>
              <span className="font-mono text-[13px] text-[#1A1A17]">{overall_attendance_pct}%</span>
            </div>
            <div className="h-2 w-full bg-[#E4E0D6] rounded-[4px] overflow-hidden">
              <div 
                className={`h-full rounded-[4px] ${overall_attendance_pct >= 75 ? 'bg-[#30A46C]' : overall_attendance_pct >= 65 ? 'bg-[#F5A524]' : 'bg-[#E5484D]'}`} 
                style={{ width: `${overall_attendance_pct}%` }} 
              />
            </div>
            {overall_attendance_pct < attendanceTarget && targetClasses > 0 && (
              <span className="text-[13px] text-[#6B675C]">
                Attend {targetClasses} more classes to hit 75%
              </span>
            )}
          </div>
        </div>

        {/* Check-in prompt */}
        {!hasCheckedInToday && (
          <div className="bg-[#FBFAF7] border border-[#E4E0D6] rounded-[6px] p-4 flex justify-between items-center">
            <span className="text-[15px] text-[#1A1A17]">How are you feeling today?</span>
            <button className="bg-[#F5A524] text-[#1A1A17] text-[13px] font-medium px-3 py-1.5 rounded-[6px] transition-colors duration-150 hover:bg-[#E59513]">
              Check in
            </button>
          </div>
        )}

        {/* This week */}
        <div className="flex flex-col space-y-3">
          <h2 className="text-[11px] uppercase tracking-[0.04em] text-[#6B675C]">This week</h2>
          <div className="flex flex-col">
            <div className="flex items-start py-3 border-b border-[#E4E0D6] last:border-0">
              <div className="w-[6px] h-[6px] rounded-full bg-[#F5A524] mt-1.5 mr-3 shrink-0" />
              <span className="text-[15px] text-[#1A1A17]">Mentor meeting with Prof. Kumar <span className="text-[#6B675C]">— Tomorrow, 2pm</span></span>
            </div>
            <div className="flex items-start py-3 border-b border-[#E4E0D6] last:border-0">
              <div className="w-[6px] h-[6px] rounded-full bg-[#E5484D] mt-1.5 mr-3 shrink-0" />
              <span className="text-[15px] text-[#1A1A17]">DSA Assignment due <span className="text-[#6B675C]">— Thursday</span></span>
            </div>
            <div className="flex items-start py-3 border-b border-[#E4E0D6] last:border-0">
              <div className="w-[6px] h-[6px] rounded-full bg-[#30A46C] mt-1.5 mr-3 shrink-0" />
              <span className="text-[15px] text-[#1A1A17]">TEDx Campus <span className="text-[#6B675C]">— Saturday, Auditorium</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
