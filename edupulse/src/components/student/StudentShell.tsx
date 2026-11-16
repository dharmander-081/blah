import React, { useState } from 'react';
import { Home, HeartPulse, Map, Users, Route } from 'lucide-react';
import HomeTab from './HomeTab';
import PulseTab from './PulseTab';
import CampusTab from './CampusTab';
import ConnectTab from './ConnectTab';
import PathTab from './PathTab';

const TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'pulse', label: 'Pulse', icon: HeartPulse },
  { id: 'campus', label: 'Campus', icon: Map },
  { id: 'connect', label: 'Connect', icon: Users },
  { id: 'path', label: 'Path', icon: Route },
];

export default function StudentShell() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="w-full h-screen bg-[#F6F4EF] flex justify-center text-[#1A1A17] font-sans selection:bg-[#F5A524] selection:bg-opacity-30">
      <div className="w-full max-w-[390px] h-full flex flex-col bg-[#F6F4EF] sm:border-x sm:border-[#E4E0D6] relative shadow-sm">
        <main className="flex-1 overflow-y-auto pb-[52px]">
          {activeTab === 'home' && <HomeTab />}
          {activeTab === 'pulse' && <PulseTab />}
          {activeTab === 'campus' && <CampusTab />}
          {activeTab === 'connect' && <ConnectTab />}
          {activeTab === 'path' && <PathTab />}
        </main>

        <nav className="absolute bottom-0 left-0 right-0 h-[52px] bg-[#FBFAF7] border-t border-[#E4E0D6] flex items-center justify-around z-10 pb-safe">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center w-full h-full relative transition-colors duration-150 ${
                  isActive ? 'text-[#F5A524]' : 'text-[#6B675C] hover:text-[#1A1A17]'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#F5A524]" />
                )}
                <Icon size={16} strokeWidth={1.5} className="mb-1" />
                <span className="text-[11px] font-medium tracking-tight">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
