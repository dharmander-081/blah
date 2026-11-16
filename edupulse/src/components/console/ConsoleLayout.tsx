import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Cockpit } from './Cockpit';
import { EarlyAlert } from './EarlyAlert';
import { PlacementEngine } from './PlacementEngine';

interface ConsoleLayoutProps {
  onOpenCommandPalette: () => void;
}

export const ConsoleLayout: React.FC<ConsoleLayoutProps> = ({ onOpenCommandPalette }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('cockpit');

  useEffect(() => {
    const handleNav = (e: Event) => {
      const customEvent = e as CustomEvent;
      setActiveView(customEvent.detail);
    };
    window.addEventListener('navigate-view', handleNav);
    return () => window.removeEventListener('navigate-view', handleNav);
  }, []);

  useEffect(() => {
    let lastKey = '';
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key.toLowerCase();
      
      if (lastKey === 'g') {
        if (key === 'c') setActiveView('cockpit');
        if (key === 'e') setActiveView('alert');
        if (key === 'p') setActiveView('placement');
        if (key === 's') setActiveView('students');
        lastKey = '';
      } else {
        if (key === 'g') {
          lastKey = 'g';
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => { lastKey = ''; }, 1000);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeoutId);
    };
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'cockpit':
        return <Cockpit />;
      case 'alert':
        return <EarlyAlert />;
      case 'placement':
        return <PlacementEngine />;
      case 'students':
        return <EarlyAlert />;
      default:
        return <Cockpit />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[var(--bg)] overflow-hidden text-[13px] font-sans">
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        activeView={activeView} 
        setActiveView={setActiveView} 
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar onSearchClick={onOpenCommandPalette} />
        <main className="flex-1 overflow-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};
