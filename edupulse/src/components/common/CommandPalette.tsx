import React, { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { Search } from 'lucide-react';
import { useAppStore } from '@/data/store';
import { Student } from '@/data/types';

interface CommandPaletteProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, setIsOpen }) => {
  const { students, setRole, setCurrentStudentId } = useAppStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open: boolean) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setIsOpen]);

  if (!isOpen) return null;

  const filteredStudents = students
    .filter((s: Student) => s.full_name.toLowerCase().includes(search.toLowerCase()) || s.student_id.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 8);

  const handleSelectStudent = (id: string) => {
    setCurrentStudentId(id);
    setIsOpen(false);
  };

  const navigateTo = (view: string) => {
    window.dispatchEvent(new CustomEvent('navigate-view', { detail: view }));
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh] bg-[#00000080] backdrop-blur-[2px]">
      <Command 
        className="w-[560px] max-w-[90vw] bg-[var(--surface)] border border-[var(--border)] rounded-[8px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-[13px] text-[var(--text)] font-sans"
        shouldFilter={false}
      >
        <div className="flex items-center px-3 h-12 border-b border-[var(--border)]">
          <Search size={16} strokeWidth={1.5} className="text-[var(--text-muted)] shrink-0" />
          <Command.Input 
            autoFocus
            placeholder="Search students, navigation, or actions..." 
            value={search}
            onValueChange={setSearch}
            className="flex-1 bg-transparent border-none outline-none px-3 text-[13px] text-[var(--text)] placeholder:text-[var(--text-faint)]"
          />
          <div className="text-[10px] font-mono text-[var(--text-faint)] bg-[var(--bg)] border border-[var(--border)] px-1.5 py-0.5 rounded-[4px]">
            ESC
          </div>
        </div>

        <Command.List className="max-h-[360px] overflow-y-auto p-2 scrollbar-none">
          <Command.Empty className="p-4 text-center text-[var(--text-muted)] text-[13px]">
            No results found.
          </Command.Empty>

          {filteredStudents.length > 0 && (
            <Command.Group heading={<div className="px-2 py-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-[var(--text-muted)]">Students</div>}>
              {filteredStudents.map((s: Student) => (
                <Command.Item 
                  key={s.student_id} 
                  value={s.student_id}
                  onSelect={() => handleSelectStudent(s.student_id)}
                  className="flex items-center px-2 py-2 rounded-[4px] cursor-pointer aria-selected:bg-[var(--surface-2)] group"
                >
                  <div className="w-6 h-6 flex items-center justify-center bg-[var(--bg)] border border-[var(--border-strong)] rounded-full text-[10px] font-bold text-[var(--text)] mr-3">
                    {s.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-medium text-[var(--text)]">{s.full_name}</div>
                  </div>
                  <div className="text-[11px] font-mono tabular-nums text-[var(--text-muted)] mr-3">{s.student_id}</div>
                  <div className="text-[11px] text-[var(--text-muted)] uppercase">{s.department}</div>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          <Command.Group heading={<div className="px-2 py-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-[var(--text-muted)] mt-2">Navigation</div>}>
            {[
              { id: 'cockpit', label: 'Go to Cockpit', shortcut: 'G C' },
              { id: 'alert', label: 'Go to Early Alert', shortcut: 'G E' },
              { id: 'placement', label: 'Go to Placement', shortcut: 'G P' },
              { id: 'students', label: 'Go to Students', shortcut: 'G S' },
            ].map((item) => (
              <Command.Item 
                key={item.id}
                onSelect={() => navigateTo(item.id)}
                className="flex items-center justify-between px-2 py-2 rounded-[4px] cursor-pointer aria-selected:bg-[var(--surface-2)]"
              >
                <span>{item.label}</span>
                <span className="text-[10px] font-mono text-[var(--text-faint)] tracking-[0.04em]">{item.shortcut}</span>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading={<div className="px-2 py-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-[var(--text-muted)] mt-2">Actions</div>}>
            <Command.Item onSelect={() => { setRole('dean'); setIsOpen(false); }} className="flex items-center px-2 py-2 rounded-[4px] cursor-pointer aria-selected:bg-[var(--surface-2)]">
              Switch to Dean view
            </Command.Item>
            <Command.Item onSelect={() => { setRole('mentor'); setIsOpen(false); }} className="flex items-center px-2 py-2 rounded-[4px] cursor-pointer aria-selected:bg-[var(--surface-2)]">
              Switch to Mentor view
            </Command.Item>
            <Command.Item onSelect={() => { setRole('student'); setCurrentStudentId('STU0042'); setIsOpen(false); }} className="flex items-center px-2 py-2 rounded-[4px] cursor-pointer aria-selected:bg-[var(--surface-2)]">
              Switch to Student view
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
};
