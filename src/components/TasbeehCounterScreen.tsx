import React, { useState } from 'react';
import { ChevronLeft, Palette, Grid, Share2, Heart } from 'lucide-react';

// --- Dhikr Data (Aapka Data) ---
const DHIKR_LIST = [
  { id: 1, arabic: 'سُبْحَانَ اللَّهِ', roman: 'Subhanallah', target: 33, count: 0 },
  { id: 2, arabic: 'الْحَمْدُ لِلَّهِ', roman: 'Alhamdulillah', target: 33, count: 0 },
  { id: 3, arabic: 'اللَّهُ أَكْبَرُ', roman: 'Allahu Akbar', target: 34, count: 0 },
  { id: 4, arabic: 'أَسْتَغْفِرُ اللَّهَ', roman: 'Astaghfirullah', target: 100, count: 0 },
  { id: 5, arabic: 'لَا إِلَهَ إِلَّا اللَّهُ', roman: 'Laailaaha illallah', target: 100, count: 0 },
];

interface TasbeehCounterScreenProps {
  onBack: () => void;
}

export default function TasbeehCounterScreen({ onBack }: TasbeehCounterScreenProps) {
  const [currentScreen, setCurrentScreen] = useState<'list' | 'counter'>('list'); // 'list' ya 'counter'
  const [selectedDhikr, setSelectedDhikr] = useState<any>(null);
  const [dhikrData, setDhikrData] = useState(DHIKR_LIST);

  // Screen switch karne ka function
  const openCounter = (dhikr: any) => {
    setSelectedDhikr(dhikr);
    setCurrentScreen('counter');
  };

  const goBack = () => {
    setCurrentScreen('list');
  };

  // Count update karne ka function
  const updateCount = (id: number, newCount: number) => {
    setDhikrData(prevData => 
      prevData.map(item => item.id === id ? { ...item, count: newCount } : item)
    );
    setSelectedDhikr((prev: any) => ({ ...prev, count: newCount }));
  };

  return (
    <div className="absolute inset-0 bg-theme-surface z-50 flex flex-col font-sans selection:bg-[#C9A66B]/30 animate-in fade-in duration-300">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap');
        .font-arabic { font-family: 'Amiri', serif; }
        .font-ui { font-family: 'Inter', sans-serif; }
        
        /* Custom Scrollbar hide */
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        /* Floating Animations for Background Auras */
        @keyframes float-slow {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(15px, -25px) scale(1.05); }
          66% { transform: translate(-10px, 15px) scale(0.95); }
        }
        .animate-float-1 { animation: float-slow 12s ease-in-out infinite; }
        .animate-float-2 { animation: float-slow 18s ease-in-out infinite reverse; }
      `}} />

      <div className="flex-1 flex flex-col w-full h-full overflow-hidden relative font-ui bg-theme-surface">
        
        {currentScreen === 'list' ? (
          <DhikrListScreen 
            dhikrData={dhikrData} 
            onSelect={openCounter} 
            onAppBack={onBack}
          />
        ) : (
          <CounterScreen 
            dhikr={selectedDhikr} 
            onBack={goBack} 
            onUpdateCount={updateCount} 
          />
        )}

      </div>
    </div>
  );
}

// ==========================================
// SCREEN 1: DHIKR LIST (Dashboard)
// ==========================================
function DhikrListScreen({ dhikrData, onSelect, onAppBack }: { dhikrData: typeof DHIKR_LIST, onSelect: (dhikr: any) => void, onAppBack: () => void }) {
  return (
    <div className="flex-1 flex flex-col h-full bg-theme-surface animate-in fade-in duration-300">
      {/* Header Section (Deep Forest) */}
      <div className="bg-theme-accent-strong pt-4 pb-16 px-6 rounded-b-[40px] relative overflow-hidden shrink-0">
        <div className="relative z-10">
          <button 
            onClick={onAppBack}
            className="w-10 h-10 mb-4 flex items-center justify-center rounded-full bg-theme-surface-card backdrop-blur-sm active:scale-95 transition-all text-white relative z-50 cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-theme-gold text-[28px] font-bold tracking-tight">My Dhikr</h1>
          <p className="text-white/80 text-sm mt-1">Have you done your dhikr today?</p>
        </div>
        
        {/* Decorative elements - Hand/Counter Graphic Placeholder */}
        <div className="absolute right-0 bottom-0 opacity-80 translate-y-4 translate-x-4">
          <div className="w-32 h-32 bg-theme-gold/20 rounded-full blur-2xl absolute right-4 bottom-4"></div>
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-theme-gold opacity-90 drop-shadow-lg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 12H16M12 8V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.2"/>
          </svg>
        </div>
      </div>

      {/* List Section */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 -mt-6 pb-6 relative z-20">
        <div className="space-y-4">
          {dhikrData.map((item) => (
            <div 
              key={item.id}
              onClick={() => onSelect(item)}
              className="bg-theme-surface-card p-5 rounded-[24px] shadow-[var(--nisa-shadow-card)] flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all duration-300 border border-theme-border"
            >
              {/* Count Badge (Gold) */}
              <div className="bg-theme-gold text-white font-semibold text-xs py-1.5 px-4 rounded-full whitespace-nowrap shadow-sm">
                {item.count > 0 ? `${item.count} / ${item.target}` : `${item.target}x`}
              </div>
              
              {/* Text Information */}
              <div className="flex-1 text-right flex flex-col justify-center">
                <p className="font-arabic text-[24px] text-theme-accent-strong leading-relaxed">{item.arabic}</p>
                <p className="text-sm font-medium text-text-tertiary mt-1">{item.roman}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// SCREEN 2: TASBEEH COUNTER
// ==========================================
function CounterScreen({ dhikr, onBack, onUpdateCount }: { dhikr: any, onBack: () => void, onUpdateCount: (id: number, count: number) => void }) {
  const [isPressed, setIsPressed] = useState(false);

  // Counter badhane ka function
  const handleCount = () => {
    // Haptic Feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    onUpdateCount(dhikr.id, dhikr.count + 1);
    
    // Push Animation effect
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);
  };

  // Reset function
  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation(); // Main button click ko rokne ke liye
    if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
    onUpdateCount(dhikr.id, 0);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-b from-theme-accent-strong to-theme-surface-dark relative overflow-hidden animate-in fade-in duration-300">
      
      {/* Ambient Glowing Effect (New Background) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top Right Gold Aura */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-theme-gold rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-float-1"></div>
        {/* Bottom Left Deep Mint Aura */}
        <div className="absolute top-1/2 -left-32 w-[28rem] h-[28rem] bg-theme-accent rounded-full mix-blend-screen filter blur-[130px] opacity-40 animate-float-2"></div>
        {/* Center subtle highlight */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-theme-surface-card rounded-full mix-blend-overlay filter blur-[100px] opacity-5"></div>
      </div>

      {/* Top Header */}
      <div className="flex justify-between items-center p-6 text-white pt-4 relative z-10">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-theme-surface-card backdrop-blur-sm active:scale-95 transition-all relative z-50 cursor-pointer"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      {/* Arabic Text Section */}
      <div className="px-6 flex flex-col items-center text-center mt-4 relative z-10">
        <h2 className="font-arabic text-[42px] text-white leading-tight drop-shadow-md">
          {dhikr.arabic}
        </h2>
        <p className="text-theme-gold text-lg mt-2 font-medium tracking-wide">
          {dhikr.roman}
        </p>
      </div>

      {/* Counter Device Interface */}
      <div className="flex-1 flex items-center justify-center px-4 pb-12 mt-6 relative z-10">
        
        {/* Device Body */}
        <div className="w-[300px] bg-[#0A1611] rounded-[60px] rounded-b-[80px] p-6 shadow-2xl relative border-b-8 border-[#152B21] flex flex-col items-center">
          
          {/* Gold Trim/Accent Strap behind the counter (Optional design detail) */}
          <div className="absolute top-1/2 -left-10 -right-10 h-12 bg-[#C9A66B] -z-10 -translate-y-1/2 rotate-[-5deg] opacity-80 blur-[2px]"></div>

          {/* LCD Screen Container */}
          <div className="w-full bg-[#D4BA7B] rounded-2xl p-4 shadow-inner mb-8 border-[3px] border-[#8A7145] relative overflow-hidden flex items-center justify-end h-[80px]">
            {/* Background faint digital 8s for LCD realism */}
            <div className="absolute right-4 font-mono text-[52px] text-[#B89D5E] opacity-50 tracking-widest select-none pointer-events-none" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
              8888
            </div>
            
            {/* Actual Count */}
            <div className="relative z-10 font-mono text-[52px] text-[#2B2312] font-bold tracking-widest leading-none drop-shadow-sm" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
              {dhikr.count.toString().padStart(4, '0')}
            </div>
          </div>

          {/* Controls Area */}
          <div className="w-full relative flex flex-col items-center">
            
            {/* Reset Button (Chota button) */}
            <div className="absolute right-2 top-0 flex flex-col items-center gap-1">
              <span className="text-theme-gold text-[8px] tracking-widest uppercase opacity-80">Reset</span>
              <button 
                onClick={handleReset}
                className="w-4 h-4 bg-theme-gold rounded-full active:scale-75 transition-all shadow-[0_2px_0_var(--color-theme-border-strong)] active:translate-y-[2px] active:shadow-none"
              ></button>
            </div>

            {/* Main Count Button (Bada button) */}
            <div className="mt-8 mb-4">
              <button 
                onClick={handleCount}
                className={`
                  w-28 h-28 rounded-full bg-gradient-to-b from-theme-gold to-theme-orange 
                  flex items-center justify-center border-4 border-[#1F1F1F]
                  text-[#5A4518] font-bold text-sm tracking-widest uppercase
                  transition-all duration-75
                  ${isPressed 
                    ? 'translate-y-[6px] shadow-[0_0px_0_#8A7145]' 
                    : 'shadow-[0_8px_0_#8A7145,0_15px_20px_rgba(0,0,0,0.5)]'}
                `}
              >
                COUNT
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
