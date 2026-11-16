import React from 'react';
import { LayoutDashboard, AlertTriangle, Briefcase, Users, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/data/store';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
  activeView: string;
  setActiveView: (v: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed, activeView, setActiveView }) => {
  const { students } = useAppStore();
  const criticalCount = students.filter(s => s.status === 'critical').length;

  const navItems = [
    { id: 'cockpit', label: 'Cockpit', icon: LayoutDashboard, shortcut: 'G C' },
    { id: 'alert', label: 'Early Alert', icon: AlertTriangle, shortcut: 'G E', badge: criticalCount > 0 ? criticalCount : null },
    { id: 'placement', label: 'Placement', icon: Briefcase, shortcut: 'G P' },
    { id: 'students', label: 'Students', icon: Users, shortcut: 'G S' },
  ];

  return (
    <div 
      className={`flex flex-col h-full bg-[var(--bg)] border-r border-[var(--border)] transition-all duration-180 ease-out ${isCollapsed ? 'w-[52px]' : 'w-[220px]'}`}
    >
      <div className="h-[44px] flex items-center px-3 border-b border-[var(--border)]">
        <div className="w-6 h-6 flex items-center justify-center border border-[var(--border-strong)] rounded-[4px] text-[var(--text)] font-mono text-[11px] font-bold shrink-0">
          EP
        </div>
        {!isCollapsed && <span className="ml-3 text-[13px] font-medium text-[var(--text)] whitespace-nowrap">EduPulse</span>}
      </div>

      <div className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto">
        {navItems.map(item => {
          const isActive = activeView === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`group relative flex items-center h-8 px-2 rounded-[4px] transition-colors duration-120 ease-out w-full
                ${isActive ? 'bg-[var(--surface-2)] text-[var(--text)]' : 'text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]'}
              `}
              title={isCollapsed ? `${item.label} (${item.shortcut})` : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] bg-[#F5A524] rounded-r-[2px]" />
              )}
              <Icon size={14} strokeWidth={1.5} className="shrink-0" />
              
              {!isCollapsed && (
                <>
                  <span className="ml-3 text-[13px] whitespace-nowrap">{item.label}</span>
                  <div className="ml-auto flex items-center gap-2">
                    {item.badge !== null && item.badge !== undefined && (
                      <span className="text-[11px] font-mono tabular-nums text-[#E5484D]">{item.badge}</span>
                    )}
                    <span className="text-[10px] uppercase font-mono tracking-[0.04em] text-[var(--text-faint)] opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.shortcut}
                    </span>
                  </div>
                </>
              )}
            </button>
          );
        })}
      </div>

      <div className="px-2 mb-2">
         <button
            disabled
            className="flex items-center h-8 px-2 rounded-[4px] text-[var(--text-faint)] w-full opacity-50 cursor-not-allowed"
            title={isCollapsed ? "Settings" : undefined}
          >
            <Settings size={14} strokeWidth={1.5} className="shrink-0" />
            {!isCollapsed && <span className="ml-3 text-[13px] whitespace-nowrap">Settings</span>}
          </button>
      </div>

      <div className="p-2 border-t border-[var(--border)]">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-center h-8 w-full rounded-[4px] text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)] transition-colors duration-120 ease-out"
        >
          {isCollapsed ? <ChevronRight size={14} strokeWidth={1.5} /> : <ChevronLeft size={14} strokeWidth={1.5} />}
        </button>
      </div>
    </div>
  );
};
