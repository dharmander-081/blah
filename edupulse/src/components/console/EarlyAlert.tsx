import React, { useState, useMemo, useEffect } from 'react';
import { useAppStore } from '@/data/store';
import { EnrichedStudent } from '@/data/types';
import { Bell, Mail, Users, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

type SortOption = 'risk' | 'attendance' | 'backlogs';

export function EarlyAlert() {
  const { students, openDrawer } = useAppStore();
  const [filters, setFilters] = useState({
    Critical: true,
    Moderate: true,
    Safe: false,
  });
  const [sortOption, setSortOption] = useState<SortOption>('risk');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedForBulk, setSelectedForBulk] = useState<Set<string>>(new Set());

  // Email Dialog State
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [emailDraft, setEmailDraft] = useState('');

  // Peer Tutor Dialog State
  const [isTutorDialogOpen, setIsTutorDialogOpen] = useState(false);

  // Filter & Sort
  const filteredList = useMemo(() => {
    return students.filter((s) => {
      if (s.risk.band === 'critical' && filters.Critical) return true;
      if (s.risk.band === 'moderate' && filters.Moderate) return true;
      if (s.risk.band === 'safe' && filters.Safe) return true;
      return false;
    }).sort((a, b) => {
      if (sortOption === 'risk') return b.risk.total - a.risk.total;
      if (sortOption === 'attendance') return a.attendance.overall_attendance_pct - b.attendance.overall_attendance_pct;
      if (sortOption === 'backlogs') return b.academics.backlogs - a.academics.backlogs;
      return 0;
    });
  }, [students, filters, sortOption]);

  const selectedStudent = useMemo(() => {
    return students.find(s => s.student_id === selectedStudentId) || null;
  }, [students, selectedStudentId]);

  // Derived state for stats
  const stats = useMemo(() => {
    const counts = { Critical: 0, Moderate: 0, Safe: 0 };
    students.forEach(s => {
      if (s.risk.band === 'critical') counts.Critical++;
      else if (s.risk.band === 'moderate') counts.Moderate++;
      else if (s.risk.band === 'safe') counts.Safe++;
    });
    return counts;
  }, [students]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if active element is input/textarea
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      if (e.key === 'j' || e.key === 'k') {
        e.preventDefault();
        const currentIndex = filteredList.findIndex(s => s.student_id === selectedStudentId);
        if (e.key === 'j') {
          const nextIndex = currentIndex < filteredList.length - 1 ? currentIndex + 1 : currentIndex;
          setSelectedStudentId(filteredList[nextIndex]?.student_id || null);
        } else if (e.key === 'k') {
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
          setSelectedStudentId(filteredList[prevIndex]?.student_id || null);
        }
      } else if (e.key === 'Enter' && selectedStudentId) {
        openDrawer(selectedStudentId);
      } else if (e.key === 'n' && selectedStudentId) {
        handleNotifyMentor(selectedStudentId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredList, selectedStudentId, openDrawer]);

  const toggleFilter = (band: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [band]: !prev[band] }));
  };

  const toggleBulkSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(selectedForBulk);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedForBulk(newSet);
  };

  const handleNotifyMentor = (id: string) => {
    toast(`Mentor notified for ${id}`, {
      action: {
        label: 'Undo',
        onClick: () => console.log('Undo notify')
      }
    });
  };

  // Extract top 2 reasons
  const getReasons = (student: EnrichedStudent) => {
    const reasons = [];
    if (student.attendance.overall_attendance_pct < 75) reasons.push(`Attendance ${student.attendance.overall_attendance_pct.toFixed(0)}%`);
    if (student.academics.backlogs > 0) reasons.push(`${student.academics.backlogs} backlogs`);
    if (reasons.length === 0) reasons.push('Low engagement');
    return reasons.join(' -- ');
  };

  const bandColors = {
    Critical: 'bg-[#E5484D]',
    Moderate: 'bg-[#F5A524]',
    Safe: 'bg-[#30A46C]'
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex h-full bg-[var(--bg)] text-[var(--text)]">
      {/* Left Column */}
      <div className="w-[55%] border-r border-[var(--border)] flex flex-col relative h-full">
        {/* Header Area */}
        <div className="p-4 border-b border-[var(--border)] shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-medium">{filteredList.length} students need attention</h2>
            <select 
              className="bg-transparent border border-[var(--border)] text-xs py-1 px-2 rounded focus:outline-none focus:border-[#F5A524] appearance-none pr-8 relative"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
            >
              <option value="risk">Risk score (high first)</option>
              <option value="attendance">Attendance (low first)</option>
              <option value="backlogs">Backlogs (most first)</option>
            </select>
          </div>
          
          <div className="flex space-x-2">
            {(['Critical', 'Moderate', 'Safe'] as const).map(band => (
              <button
                key={band}
                onClick={() => toggleFilter(band)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 text-xs border rounded transition-colors ${
                  filters[band] ? 'border-[#F5A524] bg-white/5' : 'border-[var(--border)] text-[var(--text-muted)]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${bandColors[band]}`} />
                <span>{band}</span>
                <span className="font-mono text-[10px] ml-1 opacity-70">{stats[band]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* List Area */}
        <div className="flex-1 overflow-y-auto">
          {filteredList.map(student => (
            <div
              key={student.student_id}
              onClick={() => setSelectedStudentId(student.student_id)}
              className={`flex items-start p-3 border-b border-[var(--border)] cursor-pointer transition-colors duration-120 hover:bg-[var(--surface-2)] group ${
                selectedStudentId === student.student_id ? 'border-l-2 border-l-[#F5A524] bg-[var(--surface-2)] pl-[11px]' : 'pl-3'
              }`}
            >
              <div className="pt-1 pr-3" onClick={e => e.stopPropagation()}>
                <input 
                  type="checkbox" 
                  checked={selectedForBulk.has(student.student_id)}
                  onChange={(e) => toggleBulkSelect(student.student_id, e as any)}
                  className="accent-[#F5A524] w-3 h-3 cursor-pointer rounded-sm bg-transparent border-[var(--border)]"
                />
              </div>
              <div className="pt-1.5 pr-2">
                <div className={`w-1.5 h-1.5 rounded-full ${bandColors[student.risk.band === 'critical' ? 'Critical' : student.risk.band === 'moderate' ? 'Moderate' : 'Safe']}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className="text-[13px] font-medium truncate pr-2">{student.full_name}</span>
                  <span className="font-mono text-xs text-[var(--text-muted)] shrink-0">{student.student_id}</span>
                </div>
                <div className="text-[11px] text-[var(--text-faint)] mt-0.5 uppercase tracking-wide">
                  {student.department} -- Sem {student.semester}
                </div>
                <div className="text-[12px] text-[var(--text-muted)] mt-1.5 truncate">
                  {getReasons(student)}
                </div>
              </div>
              <div className="ml-3 shrink-0 pt-1">
                <span className={`font-mono text-[13px] ${student.risk.band === 'critical' ? 'font-bold text-[#E5484D]' : ''}`}>
                  {student.risk.total}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk Action Bar */}
        {selectedForBulk.size > 0 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[var(--surface)] border border-[var(--border-strong)] px-4 py-2.5 rounded-lg flex items-center space-x-4 shadow-xl z-10">
            <span className="text-[13px] font-medium whitespace-nowrap">
              {selectedForBulk.size} selected
            </span>
            <div className="w-px h-4 bg-[var(--border-strong)]" />
            <button 
              className="text-xs hover:text-[#F5A524] transition-colors whitespace-nowrap"
              onClick={() => {
                toast(`Mentors notified for ${selectedForBulk.size} students`);
                setSelectedForBulk(new Set());
              }}
            >
              Notify mentors
            </button>
            <button className="text-xs hover:text-[#F5A524] transition-colors whitespace-nowrap">
              Draft bulk warning
            </button>
          </div>
        )}
      </div>

      {/* Right Column */}
      <div className="w-[45%] bg-[var(--surface)] p-6 h-full flex flex-col">
        {!selectedStudent ? (
          <div className="flex items-center justify-center h-full text-[13px] text-[var(--text-faint)]">
            Select a student from the list
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] font-medium text-lg mr-4">
                {getInitials(selectedStudent.full_name)}
              </div>
              <div>
                <h1 className="text-base font-medium">{selectedStudent.full_name}</h1>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="font-mono text-[12px] text-[var(--text-muted)]">{selectedStudent.student_id}</span>
                  <span className="text-[12px] text-[var(--text-faint)]">{selectedStudent.department} · Sem {selectedStudent.semester}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="border border-[var(--border)] p-3 rounded-lg bg-[var(--bg)]">
                <div className="text-[11px] text-[var(--text-faint)] uppercase tracking-wide mb-1">Risk Score</div>
                <div className="flex items-end justify-between">
                  <div className={`font-mono text-xl ${selectedStudent.risk.band === 'critical' ? 'text-[#E5484D]' : selectedStudent.risk.band === 'moderate' ? 'text-[#F5A524]' : 'text-[#30A46C]'}`}>
                    {selectedStudent.risk.total}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] mb-1 uppercase">{selectedStudent.risk.band}</div>
                </div>
                {/* Mini stacked bar placeholder */}
                <div className="w-full h-1.5 flex mt-2 rounded overflow-hidden">
                  <div className="h-full bg-[#E5484D]" style={{ width: '40%' }} />
                  <div className="h-full bg-[#F5A524]" style={{ width: '30%' }} />
                  <div className="h-full bg-[var(--border)]" style={{ width: '30%' }} />
                </div>
              </div>

              <div className="border border-[var(--border)] p-3 rounded-lg bg-[var(--bg)]">
                <div className="text-[11px] text-[var(--text-faint)] uppercase tracking-wide mb-1">Attendance</div>
                <div className="font-mono text-xl">{selectedStudent.attendance.percentage.toFixed(1)}%</div>
              </div>
              
              <div className="border border-[var(--border)] p-3 rounded-lg bg-[var(--bg)]">
                <div className="text-[11px] text-[var(--text-faint)] uppercase tracking-wide mb-1">CGPA</div>
                <div className="font-mono text-xl">{selectedStudent.academics.cgpa.toFixed(2)}</div>
              </div>
              
              <div className="border border-[var(--border)] p-3 rounded-lg bg-[var(--bg)]">
                <div className="text-[11px] text-[var(--text-faint)] uppercase tracking-wide mb-1">Backlogs</div>
                <div className="font-mono text-xl">{selectedStudent.academics.backlogs}</div>
              </div>
            </div>

            <div className="text-[12px] text-[var(--text-muted)] border-l-2 border-[var(--border)] pl-3 mb-8 py-0.5">
              No recent meetings
            </div>

            <div className="flex flex-col space-y-3 mt-auto">
              <button 
                onClick={() => handleNotifyMentor(selectedStudent.student_id)}
                className="flex items-center justify-center space-x-2 py-2 border border-[var(--border)] rounded text-[13px] hover:border-[#F5A524] transition-colors bg-[var(--bg)]"
              >
                <Bell size={14} className="text-[var(--text-muted)]" />
                <span>Notify mentor</span>
              </button>
              
              <button 
                onClick={() => {
                  setEmailDraft(`Dear ${selectedStudent.full_name},\n\nThis is an automated notice regarding your recent academic performance and attendance. Please meet your mentor at the earliest.\n\nRegards,\nAdmin`);
                  setIsEmailDialogOpen(true);
                }}
                className="flex items-center justify-center space-x-2 py-2 border border-[var(--border)] rounded text-[13px] hover:border-[#F5A524] transition-colors bg-[var(--bg)]"
              >
                <Mail size={14} className="text-[var(--text-muted)]" />
                <span>Draft warning email</span>
              </button>
              
              <button 
                onClick={() => setIsTutorDialogOpen(true)}
                className="flex items-center justify-center space-x-2 py-2 border border-[var(--border)] rounded text-[13px] hover:border-[#F5A524] transition-colors bg-[var(--bg)]"
              >
                <Users size={14} className="text-[var(--text-muted)]" />
                <span>Assign peer tutor</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Simple Modals (Using absolute positioning instead of Radix for speed in this test, assuming straightforward implementation) */}
      {isEmailDialogOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg w-[400px] p-4">
            <h3 className="text-sm font-medium mb-3">Draft Warning Email</h3>
            <textarea 
              className="w-full h-32 bg-[var(--bg)] border border-[var(--border)] rounded p-2 text-[13px] font-sans resize-none focus:outline-none focus:border-[#F5A524] mb-3 text-[var(--text-muted)]"
              value={emailDraft}
              onChange={e => setEmailDraft(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsEmailDialogOpen(false)} className="px-3 py-1.5 text-xs border border-[var(--border)] rounded">Cancel</button>
              <button 
                onClick={() => {
                  toast('Email drafted and sent to outbox');
                  setIsEmailDialogOpen(false);
                }}
                className="px-3 py-1.5 text-xs border border-[#F5A524] text-[#F5A524] rounded hover:bg-[#F5A524]/10 transition-colors"
              >
                Save Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {isTutorDialogOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg w-[320px] p-4">
            <h3 className="text-sm font-medium mb-3">Assign Peer Tutor</h3>
            <div className="text-xs text-[var(--text-muted)] mb-3">Top students in {selectedStudent?.department}:</div>
            <div className="space-y-2 mb-4">
              {/* Dummy data for tutors */}
              {['Aisha Patel - 9.4 CGPA', 'Ravi Kumar - 9.2 CGPA', 'Sara Khan - 9.0 CGPA'].map((t, i) => (
                <div key={i} className="flex justify-between items-center p-2 border border-[var(--border)] rounded bg-[var(--bg)] hover:border-[#F5A524] cursor-pointer" onClick={() => {
                  toast(`Peer tutor assigned for ${selectedStudent?.id}`);
                  setIsTutorDialogOpen(false);
                }}>
                  <span className="text-[12px]">{t.split('-')[0]}</span>
                  <span className="font-mono text-[11px] text-[var(--text-muted)]">{t.split('-')[1]}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setIsTutorDialogOpen(false)} className="w-full px-3 py-1.5 text-xs border border-[var(--border)] rounded">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
