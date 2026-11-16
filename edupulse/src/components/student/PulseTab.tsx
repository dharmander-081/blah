import React, { useState } from 'react';
import { useAppStore } from '@/data/store';
import { LineChart, Line, YAxis, ResponsiveContainer } from 'recharts';
import { Phone, ChevronDown, ChevronUp } from 'lucide-react';

// Need to import toast, assuming sonner is used based on prompt
import { toast } from 'sonner';

const MOODS = [
  { value: 1, color: 'bg-[#9BA3AF]', border: 'border-[#7D8694]', label: 'Rough' },
  { value: 2, color: 'bg-[#C1C8D4]', border: 'border-[#9EA7B6]', label: 'Low' },
  { value: 3, color: 'bg-[#E4E0D6]', border: 'border-[#C8C3B5]', label: 'Okay' },
  { value: 4, color: 'bg-[#FAD980]', border: 'border-[#F5A524]', label: 'Good' },
  { value: 5, color: 'bg-[#F5A524]', border: 'border-[#D98D16]', label: 'Great' },
];

const FACTORS = ['Exams', 'Sleep', 'Family', 'Friends', 'Workload', 'Health', 'Finances', 'Loneliness'];

export default function PulseTab() {
  const currentStudent = useAppStore(state => state.currentStudent());
  
  const [mood, setMood] = useState<number | null>(null);
  const [factors, setFactors] = useState<string[]>([]);
  const [sleep, setSleep] = useState<number>(6.5);
  const [note, setNote] = useState('');
  
  const [isCheckinSaved, setIsCheckinSaved] = useState(false);
  const [sharingOption, setSharingOption] = useState<'private' | 'mentor' | 'counselor'>('private');
  const [needTalkExpanded, setNeedTalkExpanded] = useState(false);

  if (!currentStudent) return null;

  const today = new Date().toISOString().split('T')[0];
  const hasCheckedInToday = isCheckinSaved || currentStudent.checkins.some(c => c.date === today);

  const toggleFactor = (f: string) => {
    if (factors.includes(f)) {
      setFactors(factors.filter(x => x !== f));
    } else if (factors.length < 3) {
      setFactors([...factors, f]);
    }
  };

  const handleSave = () => {
    if (!mood) return;
    setIsCheckinSaved(true);
    toast.success('Check-in saved');
  };

  const handleSharingChange = (val: 'private' | 'mentor' | 'counselor') => {
    setSharingOption(val);
    toast.success('Sharing updated');
  };

  const chartData = currentStudent.checkins.slice(-30).map((c, i) => ({
    name: i,
    mood: c.mood
  }));

  return (
    <div className="flex flex-col relative min-h-full pb-20">
      <div className="h-[44px] flex items-center px-4 shrink-0">
        <h1 className="text-[15px] font-medium text-[#1A1A17]">Pulse</h1>
      </div>

      <div className="px-4 space-y-8 flex-1">
        {!hasCheckedInToday && (
          <div className="flex flex-col space-y-6 bg-[#FBFAF7] p-4 rounded-[8px] border border-[#E4E0D6]">
            {/* Step 1: Mood */}
            <div className="flex flex-col space-y-2">
              <span className="text-[15px] text-[#1A1A17]">How are you feeling?</span>
              <div className="flex justify-between">
                {MOODS.map(m => (
                  <button
                    key={m.value}
                    onClick={() => setMood(m.value)}
                    className={`w-[48px] h-[48px] rounded-[6px] transition-all flex items-center justify-center ${m.color} ${
                      mood === m.value ? `border-2 ${m.border}` : 'border border-transparent'
                    }`}
                  >
                    {mood === m.value && <span className="text-[11px] font-medium text-[#1A1A17]">{m.label}</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Factors */}
            <div className="flex flex-col space-y-2">
              <span className="text-[15px] text-[#1A1A17]">What's driving this? <span className="text-[#6B675C] text-[13px]">(max 3)</span></span>
              <div className="flex flex-wrap gap-2">
                {FACTORS.map(f => {
                  const isSelected = factors.includes(f);
                  return (
                    <button
                      key={f}
                      onClick={() => toggleFactor(f)}
                      className={`px-3 py-1.5 rounded-[6px] text-[13px] transition-colors border ${
                        isSelected 
                          ? 'border-[#F5A524] text-[#1A1A17] bg-[#F5A524]/10' 
                          : 'border-[#E4E0D6] text-[#6B675C] hover:border-[#C8C3B5]'
                      }`}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Sleep */}
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[15px] text-[#1A1A17]">Sleep last night</span>
                <span className="font-mono text-[15px] text-[#1A1A17]">{sleep}h</span>
              </div>
              <input 
                type="range" 
                min="4" max="9" step="0.5" 
                value={sleep} 
                onChange={(e) => setSleep(parseFloat(e.target.value))}
                className="w-full accent-[#F5A524]"
              />
            </div>

            {/* Step 4: Note */}
            <div className="flex flex-col space-y-2">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Anything else on your mind?"
                className="w-full bg-transparent border border-[#E4E0D6] rounded-[6px] p-2 text-[15px] text-[#1A1A17] placeholder-[#6B675C] focus:outline-none focus:border-[#F5A524] resize-none h-[60px]"
              />
            </div>

            <button 
              onClick={handleSave}
              disabled={!mood}
              className="bg-[#F5A524] text-[#1A1A17] text-[13px] font-medium py-2 rounded-[6px] transition-colors hover:bg-[#E59513] disabled:opacity-50 self-end px-4"
            >
              Save check-in
            </button>
          </div>
        )}

        {/* Trends */}
        <div className="flex flex-col space-y-3">
          <h2 className="text-[11px] uppercase tracking-[0.04em] text-[#6B675C]">30-Day Trend</h2>
          <div className="h-[80px] w-full bg-[#FBFAF7] border border-[#E4E0D6] rounded-[8px] p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <YAxis domain={[1, 5]} hide />
                <Line type="monotone" dataKey="mood" stroke="#F5A524" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <span className="text-[13px] text-[#6B675C]">Your lowest days follow nights under 5 hours.</span>
        </div>

        {/* Share Controls */}
        <div className="flex flex-col space-y-3">
          <h2 className="text-[11px] uppercase tracking-[0.04em] text-[#6B675C]">Who can see your data</h2>
          <div className="flex flex-col rounded-[8px] border border-[#E4E0D6] bg-[#FBFAF7] overflow-hidden">
            {[
              { id: 'private', label: 'Private — only you' },
              { id: 'mentor', label: 'Share trends with my mentor', sub: 'they see mood and sleep trends, not notes' },
              { id: 'counselor', label: 'Share with counselor', sub: 'they see everything including notes' },
            ].map((opt, i) => (
              <button
                key={opt.id}
                onClick={() => handleSharingChange(opt.id as any)}
                className={`flex flex-col text-left p-3 border-b border-[#E4E0D6] last:border-b-0 ${
                  sharingOption === opt.id ? 'bg-[#F6F4EF] border-l-2 border-l-[#F5A524] pl-[10px]' : 'pl-3'
                }`}
              >
                <span className="text-[15px] text-[#1A1A17]">{opt.label}</span>
                {opt.sub && <span className="text-[13px] text-[#6B675C] mt-0.5">{opt.sub}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Reach out */}
        <div className="flex flex-col space-y-3">
          <h2 className="text-[11px] uppercase tracking-[0.04em] text-[#6B675C]">Reach out</h2>
          <div className="grid grid-cols-2 gap-2">
            <button className="border border-[#E4E0D6] rounded-[6px] py-2 text-[13px] text-[#1A1A17] hover:bg-[#E4E0D6]/50 transition-colors">
              Talk to counselor
            </button>
            <button className="border border-[#E4E0D6] rounded-[6px] py-2 text-[13px] text-[#1A1A17] hover:bg-[#E4E0D6]/50 transition-colors">
              Message mentor
            </button>
          </div>
        </div>
      </div>

      {/* Need to talk now (Always visible at bottom above nav) */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#FBFAF7] border-t border-[#E4E0D6] px-4 py-3 z-10">
        <button 
          onClick={() => setNeedTalkExpanded(!needTalkExpanded)}
          className="w-full flex justify-between items-center"
        >
          <div className="flex items-center text-[#6B675C]">
            <Phone size={14} className="mr-2" />
            <span className="text-[13px] font-medium">Need to talk now?</span>
          </div>
          {needTalkExpanded ? <ChevronDown size={16} className="text-[#6B675C]" /> : <ChevronUp size={16} className="text-[#6B675C]" />}
        </button>
        
        {needTalkExpanded && (
          <div className="pt-3 pb-1 flex flex-col space-y-2">
            <span className="text-[15px] text-[#1A1A17]">Tele-MANAS: <span className="font-mono">14416</span></span>
            <span className="text-[15px] text-[#1A1A17]">Campus Counselor: <span className="text-[#6B675C]">Dr. Meera Nair, ext. 2234</span></span>
          </div>
        )}
      </div>
    </div>
  );
}
