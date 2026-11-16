import React, { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { useAppStore } from '@/data/store';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[var(--surface)] border border-[var(--border-strong)] px-3 py-2 rounded-md shadow-lg text-xs pointer-events-none">
        <div className="font-medium text-[var(--text)]">{data.name}</div>
        <div className="font-mono text-[var(--text-muted)] mt-0.5 mb-1.5">{data.id}</div>
        <div className="flex justify-between gap-4 text-[var(--text-muted)]">
          <span>CGPA</span>
          <span className="font-mono text-[var(--text)]">{data.cgpa.toFixed(2)}</span>
        </div>
        <div className="flex justify-between gap-4 text-[var(--text-muted)]">
          <span>Attendance</span>
          <span className="font-mono text-[var(--text)]">{data.attendance.toFixed(1)}%</span>
        </div>
      </div>
    );
  }
  return null;
};

export function CampusQuadrant() {
  const students = useAppStore(state => state.students);
  const filters = useAppStore(state => state.filters);
  const openDrawer = useAppStore(state => state.openDrawer);

  const data = useMemo(() => {
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

    return filtered.map(s => {
      const loginFreq = Math.min(s.lms.login_frequency_weekly, 25);
      const engagement = 0.6 * s.attendance.overall_attendance_pct + 0.4 * ((loginFreq / 25) * 100);
      
      return {
        id: s.student_id,
        name: s.full_name,
        engagement,
        cgpa: s.academics.cgpa,
        attendance: s.attendance.overall_attendance_pct,
        riskBand: s.risk.band
      };
    });
  }, [students]);

  const { medianX, medianY } = useMemo(() => {
    if (data.length === 0) return { medianX: 50, medianY: 7 };
    
    const sortedX = [...data].sort((a, b) => a.engagement - b.engagement);
    const sortedY = [...data].sort((a, b) => a.cgpa - b.cgpa);
    
    const mid = Math.floor(data.length / 2);
    return {
      medianX: data.length % 2 !== 0 ? sortedX[mid].engagement : (sortedX[mid - 1].engagement + sortedX[mid].engagement) / 2,
      medianY: data.length % 2 !== 0 ? sortedY[mid].cgpa : (sortedY[mid - 1].cgpa + sortedY[mid].cgpa) / 2,
    };
  }, [data]);

  // Counts for quadrants
  const counts = useMemo(() => {
    let tr = 0, tl = 0, br = 0, bl = 0;
    data.forEach(d => {
      if (d.engagement >= medianX && d.cgpa >= medianY) tr++;
      else if (d.engagement < medianX && d.cgpa >= medianY) tl++;
      else if (d.engagement >= medianX && d.cgpa < medianY) br++;
      else bl++;
    });
    return { tr, tl, br, bl };
  }, [data, medianX, medianY]);

  const getDotColor = (band: string) => {
    switch (band) {
      case 'critical': return '#E5484D';
      case 'moderate': return '#F5A524';
      case 'safe': return '#30A46C';
      default: return '#8B8B96';
    }
  };

  return (
    <div className="relative w-full h-[400px]">
      <div className="absolute top-4 left-16 text-[11px] text-[#F5A524] opacity-80 pointer-events-none z-10">
        Quietly burning out ({counts.tl})
      </div>
      <div className="absolute top-4 right-4 text-[11px] text-[var(--text-faint)] pointer-events-none z-10">
        Thriving ({counts.tr})
      </div>
      <div className="absolute bottom-10 left-16 text-[11px] text-[var(--text-faint)] pointer-events-none z-10">
        Drifting ({counts.bl})
      </div>
      <div className="absolute bottom-10 right-4 text-[11px] text-[var(--text-faint)] pointer-events-none z-10">
        Working hard, need support ({counts.br})
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} vertical={false} />
          <XAxis 
            type="number" 
            dataKey="engagement" 
            name="Engagement" 
            domain={['auto', 'auto']}
            tick={{ fontSize: 11, fill: 'var(--text-faint)' }}
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={{ stroke: 'var(--border)' }}
            label={{ value: 'Engagement', position: 'insideBottom', offset: -10, fontSize: 11, fill: 'var(--text-faint)' }}
          />
          <YAxis 
            type="number" 
            dataKey="cgpa" 
            name="Academic Performance" 
            domain={[4, 10]}
            tick={{ fontSize: 11, fill: 'var(--text-faint)' }}
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={{ stroke: 'var(--border)' }}
            label={{ value: 'Academic Performance', angle: -90, position: 'insideLeft', offset: 15, fontSize: 11, fill: 'var(--text-faint)' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'var(--border-strong)' }} />
          
          <ReferenceLine x={medianX} stroke="var(--border-strong)" strokeDasharray="3 3" />
          <ReferenceLine y={medianY} stroke="var(--border-strong)" strokeDasharray="3 3" />
          
          <Scatter 
            name="Students" 
            data={data} 
            onClick={(e: any) => { if (e && e.id) openDrawer(e.id); }}
            style={{ cursor: 'pointer' }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getDotColor(entry.riskBand)} fillOpacity={0.5} stroke="none" />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
