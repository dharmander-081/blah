import { useEffect, useState } from 'react';
import { useAppStore } from '@/data/store';
import { generateMockData } from '@/data/mockGenerator';
import { ConsoleLayout } from '@/components/console/ConsoleLayout';
import StudentShell from '@/components/student/StudentShell';
import { StudentDrawer } from '@/components/common/StudentDrawer';
import { RoleSwitcher } from '@/components/common/RoleSwitcher';
import { CommandPalette } from '@/components/common/CommandPalette';
import { Toaster } from 'sonner';

function App() {
  const { role, setStudents } = useAppStore();
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const mockData = generateMockData();
    setStudents(mockData);
  }, [setStudents]);

  useEffect(() => {
    if (role === 'student') {
      document.documentElement.setAttribute('data-theme', 'student');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [role]);

  return (
    <>
      {role === 'student' ? (
        <StudentShell />
      ) : (
        <ConsoleLayout onOpenCommandPalette={() => setCmdOpen(true)} />
      )}
      
      <RoleSwitcher />
      <CommandPalette isOpen={cmdOpen} setIsOpen={setCmdOpen} />
      
      {role !== 'student' && <StudentDrawer />}
      
      <Toaster 
        theme={role === 'student' ? 'light' : 'dark'}
        toastOptions={{
          style: {
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            borderRadius: '6px',
            fontSize: '13px',
            fontFamily: 'var(--font-sans)',
          }
        }}
      />
    </>
  );
}

export default App;
