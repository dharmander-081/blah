import React from 'react';
import { useAppStore } from '@/data/store';

const HARDCODED_CIRCLES = [
  { id: 'c1', name: 'GATE 2027 Prep', members: 12, next: 'Tomorrow, 5pm at Library' },
  { id: 'c2', name: 'Open Source Club', members: 8, next: 'Friday, 6pm online' },
  { id: 'c3', name: 'Night Owls Study Group', members: 15, next: 'Tonight, 10pm at Hostel A' },
  { id: 'c4', name: 'Competitive Coding', members: 22, next: 'Saturday, 10am at CS Block' },
];

export default function ConnectTab() {
  const currentStudent = useAppStore(state => state.currentStudent());
  const allStudents = useAppStore(state => state.students);

  if (!currentStudent) return null;

  // Simple mock matching algorithm
  const matchedStudents = allStudents
    .filter(s => s.student_id !== currentStudent.student_id)
    .map(s => {
      const shared = s.interests.filter(i => currentStudent.interests.includes(i)).length;
      return { ...s, shared };
    })
    .filter(s => s.shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, 8);

  return (
    <div className="flex flex-col min-h-full pb-8">
      <div className="h-[44px] flex items-center px-4 shrink-0">
        <h1 className="text-[15px] font-medium text-[#1A1A17]">Connect</h1>
      </div>

      <div className="px-4 flex flex-col space-y-8">
        {/* Own interests */}
        <div className="flex flex-col space-y-2">
          <span className="text-[13px] text-[#6B675C]">Your interests</span>
          <div className="flex flex-wrap gap-2">
            {currentStudent.interests.map(i => (
              <span key={i} className="px-3 py-1 rounded-[6px] border border-[#E4E0D6] text-[13px] text-[#1A1A17] bg-[#FBFAF7]">
                {i}
              </span>
            ))}
          </div>
        </div>

        {/* People Like You */}
        <div className="flex flex-col space-y-3">
          <h2 className="text-[11px] uppercase tracking-[0.04em] text-[#6B675C]">People like you</h2>
          <div className="flex flex-col space-y-3">
            {matchedStudents.map(student => (
              <div key={student.student_id} className="flex items-center justify-between p-3 border border-[#E4E0D6] rounded-[8px] bg-[#FBFAF7]">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `hsl(${student.avatar_hue}, 40%, 85%)` }}
                  >
                    <span className="text-[13px] font-medium text-[#1A1A17]">{student.avatar_initials}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-medium text-[#1A1A17]">
                      {student.full_name.split(' ')[0]} <span className="font-normal text-[#6B675C] text-[13px]">• {student.department}</span>
                    </span>
                    <span className="text-[13px] text-[#6B675C]">
                      <span className="font-mono text-[#1A1A17]">{student.shared}</span> shared interests, also in Sem {student.semester}
                    </span>
                  </div>
                </div>
                <button className="border border-[#E4E0D6] rounded-[6px] px-3 py-1.5 text-[13px] text-[#1A1A17] hover:bg-[#F6F4EF] transition-colors shrink-0">
                  Say hi
                </button>
              </div>
            ))}
            {matchedStudents.length === 0 && (
              <span className="text-[13px] text-[#6B675C]">Add more interests to find matches.</span>
            )}
          </div>
        </div>

        {/* Circles */}
        <div className="flex flex-col space-y-3">
          <h2 className="text-[11px] uppercase tracking-[0.04em] text-[#6B675C]">Circles</h2>
          <div className="flex flex-col space-y-3">
            {HARDCODED_CIRCLES.map(circle => (
              <div key={circle.id} className="flex items-center justify-between p-3 border border-[#E4E0D6] rounded-[8px] bg-[#FBFAF7]">
                <div className="flex flex-col">
                  <span className="text-[15px] font-medium text-[#1A1A17]">{circle.name}</span>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-[13px] text-[#6B675C]"><span className="font-mono text-[#1A1A17]">{circle.members}</span> members</span>
                    <span className="text-[13px] text-[#E4E0D6]">•</span>
                    <span className="text-[13px] text-[#6B675C]">{circle.next}</span>
                  </div>
                </div>
                <button className="bg-[#F5A524] text-[#1A1A17] text-[13px] font-medium px-4 py-1.5 rounded-[6px] transition-colors hover:bg-[#E59513] shrink-0">
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Note */}
        <div className="pt-4 border-t border-[#E4E0D6]">
          <span className="text-[11px] text-[#8B8B96] leading-relaxed block">
            Students see your first name, department and shared interests only until you accept a connection.
          </span>
        </div>
      </div>
    </div>
  );
}
