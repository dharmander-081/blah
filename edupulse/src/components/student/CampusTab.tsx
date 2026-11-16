import React, { useState } from 'react';
import { campusPlaces } from '@/data/campus';
import { CampusPlace } from '@/data/types';
import { X } from 'lucide-react';

const FILTERS = ['All', 'Study spots', 'Food', 'Events', 'Help'];

const getBusynessColor = (busyness: string) => {
  if (busyness === 'quiet') return '#30A46C';
  if (busyness === 'moderate') return '#F5A524';
  return '#E5484D';
};

const mapFilterToType = (filter: string) => {
  if (filter === 'Study spots') return 'academic'; // Or maybe check 'seats_free'
  if (filter === 'Food') return 'food';
  if (filter === 'Help') return 'help';
  if (filter === 'Events') return 'events'; // We'll handle this by checking upcoming_event
  return 'all';
};

export default function CampusTab() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedPlace, setSelectedPlace] = useState<CampusPlace | null>(null);

  const filteredPlaces = campusPlaces.filter(p => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Events') return !!p.upcoming_event;
    if (activeFilter === 'Study spots') return p.type === 'academic' || p.seats_free !== undefined;
    const type = mapFilterToType(activeFilter);
    return p.type === type;
  });

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex flex-col px-4 pt-4 pb-2 shrink-0 space-y-1">
        <h1 className="text-[20px] font-medium text-[#1A1A17]">Campus</h1>
        <span className="text-[13px] text-[#6B675C]">Quietest study spot right now: Library (23 seats free)</span>
      </div>

      <div className="px-4 py-2 shrink-0">
        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full border text-[13px] transition-colors ${
                activeFilter === f 
                  ? 'border-[#F5A524] bg-[#F5A524]/10 text-[#1A1A17]' 
                  : 'border-[#E4E0D6] bg-[#FBFAF7] text-[#6B675C]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 pb-4 flex justify-center items-start">
        <div className="w-full max-w-[350px] aspect-square relative bg-[#FBFAF7] border border-[#E4E0D6] rounded-[8px] overflow-hidden">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#1A1A17 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
          
          <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
            {filteredPlaces.map(place => (
              <g 
                key={place.id} 
                transform={`translate(${place.x}, ${place.y})`}
                onClick={() => setSelectedPlace(place)}
                className="cursor-pointer group transition-transform hover:scale-105"
              >
                {/* Building rect */}
                <rect 
                  x="-12" y="-8" 
                  width="24" height="16" 
                  rx="4" 
                  fill="#F6F4EF" 
                  stroke="#E4E0D6" 
                  strokeWidth="1"
                  className={`${selectedPlace?.id === place.id ? 'stroke-[#F5A524] stroke-2' : 'group-hover:stroke-[#C8C3B5]'}`}
                />
                {/* Busyness dot */}
                <circle 
                  cx="-8" cy="-4" 
                  r="2.5" 
                  fill={getBusynessColor(place.busyness)} 
                />
                {/* Label text */}
                <text 
                  x="0" y="2" 
                  textAnchor="middle" 
                  alignmentBaseline="middle" 
                  fontSize="4" 
                  fill="#1A1A17"
                  className="font-medium pointer-events-none"
                >
                  {place.name.substring(0, 10)}{place.name.length > 10 ? '...' : ''}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Bottom Sheet Overlay */}
      {selectedPlace && (
        <div 
          className="absolute inset-0 bg-[#1A1A17]/10 z-20 transition-opacity duration-220"
          onClick={() => setSelectedPlace(null)}
        />
      )}

      {/* Bottom Sheet */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-[#FBFAF7] border-t border-[#E4E0D6] rounded-t-[12px] p-4 z-30 transition-transform duration-220 ease-out flex flex-col shadow-[0_-4px_24px_rgba(0,0,0,0.04)] ${
          selectedPlace ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {selectedPlace && (
          <>
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                <h2 className="text-[18px] font-medium text-[#1A1A17]">{selectedPlace.name}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-[13px] text-[#6B675C] capitalize">{selectedPlace.type}</span>
                  <span className="text-[13px] text-[#E4E0D6]">•</span>
                  <span className="text-[13px] text-[#6B675C]">{selectedPlace.hours}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPlace(null)}
                className="p-1 text-[#6B675C] hover:text-[#1A1A17]"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: getBusynessColor(selectedPlace.busyness) }} />
                <span className="text-[15px] text-[#1A1A17] capitalize">{selectedPlace.busyness} right now</span>
              </div>

              {selectedPlace.seats_free !== undefined && (
                <div className="bg-[#F6F4EF] rounded-[6px] px-3 py-2 border border-[#E4E0D6]">
                  <span className="text-[15px] text-[#1A1A17]"><span className="font-mono">{selectedPlace.seats_free}</span> seats free</span>
                </div>
              )}

              {selectedPlace.upcoming_event && (
                <div className="bg-[#F6F4EF] rounded-[6px] px-3 py-2 border border-[#E4E0D6]">
                  <span className="text-[11px] uppercase tracking-[0.04em] text-[#6B675C] block mb-1">Upcoming</span>
                  <span className="text-[15px] text-[#1A1A17]">{selectedPlace.upcoming_event}</span>
                </div>
              )}

              {(selectedPlace.type === 'academic' || selectedPlace.name.includes('Library')) && (
                <div className="border border-[#E4E0D6] rounded-[6px] px-3 py-2 flex justify-between items-center mt-2">
                  <span className="text-[13px] text-[#6B675C]">Study circle meeting here at 5pm: <span className="font-mono text-[#1A1A17]">4</span> joined</span>
                  <button className="text-[13px] font-medium text-[#F5A524]">View</button>
                </div>
              )}
            </div>
            
            {/* Nav padding for when sheet is open over nav, although nav might be below it anyway. Add some padding just in case */}
            <div className="h-[20px]" />
          </>
        )}
      </div>
    </div>
  );
}
