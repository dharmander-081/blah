import React, { useState } from 'react';
import { useAppStore } from '@/data/store';
import { Check } from 'lucide-react';

const PATH_NODES = [
  { id: 'n1', title: 'Complete DSA fundamentals', status: 'in progress', due: 'This semester', why: 'Core for your coding profile' },
  { id: 'n2', title: 'Build 2 portfolio projects', status: 'not started', due: 'Sem 5-6', why: 'Shows practical application' },
  { id: 'n3', title: 'First internship', status: 'not started', due: 'Summer 2026', why: 'Industry experience' },
  { id: 'n4', title: 'GATE mock series', status: 'not started', due: 'Sem 7', why: 'Aligns with your higher ed goal' },
  { id: 'n5', title: 'Contribute to open source', status: 'not started', due: 'Ongoing', why: 'Builds public proof of work' },
  { id: 'n6', title: 'Campus placements', status: 'upcoming', due: 'Sem 8', why: 'Final milestone' },
];

export default function PathTab() {
  const currentStudent = useAppStore(state => state.currentStudent());
  const [expandedExam, setExpandedExam] = useState<string | null>(null);

  if (!currentStudent) return null;

  const getStatusIcon = (status: string) => {
    if (status === 'done') {
      return <div className="w-4 h-4 rounded-full bg-[#1A1A17] border-2 border-[#1A1A17] flex items-center justify-center relative z-10"><Check size={10} color="#FBFAF7" strokeWidth={3} /></div>;
    }
    if (status === 'in progress') {
      return (
        <div className="w-4 h-4 rounded-full border-2 border-[#1A1A17] bg-[#FBFAF7] flex items-center justify-center relative z-10">
          <div className="w-2 h-2 rounded-full bg-[#F5A524]" />
        </div>
      );
    }
    return <div className="w-4 h-4 rounded-full border-2 border-[#E4E0D6] bg-[#FBFAF7] relative z-10" />;
  };

  const getStatusChip = (status: string) => {
    if (status === 'in progress') return <span className="px-2 py-0.5 rounded-[4px] border border-[#F5A524] text-[11px] text-[#F5A524] uppercase tracking-[0.04em]">In progress</span>;
    if (status === 'upcoming') return <span className="px-2 py-0.5 rounded-[4px] border border-[#E4E0D6] text-[11px] text-[#6B675C] uppercase tracking-[0.04em]">Upcoming</span>;
    return null;
  };

  const exams = [
    { id: 'gate', name: 'GATE', match: 88, reasons: ['Strong math fundamentals', 'High coding scores', 'Interest in core systems'], time: '8-10 months', step: 'Start mock series' },
    { id: 'cat', name: 'CAT', match: 72, reasons: ['Good aptitude scores', 'Leadership in clubs', 'Communication skills'], time: '6-8 months', step: 'Take diagnostic test' },
    { id: 'campus', name: 'Campus Placements', match: 94, reasons: ['High employability score', 'Good CGPA', 'Project portfolio'], time: '3-4 months', step: 'Resume review' },
  ];

  return (
    <div className="flex flex-col min-h-full pb-8">
      <div className="h-[44px] flex items-center px-4 shrink-0">
        <h1 className="text-[15px] font-medium text-[#1A1A17]">Your Path</h1>
      </div>

      <div className="px-4 flex flex-col space-y-10">
        
        {/* Your Path Timeline */}
        <div className="flex flex-col space-y-4">
          <div className="relative">
            <div className="absolute left-[7.5px] top-2 bottom-2 w-[1px] bg-[#E4E0D6] z-0" />
            <div className="flex flex-col space-y-6">
              {PATH_NODES.map((node, i) => (
                <div key={node.id} className="flex items-start space-x-4">
                  <div className="pt-1">
                    {getStatusIcon(node.status)}
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-[15px] ${node.status === 'done' ? 'text-[#6B675C] line-through' : 'text-[#1A1A17]'}`}>
                        {node.title}
                      </span>
                      {getStatusChip(node.status)}
                    </div>
                    <span className="text-[13px] text-[#6B675C] mt-0.5">{node.due} • {node.why}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strengths & Gaps */}
        <div className="flex flex-col space-y-3">
          <h2 className="text-[11px] uppercase tracking-[0.04em] text-[#6B675C]">Strengths and gaps</h2>
          <div className="bg-[#FBFAF7] border border-[#E4E0D6] rounded-[8px] p-3 flex flex-col space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-[6px] h-[6px] rounded-full bg-[#30A46C] shrink-0" />
              <div className="flex flex-col">
                <span className="text-[13px] text-[#1A1A17]">Data Structures, Algorithms</span>
                <span className="text-[11px] text-[#6B675C] uppercase tracking-[0.04em]">Strong</span>
              </div>
            </div>
            <div className="w-full h-[1px] bg-[#E4E0D6]" />
            <div className="flex items-center space-x-3">
              <div className="w-[6px] h-[6px] rounded-full bg-[#F5A524] shrink-0" />
              <div className="flex flex-col">
                <span className="text-[13px] text-[#1A1A17]">Database Management, Aptitude</span>
                <span className="text-[11px] text-[#6B675C] uppercase tracking-[0.04em]">Steady</span>
              </div>
            </div>
            <div className="w-full h-[1px] bg-[#E4E0D6]" />
            <div className="flex items-center space-x-3">
              <div className="w-[6px] h-[6px] rounded-full bg-[#E5484D] shrink-0" />
              <div className="flex flex-col">
                <span className="text-[13px] text-[#1A1A17]">Operating Systems, Mock Interviews</span>
                <span className="text-[11px] text-[#6B675C] uppercase tracking-[0.04em]">Needs attention</span>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="flex flex-col space-y-3">
          <h2 className="text-[11px] uppercase tracking-[0.04em] text-[#6B675C]">Achievements</h2>
          {currentStudent.achievements.length > 0 ? (
            <div className="flex flex-col space-y-4">
              {currentStudent.achievements.map((ach, i) => (
                <div key={i} className="flex flex-col pl-3 border-l-2 border-[#F5A524]">
                  <span className="text-[11px] uppercase tracking-[0.04em] text-[#6B675C] mb-1">
                    {new Date(ach.date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                  </span>
                  <span className="text-[15px] text-[#1A1A17] mb-1">{ach.title}</span>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-[4px] border border-[#E4E0D6] bg-[#FBFAF7] text-[11px] text-[#6B675C] capitalize">
                      {ach.type.replace('_', ' ')}
                    </span>
                    {ach.verified && (
                      <span className="flex items-center text-[11px] text-[#8B8B96]">
                        <Check size={12} className="mr-1" />
                        Verified {ach.verifier_name && `by ${ach.verifier_name}`}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-[13px] text-[#6B675C]">No achievements yet. Add your first one.</span>
          )}
        </div>

        {/* Exam Recommendations */}
        <div className="flex flex-col space-y-3">
          <h2 className="text-[11px] uppercase tracking-[0.04em] text-[#6B675C]">Exam recommendations</h2>
          <div className="flex flex-col space-y-4">
            {exams.map(exam => (
              <div key={exam.id} className="bg-[#FBFAF7] border border-[#E4E0D6] rounded-[8px] p-4 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[15px] font-medium text-[#1A1A17]">{exam.name}</span>
                  <span className="text-[13px] text-[#30A46C]"><span className="font-mono">{exam.match}%</span> match</span>
                </div>
                
                <ul className="mb-4 space-y-1">
                  {exam.reasons.map((r, i) => (
                    <li key={i} className="text-[13px] text-[#6B675C] flex items-start">
                      <span className="text-[#E4E0D6] mr-2">•</span>{r}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-[0.04em] text-[#6B675C]">Prep time</span>
                    <span className="text-[13px] text-[#1A1A17]">{exam.time}</span>
                  </div>
                  <button 
                    onClick={() => setExpandedExam(expandedExam === exam.id ? null : exam.id)}
                    className="border border-[#E4E0D6] rounded-[6px] px-3 py-1.5 text-[13px] text-[#1A1A17] hover:bg-[#F6F4EF] transition-colors"
                  >
                    Ask about this
                  </button>
                </div>

                {/* Inline answer card */}
                {expandedExam === exam.id && (
                  <div className="mt-4 pt-4 border-t border-[#E4E0D6] flex flex-col space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-col space-y-1">
                      <span className="text-[13px] font-medium text-[#1A1A17]">Why it fits</span>
                      <span className="text-[13px] text-[#6B675C] leading-relaxed">
                        Your strong academic record in core subjects and high coding scores align well with the technical rigor of this exam.
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-[13px] font-medium text-[#1A1A17]">Watch-outs</span>
                      <span className="text-[13px] text-[#6B675C] leading-relaxed">
                        You'll need to dedicate more time to OS concepts, which currently show up as a gap.
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-[13px] font-medium text-[#1A1A17]">Next 30 days</span>
                      <span className="text-[13px] text-[#6B675C] leading-relaxed">
                        {exam.step} to set a baseline. Don't worry about the score, just get familiar with the format.
                      </span>
                    </div>
                    <span className="text-[11px] text-[#8B8B96] pt-2">
                      Generated from your academic data
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
