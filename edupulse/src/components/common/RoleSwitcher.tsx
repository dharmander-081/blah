import React from 'react';
import { useAppStore } from '@/data/store';

export const RoleSwitcher: React.FC = () => {
  const { role, setRole, setCurrentStudentId } = useAppStore();

  const handleRoleChange = (newRole: 'dean' | 'mentor' | 'student') => {
    setRole(newRole);
    if (newRole === 'student') {
      setCurrentStudentId('STU0042');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex items-center bg-[var(--surface)] border border-[var(--border-strong)] rounded-[6px] p-1 shadow-sm transition-all duration-150 ease-out text-[11px] uppercase tracking-[0.04em]">
      {(['dean', 'mentor', 'student'] as const).map((r) => (
        <button
          key={r}
          onClick={() => handleRoleChange(r)}
          className={`px-3 py-1.5 rounded-[4px] transition-colors duration-150 ease-out ${
            role === r
              ? 'bg-[var(--surface-2)] text-[var(--text)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg)]'
          }`}
        >
          {r}
        </button>
      ))}
    </div>
  );
};
