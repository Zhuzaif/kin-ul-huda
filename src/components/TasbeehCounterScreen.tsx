import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { modalVariants, listVariants, listItemVariants, buttonTap } from '../lib/motion';
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
  const [dhikrData, setDhikrData] = useState(() => {
    try {
      const saved = localStorage.getItem('nisa_dhikr_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Map over DHIKR_LIST to ensure any new items are still included
        return DHIKR_LIST.map(item => {
          const savedItem = parsed.find((p: any) => p.id === item.id);
          return savedItem ? { ...item, count: savedItem.count } : item;
        });
      }
    } catch (e) {
      console.error('Error loading dhikr data:', e);
    }
    return DHIKR_LIST;
  });

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
    setDhikrData(prevData => {
      const updated = prevData.map(item => item.id === id ? { ...item, count: newCount } : item);
      try {
        localStorage.setItem('nisa_dhikr_data', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setSelectedDhikr((prev: any) => ({ ...prev, count: newCount }));
  };

  return (
    <motion.div 
      variants={modalVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 bg-theme-surface z-50 flex flex-col font-sans selection:bg-theme-gold/30"
    >
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Inter:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap');
        .font-arabic { font-family: 'Amiri', serif; }
        .font-ui { font-family: 'Inter', sans-serif; }
        
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes float-slow {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(15px, -25px) scale(1.05); }
          66% { transform: translate(-10px, 15px) scale(0.95); }
        }
        .animate-float-1 { animation: float-slow 12s ease-in-out infinite; }
        .animate-float-2 { animation: float-slow 18s ease-in-out infinite reverse; }

        .lcd-text {
            font-family: 'Share Tech Mono', monospace;
            letter-spacing: 0.15em;
        }

        .counter-device {
            background: linear-gradient(145deg, #24242a, #111115);
            border-radius: 60px 60px 80px 80px / 50px 50px 70px 70px;
            box-shadow: 
                0 30px 40px rgba(0,0,0,0.6),
                inset 0 4px 10px rgba(255,255,255,0.1),
                inset 0 -10px 20px rgba(0,0,0,0.8),
                0 0 0 3px #111,
                0 0 0 6px #fca311;
            position: relative;
            z-index: 10;
        }

        .counter-screen-bezel {
            background: #111;
            border-radius: 20px;
            box-shadow: inset 0 5px 15px rgba(0,0,0,0.8), 0 2px 5px rgba(255,255,255,0.1);
        }

        .counter-lcd {
            background: #e5d38c;
            border-radius: 12px;
            box-shadow: inset 0 4px 8px rgba(0,0,0,0.4), inset 0 -2px 4px rgba(255,255,255,0.4);
            position: relative;
            overflow: hidden;
        }

        .counter-lcd::after {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(255,255,255,0) 20%, rgba(255,255,255,0) 80%, rgba(0,0,0,0.05) 100%);
            pointer-events: none;
            border-radius: 12px;
        }

        .btn-count {
            background: radial-gradient(circle at 30% 30%, #ffc640, #fca311, #cc8400);
            border-radius: 50%;
            box-shadow: 
                0 12px 0 #a36a00, 
                0 15px 25px rgba(0,0,0,0.5),
                inset 0 5px 10px rgba(255,255,255,0.4),
                inset 0 -5px 15px rgba(0,0,0,0.3);
            border: 4px solid #1a1a20;
            transition: all 0.1s ease;
            position: relative;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .btn-count.pressed {
            transform: translateY(12px);
            box-shadow: 
                0 0 0 #a36a00, 
                0 5px 10px rgba(0,0,0,0.6),
                inset 0 5px 10px rgba(255,255,255,0.4),
                inset 0 -5px 15px rgba(0,0,0,0.3);
        }

        .btn-reset {
            background: radial-gradient(circle at 30% 30%, #ffc640, #fca311);
            border-radius: 50%;
            box-shadow: 0 4px 0 #a36a00, 0 6px 10px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.4);
            transition: all 0.1s ease;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
        }
        
        .btn-reset.pressed {
            transform: translateY(4px);
            box-shadow: 0 0 0 #a36a00, 0 2px 4px rgba(0,0,0,0.4);
        }

        .counter-strap {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 140%;
            max-width: 440px;
            height: 60px;
            background: linear-gradient(to bottom, #1e3a5f, #0b1a30, #040b16);
            transform: translate(-50%, -50%);
            z-index: 0;
            box-shadow: 0 10px 20px rgba(0,0,0,0.5);
            border-top: 2px solid rgba(255,255,255,0.1);
            border-bottom: 2px solid rgba(0,0,0,0.6);
        }
        
        .counter-strap::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-image: repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.2) 5px, rgba(0,0,0,0.2) 10px);
        }

        .islamic-pattern {
            background-color: #fca311;
            background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M30 0l14.14 14.14L30 28.28 15.86 14.14zM0 30l14.14-14.14L28.28 30 14.14 44.14zM30 60l-14.14-14.14L30 31.72l14.14 14.14zM60 30L45.86 44.14 31.72 30 45.86 15.86zM30 42.42l8.48-8.48-8.48-8.48-8.48 8.48z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
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
            dhikrData={dhikrData}
            onBack={goBack} 
            onUpdateCount={updateCount} 
            onChangeDhikr={setSelectedDhikr}
          />
        )}
      </div>
    </motion.div>
  );
}

// ==========================================
// SCREEN 1: DHIKR LIST (Dashboard)
// ==========================================
function DhikrListScreen({ dhikrData, onSelect, onAppBack }: { dhikrData: typeof DHIKR_LIST, onSelect: (dhikr: any) => void, onAppBack: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col h-full bg-theme-surface"
    >
      {/* Header Section */}
      <div 
        className="bg-theme-accent-strong pb-16 px-6 rounded-b-[40px] relative overflow-hidden shrink-0"
        style={{ paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))' }}
      >
        
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M30 0l14.14 14.14L30 28.28 15.86 14.14zM0 30l14.14-14.14L28.28 30 14.14 44.14zM30 60l-14.14-14.14L30 31.72l14.14 14.14zM60 30L45.86 44.14 31.72 30 45.86 15.86zM30 42.42l8.48-8.48-8.48-8.48-8.48 8.48z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>

        <div className="relative z-10">
          <button 
            onClick={onAppBack}
            className="w-10 h-10 mb-4 flex items-center justify-center rounded-full bg-theme-surface-card backdrop-blur-sm active:scale-95 transition-all text-theme-accent-strong relative z-50 cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-theme-surface text-[28px] font-bold tracking-tight drop-shadow-sm">My Dhikr</h1>
          <p className="text-theme-surface/90 text-sm mt-1 drop-shadow-sm">Have you done your dhikr today?</p>
        </div>
        
        {/* Decorative elements - Custom User Graphic */}
        <div className="absolute -right-2 -bottom-4 opacity-95">
          <div className="w-32 h-32 bg-theme-surface/30 rounded-full blur-xl absolute right-6 bottom-6"></div>
          <img 
            src="/assets/tasbeeh-icon.svg" 
            alt="Tasbeeh Icon"
            className="w-48 h-48 object-contain drop-shadow-xl relative z-10"
          />
        </div>
      </div>

      {/* List Section */}
      <div 
        className="flex-1 overflow-y-auto hide-scrollbar px-5 -mt-6 relative z-20"
        style={{ paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}
      >
        <motion.div variants={listVariants} initial="initial" animate="animate" className="space-y-4">
          {dhikrData.map((item) => (
            <motion.div 
              variants={listItemVariants}
              whileTap={buttonTap}
              key={item.id}
              onClick={() => onSelect(item)}
              className="bg-theme-surface-card p-5 rounded-[24px] shadow-[var(--nisa-shadow-card)] flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all duration-300 border border-theme-border"
            >
              {/* Count Badge (Gold) */}
              <div className="bg-[#fca311] text-gray-900 font-bold text-xs py-1.5 px-4 rounded-full whitespace-nowrap shadow-sm">
                {item.count > 0 ? `${item.count} / ${item.target}` : `${item.target}x`}
              </div>
              
              {/* Text Information */}
              <div className="flex-1 text-right flex flex-col justify-center">
                <p className="font-arabic text-[24px] text-theme-accent-strong leading-relaxed">{item.arabic}</p>
                <p className="text-sm font-medium text-text-tertiary mt-1">{item.roman}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ==========================================
// SCREEN 2: TASBEEH COUNTER
// ==========================================
function CounterScreen({ dhikr, dhikrData, onBack, onUpdateCount, onChangeDhikr }: { dhikr: any, dhikrData: any[], onBack: () => void, onUpdateCount: (id: number, count: number) => void, onChangeDhikr: (dhikr: any) => void }) {
  const [isPressed, setIsPressed] = useState(false);
  const [isResetPressed, setIsResetPressed] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Using onPointerDown handles BOTH touch and mouse uniformly to prevent double counts
  const handleCount = (e?: React.PointerEvent) => {
    if(e) e.preventDefault();
    if (navigator.vibrate) navigator.vibrate(40);
    setIsPressed(true);
    onUpdateCount(dhikr.id, dhikr.count + 1);
  };

  const handleRelease = () => {
    setIsPressed(false);
  };

  const handleReset = (e?: React.PointerEvent) => {
    if(e) e.preventDefault();
    if (navigator.vibrate) navigator.vibrate([20, 50, 20]);
    setIsResetPressed(true);
    onUpdateCount(dhikr.id, 0);
  };

  const handleResetRelease = () => {
    setIsResetPressed(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col h-full bg-[#fca311] islamic-pattern relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none z-0"></div>

      <div 
        className="relative z-50 flex justify-between items-center p-6"
        style={{ paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))' }}
      >
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-gray-900/80 backdrop-blur-sm flex items-center justify-center text-white shadow-lg active:scale-95 transition"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex space-x-4 text-gray-900 relative">
          <div 
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className="flex flex-col items-center cursor-pointer"
          >
              <Grid className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold uppercase">More</span>
          </div>

          <AnimatePresence>
            {isMoreOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute top-full right-0 mt-4 w-64 bg-gray-900 text-white rounded-2xl shadow-2xl border border-gray-700 overflow-hidden z-50 origin-top-right"
              >
                <div className="p-3 bg-black/40 border-b border-gray-700">
                  <h3 className="font-bold text-sm text-[#fca311]">Select Tasbeeh</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {dhikrData.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => {
                        onChangeDhikr(item);
                        setIsMoreOpen(false);
                      }}
                      className={`p-3 border-b border-gray-800 flex items-center justify-between cursor-pointer hover:bg-gray-800 active:bg-gray-800 transition ${item.id === dhikr.id ? 'bg-gray-800/80' : ''}`}
                    >
                      <div className="flex flex-col">
                        <span className="font-arabic text-lg leading-tight">{item.arabic}</span>
                        <span className="text-xs text-gray-400 mt-1">{item.roman}</span>
                      </div>
                      {item.count > 0 && (
                        <div className="bg-[#fca311] text-gray-900 font-bold text-[10px] px-2 py-0.5 rounded-full">
                          {item.count}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-start pt-4 px-6 text-center" onClick={() => isMoreOpen && setIsMoreOpen(false)}>
        <h2 className="font-arabic text-4xl text-gray-900 font-bold mb-3 drop-shadow-md">{dhikr.arabic}</h2>
        <p className="text-gray-800 text-lg font-semibold tracking-wide drop-shadow-sm">{dhikr.roman}</p>
        
        <div className="mt-4 bg-gray-900 text-[#fca311] text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border border-gray-700">
          Target: <span>{dhikr.target}</span>
        </div>
      </div>

      <div 
        className="relative z-10 w-full flex justify-center pt-8" 
        style={{ paddingBottom: 'calc(64px + env(safe-area-inset-bottom, 0px))' }}
        onClick={() => isMoreOpen && setIsMoreOpen(false)}
      >
        <div className="counter-strap"></div>

        <div className="counter-device w-[280px] h-[340px] flex flex-col items-center pt-8 pb-10 px-6">
          <div className="counter-screen-bezel w-full p-2 mb-6">
            <div className="counter-lcd w-full h-[70px] flex items-center justify-end px-4">
              <span className="lcd-text text-5xl font-bold text-gray-900 tracking-[0.2em] opacity-90">
                {dhikr.count.toString().padStart(5, '0')}
              </span>
            </div>
          </div>

          <div className="w-full flex justify-end pr-2 mb-2">
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold text-[#fca311] tracking-widest mb-2 opacity-80">RESET</span>
              <div 
                onPointerDown={handleReset}
                onPointerUp={handleResetRelease}
                onPointerCancel={handleResetRelease}
                onPointerLeave={handleResetRelease}
                className={`btn-reset w-5 h-5 ${isResetPressed ? 'pressed' : ''}`}
              ></div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center w-full">
            <div 
              onPointerDown={handleCount}
              onPointerUp={handleRelease}
              onPointerCancel={handleRelease}
              onPointerLeave={handleRelease}
              className={`btn-count w-[110px] h-[110px] ${isPressed ? 'pressed' : ''}`}
            >
              <span className="font-bold text-[#4a2e00] text-sm tracking-widest uppercase pointer-events-none drop-shadow-sm">Count</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
