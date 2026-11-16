import React, { useState, useMemo } from 'react';
import { useAppStore } from '@/data/store';
import { EnrichedStudent } from '@/data/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChevronRight, X } from 'lucide-react';

const DEPARTMENTS = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil'];

export function PlacementEngine() {
  const { students, openDrawer } = useAppStore();
  
  // Criteria State
  const [company, setCompany] = useState('');
  const [minCgpa, setMinCgpa] = useState(6.0);
  const [maxBacklogs, setMaxBacklogs] = useState(2);
  const [minCoding, setMinCoding] = useState(50);
  const [minAptitude, setMinAptitude] = useState(40);
  const [selectedDepts, setSelectedDepts] = useState<Set<string>>(new Set(DEPARTMENTS));
  
  const [shortlist, setShortlist] = useState<Set<string>>(new Set());
  const [isShortlistExpanded, setIsShortlistExpanded] = useState(false);

  const resetCriteria = () => {
    setCompany('');
    setMinCgpa(6.0);
    setMaxBacklogs(2);
    setMinCoding(50);
    setMinAptitude(40);
    setSelectedDepts(new Set(DEPARTMENTS));
  };

  const toggleDept = (dept: string) => {
    const newSet = new Set(selectedDepts);
    if (newSet.has(dept)) newSet.delete(dept);
    else newSet.add(dept);
    setSelectedDepts(newSet);
  };

  const toggleShortlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(shortlist);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setShortlist(newSet);
  };

  // Derived filtered students
  const eligibleStudents = useMemo(() => {
    return students.filter(s => {
      const cgpa = s.academics?.cgpa ?? 0;
      const backlogs = s.academics?.backlogs ?? 0;
      const coding = s.placement?.coding_score ?? 0;
      const aptitude = s.placement?.aptitude_score ?? 0;
      
      if (cgpa < minCgpa) return false;
      if (backlogs > maxBacklogs) return false;
      if (coding < minCoding) return false;
      if (aptitude < minAptitude) return false;
      if (!selectedDepts.has(s.department)) return false;
      
      return true;
    }).sort((a, b) => (b.employability?.total ?? 0) - (a.employability?.total ?? 0));
  }, [students, minCgpa, maxBacklogs, minCoding, minAptitude, selectedDepts]);

  // Histogram data preparation
  const histogramData = useMemo(() => {
    const bins = Array.from({ length: 20 }, (_, i) => ({
      range: `${i * 5}-${(i + 1) * 5}`,
      count: 0,
      eligibleCount: 0,
      min: i * 5,
      max: (i + 1) * 5
    }));

    students.forEach(s => {
      const index = s.employability?.total ?? 0;
      const binIdx = Math.min(Math.floor(index / 5), 19);
      bins[binIdx].count++;
      
      // Check if eligible
      const cgpa = s.academics?.cgpa ?? 0;
      const backlogs = s.academics?.backlogs ?? 0;
      const coding = s.placement?.coding_score ?? 0;
      const aptitude = s.placement?.aptitude_score ?? 0;
      const isEligible = cgpa >= minCgpa && backlogs <= maxBacklogs && coding >= minCoding && aptitude >= minAptitude && selectedDepts.has(s.department);
      
      if (isEligible) {
        bins[binIdx].eligibleCount++;
      }
    });

    return bins;
  }, [students, minCgpa, maxBacklogs, minCoding, minAptitude, selectedDepts]);

  // Small custom components
  const SliderControl = ({ label, value, min, max, step, onChange }: { label: string, value: number, min: number, max: number, step: number, onChange: (v: number) => void }) => (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <label className="text-[12px] text-[var(--text-muted)]">{label}</label>
        <input 
          type="number" 
          value={value} 
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-14 text-right bg-transparent border border-[var(--border)] rounded px-1.5 py-0.5 text-[12px] font-mono focus:outline-none focus:border-[#F5A524]"
          min={min} max={max} step={step}
        />
      </div>
      <input 
        type="range" 
        min={min} max={max} step={step} 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-[var(--border)] rounded-full appearance-none accent-[#F5A524] cursor-pointer"
        style={{
          background: `linear-gradient(to right, #F5A524 ${((value - min) / (max - min)) * 100}%, var(--border) ${((value - min) / (max - min)) * 100}%)`
        }}
      />
    </div>
  );

  return (
    <div className="flex h-full bg-[var(--bg)] text-[var(--text)] overflow-hidden">
      {/* Left Rail: Criteria Builder */}
      <div className="w-[300px] border-r border-[var(--border)] flex flex-col shrink-0 h-full overflow-y-auto">
        <div className="p-4 border-b border-[var(--border)]">
          <div className="text-[11px] uppercase tracking-wide text-[var(--text-faint)] mb-4">DRIVE CRITERIA</div>
          
          <div className="mb-6">
            <label className="text-[12px] text-[var(--text-muted)] block mb-1.5">Company Name</label>
            <input 
              type="text" 
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Acme Corp"
              className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded px-2.5 py-1.5 text-[13px] focus:outline-none focus:border-[#F5A524]"
            />
          </div>

          <SliderControl label="Min CGPA" value={minCgpa} min={4.0} max={10.0} step={0.1} onChange={setMinCgpa} />
          <SliderControl label="Max Backlogs" value={maxBacklogs} min={0} max={5} step={1} onChange={setMaxBacklogs} />
          <SliderControl label="Min Coding Score" value={minCoding} min={0} max={100} step={5} onChange={setMinCoding} />
          <SliderControl label="Min Aptitude Score" value={minAptitude} min={0} max={100} step={5} onChange={setMinAptitude} />

          <div className="mt-6">
            <label className="text-[12px] text-[var(--text-muted)] block mb-2.5">Departments</label>
            <div className="space-y-2">
              {DEPARTMENTS.map(dept => (
                <label key={dept} className="flex items-center space-x-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={selectedDepts.has(dept)}
                    onChange={() => toggleDept(dept)}
                    className="accent-[#F5A524] w-3.5 h-3.5 cursor-pointer bg-transparent border-[var(--border)]"
                  />
                  <span className="text-[12.5px] group-hover:text-white transition-colors">{dept}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-4 mt-auto">
          <button 
            onClick={resetCriteria}
            className="text-[12px] text-[var(--text-muted)] hover:text-white transition-colors underline decoration-dotted underline-offset-4"
          >
            Reset criteria
          </button>
        </div>
      </div>

      {/* Right Area: Live Results */}
      <div className="flex-1 flex flex-col relative h-full overflow-hidden">
        {/* Header & Chart */}
        <div className="p-6 border-b border-[var(--border)] bg-[var(--surface)] shrink-0">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-3xl font-light tracking-tight">
                <span className="font-mono font-medium">{eligibleStudents.length}</span> <span className="text-[var(--text-muted)] text-xl">of {students.length} eligible</span>
              </h2>
            </div>
          </div>

          <div className="h-[120px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={histogramData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: 'var(--text-faint)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-faint)' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '11px' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="count" fill="var(--border-strong)" radius={[2, 2, 0, 0]}>
                  {histogramData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.eligibleCount > 0 ? (entry.eligibleCount === entry.count ? '#F5A524' : '#F5A52480') : 'var(--border-strong)'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-[var(--text-faint)] uppercase text-center mt-2 tracking-wide">Employability Index Distribution</div>
        </div>

        {/* Results Table */}
        <div className="flex-1 overflow-auto bg-[var(--bg)] relative">
          <table className="w-full text-[12.5px] text-left border-collapse">
            <thead className="sticky top-0 bg-[var(--surface-2)] z-10 border-b border-[var(--border)]">
              <tr>
                <th className="py-2.5 px-4 font-normal text-[var(--text-muted)] w-12 text-center">#</th>
                <th className="py-2.5 px-4 font-normal text-[var(--text-muted)]">Name</th>
                <th className="py-2.5 px-4 font-normal text-[var(--text-muted)]">ID</th>
                <th className="py-2.5 px-4 font-normal text-[var(--text-muted)]">Department</th>
                <th className="py-2.5 px-4 font-normal text-[var(--text-muted)] text-right">CGPA</th>
                <th className="py-2.5 px-4 font-normal text-[var(--text-muted)] text-right">Coding</th>
                <th className="py-2.5 px-4 font-normal text-[var(--text-muted)] text-right">Aptitude</th>
                <th className="py-2.5 px-4 font-normal text-[var(--text-muted)] text-right">Interview</th>
                <th className="py-2.5 px-4 font-normal text-[#F5A524] text-right">Index</th>
                <th className="py-2.5 px-4 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {eligibleStudents.slice(0, 50).map((student, idx) => (
                <tr 
                  key={student.student_id}
                  onClick={() => openDrawer(student.student_id)}
                  className={`border-b border-[var(--border)] cursor-pointer group transition-colors hover:bg-[var(--surface-2)] ${idx % 2 === 0 ? 'bg-transparent' : 'bg-[var(--surface)]'}`}
                >
                  <td className="py-2.5 px-4 text-[var(--text-faint)] text-center font-mono">{idx + 1}</td>
                  <td className="py-2.5 px-4 font-medium">{student.full_name}</td>
                  <td className="py-2.5 px-4 font-mono text-[var(--text-muted)]">{student.student_id}</td>
                  <td className="py-2.5 px-4 text-[var(--text-muted)]">{student.department}</td>
                  <td className="py-2.5 px-4 font-mono text-right">{student.academics?.cgpa?.toFixed(2) ?? '-'}</td>
                  <td className="py-2.5 px-4 font-mono text-right">{student.placement?.coding_score ?? '-'}</td>
                  <td className="py-2.5 px-4 font-mono text-right">{student.placement?.aptitude_score ?? '-'}</td>
                  <td className="py-2.5 px-4 font-mono text-right">{student.placement?.mock_interview_rating ?? '-'}</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-right text-white">{student.employability?.total ?? '-'}</td>
                  <td className="py-2.5 px-4 text-right">
                    <button 
                      onClick={(e) => toggleShortlist(student.student_id, e)}
                      className={`text-[11px] px-2 py-0.5 rounded border transition-colors opacity-0 group-hover:opacity-100 ${
                        shortlist.has(student.student_id) 
                          ? 'border-[#F5A524] text-[#F5A524] bg-[#F5A524]/10' 
                          : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[#F5A524] hover:text-white'
                      }`}
                    >
                      {shortlist.has(student.student_id) ? 'Added' : 'Shortlist'}
                    </button>
                  </td>
                </tr>
              ))}
              {eligibleStudents.length > 50 && (
                <tr>
                  <td colSpan={10} className="py-6 text-center">
                    <button className="text-[12px] text-[var(--text-muted)] hover:text-white border border-[var(--border)] px-4 py-1.5 rounded transition-colors bg-[var(--surface-2)]">
                      Load more
                    </button>
                  </td>
                </tr>
              )}
              {eligibleStudents.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-[13px] text-[var(--text-faint)]">
                    No students match these criteria. Try adjusting the sliders.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Shortlist Floating Panel */}
        {shortlist.size > 0 && (
          <div className="absolute bottom-6 right-6 w-[280px] bg-[var(--surface)] border border-[var(--border-strong)] shadow-2xl rounded-lg overflow-hidden flex flex-col z-20">
            <div 
              className="p-3 border-b border-[var(--border-strong)] flex items-center justify-between cursor-pointer bg-[var(--surface-2)] hover:bg-[var(--surface-2)]/80 transition-colors"
              onClick={() => setIsShortlistExpanded(!isShortlistExpanded)}
            >
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded bg-[#F5A524]/20 text-[#F5A524] flex items-center justify-center font-mono text-[11px] font-bold">
                  {shortlist.size}
                </div>
                <span className="text-[13px] font-medium">Shortlisted</span>
              </div>
              <ChevronRight size={14} className={`text-[var(--text-muted)] transition-transform duration-200 ${isShortlistExpanded ? '-rotate-90' : ''}`} />
            </div>
            
            {isShortlistExpanded && (
              <>
                <div className="max-h-[200px] overflow-y-auto p-2 bg-[var(--bg)]">
                  {Array.from(shortlist).map(id => {
                    const student = students.find(s => s.student_id === id);
                    if (!student) return null;
                    return (
                      <div key={id} className="flex justify-between items-center px-2 py-1.5 hover:bg-[var(--surface-2)] rounded group text-[12px]">
                        <span className="truncate pr-2">{student.full_name}</span>
                        <div className="flex items-center space-x-2 shrink-0">
                          <span className="font-mono text-[11px] text-[var(--text-muted)]">{student.employability?.total}</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const newSet = new Set(shortlist);
                              newSet.delete(id);
                              setShortlist(newSet);
                            }}
                            className="text-[var(--text-faint)] hover:text-[#E5484D] opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-2 border-t border-[var(--border-strong)] flex justify-between items-center bg-[var(--surface-2)]">
                  <button 
                    onClick={() => setShortlist(new Set())}
                    className="text-[11px] text-[var(--text-faint)] hover:text-white px-2 py-1"
                  >
                    Clear all
                  </button>
                  <button className="text-[11px] bg-[#F5A524] text-black font-medium px-3 py-1 rounded hover:bg-[#F5A524]/90 transition-colors">
                    Export CSV
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
