import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useAppStore } from '@/data/store';

interface TopBarProps {
  onSearchClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onSearchClick }) => {
  const { filters, setFilter } = useAppStore();

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter('department', e.target.value === 'all' ? null : e.target.value);
  };

  const handleSemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter('semester', e.target.value === 'all' ? null : parseInt(e.target.value, 10));
  };

  return (
    <div className="h-[44px] flex items-center justify-between px-4 bg-[var(--surface)] border-b border-[var(--border)] shrink-0">
      <div className="flex-1">
        <button 
          onClick={onSearchClick}
          className="flex items-center gap-2 h-7 px-2.5 rounded-[4px] bg-[var(--bg)] border border-[var(--border)] text-[12px] text-[var(--text-muted)] hover:bg-[var(--surface-2)] transition-colors duration-120 ease-out group"
        >
          <Search size={14} strokeWidth={1.5} />
          <span>Search students...</span>
          <span className="ml-4 px-1.5 py-0.5 rounded-[3px] bg-[var(--surface)] border border-[var(--border-strong)] text-[10px] font-mono group-hover:bg-[var(--bg)]">
            Ctrl K
          </span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <select 
          className="h-7 bg-transparent border border-[var(--border)] text-[12px] text-[var(--text)] outline-none focus:ring-1 focus:ring-[#F5A524] rounded-[4px] px-2 bg-[var(--surface)]"
          value={filters.department || 'all'}
          onChange={handleDeptChange}
        >
          <option value="all">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Electronics">Electronics</option>
          <option value="Mechanical">Mechanical</option>
          <option value="Civil">Civil</option>
        </select>

        <select 
          className="h-7 bg-transparent border border-[var(--border)] text-[12px] text-[var(--text)] outline-none focus:ring-1 focus:ring-[#F5A524] rounded-[4px] px-2 bg-[var(--surface)]"
          value={filters.semester ? String(filters.semester) : 'all'}
          onChange={handleSemChange}
        >
          <option value="all">All Semesters</option>
          <option value="1">Sem 1</option>
          <option value="2">Sem 2</option>
          <option value="3">Sem 3</option>
          <option value="4">Sem 4</option>
          <option value="5">Sem 5</option>
          <option value="6">Sem 6</option>
          <option value="7">Sem 7</option>
          <option value="8">Sem 8</option>
        </select>
      </div>

      <div className="flex-1 flex justify-end items-center gap-4">
        <button className="relative text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
          <Bell size={14} strokeWidth={1.5} />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 flex items-center justify-center bg-[#F5A524] text-[var(--bg)] text-[9px] font-mono font-bold rounded-full">
            3
          </span>
        </button>
        <div className="w-6 h-6 flex items-center justify-center bg-[var(--surface-2)] border border-[var(--border-strong)] rounded-full text-[10px] font-mono font-bold text-[var(--text)]">
          DR
        </div>
      </div>
    </div>
  );
};
