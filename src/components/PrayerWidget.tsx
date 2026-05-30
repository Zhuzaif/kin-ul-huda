import React, { useState, useEffect } from 'react';
import { Compass, Clock, Heart, X, ChevronRight } from 'lucide-react';
import { usePeriodMode } from '../contexts/PeriodModeContext';
import { motion, AnimatePresence } from 'motion/react';

export default function PrayerWidget() {
  const { isPeriodMode } = usePeriodMode();
  const [timeLeft, setTimeLeft] = useState(2 * 3600 + 15 * 60 + 30); // 2:15:30 in seconds
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `-${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const prayers = [
    { name: 'Fajr', time: '04:30 AM', passed: true },
    { name: 'Dhuhr', time: '12:15 PM', passed: true },
    { name: 'Asr', time: '03:45 PM', passed: false, active: true },
    { name: 'Maghrib', time: '06:20 PM', passed: false },
    { name: 'Isha', time: '07:45 PM', passed: false },
  ];

  return (
    <>
      <div className="px-6 mb-6">
        <button 
          onClick={() => !isPeriodMode && setIsModalOpen(true)}
          className={`w-full text-left rounded-[32px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden transition-all duration-500 active:scale-[0.98] ${
            isPeriodMode 
              ? 'bg-gradient-to-br from-[#FCE7D8] to-soft-pink cursor-default' 
              : 'bg-gradient-to-br from-soft-mint to-[#D1E6DA]'
          }`}
        >
          {/* Decorative background circle */}
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className={`text-sm font-medium uppercase tracking-wide ${isPeriodMode ? 'text-[#D98A5B]/80' : 'text-[#2B604A]/70'}`}>
                  28 May 2026
                </p>
                <p className={`text-xs font-semibold mt-0.5 ${isPeriodMode ? 'text-[#D98A5B]/70' : 'text-[#2B604A]/60'}`}>
                  11 Dhu al-Hijjah 1447
                </p>
              </div>
              <div className="w-10 h-10 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
                {isPeriodMode ? (
                  <Heart className="w-5 h-5 text-soft-pink-dark fill-current" />
                ) : (
                  <Compass className="w-5 h-5 text-[#2B604A]" />
                )}
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div className="relative min-h-[50px]">
                <AnimatePresence mode="popLayout">
                  {isPeriodMode ? (
                    <motion.div
                      key="period-mode"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-sm font-medium text-[#D98A5B]/80 mb-1">Current Focus</p>
                      <h3 className="text-3xl font-bold text-gray-800 tracking-tight">Dhikr Time</h3>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="prayer-mode"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-sm font-medium text-[#2B604A]/80 mb-1">Next Prayer</p>
                      <h3 className="text-4xl font-bold text-[#1F4535] tracking-tight">Asr</h3>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <AnimatePresence mode="popLayout">
                <motion.div 
                  key={isPeriodMode ? 'period-badge' : 'prayer-badge'}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`flex items-center gap-1.5 bg-white/50 backdrop-blur-sm px-3 pt-1.5 pb-1 rounded-xl shadow-sm ${isPeriodMode ? 'text-[#D98A5B]' : 'text-[#1F4535]'}`}
                >
                  {isPeriodMode ? (
                    <span className="text-sm font-semibold tracking-tight pb-0.5 px-2">SubhanAllah</span>
                  ) : (
                    <>
                      <Clock className="w-4 h-4 mb-0.5 opacity-80" />
                      <span className="text-lg font-semibold tabular-nums tracking-tight font-mono">{formatTime(timeLeft)}</span>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <React.Fragment>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm z-50 rounded-[48px]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] pt-4 pb-8 px-6 z-50 shadow-2xl"
            >
              <div className="flex justify-center mb-6">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
              </div>
              
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Prayer Times</h2>
                  <p className="text-sm text-gray-500 font-medium">11 Dhu al-Hijjah 1447</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-3 mb-8">
                {prayers.map((prayer, i) => (
                  <div 
                    key={i} 
                    className={`flex items-center justify-between p-4 rounded-[20px] transition-colors ${
                      prayer.active ? 'bg-soft-mint border border-soft-mint-dark/30 shadow-sm' : 
                      prayer.passed ? 'opacity-60' : 'bg-gray-50'
                    }`}
                  >
                    <span className={`text-[15px] font-bold ${prayer.active ? 'text-[#1F4535]' : 'text-gray-700'}`}>
                      {prayer.name}
                    </span>
                    <span className={`text-[14px] font-bold ${prayer.active ? 'text-[#1F4535]' : 'text-gray-500'}`}>
                      {prayer.time}
                    </span>
                  </div>
                ))}
              </div>

              <button className="w-full bg-[#1F4535] text-white py-4 rounded-[20px] flex items-center justify-center gap-2 font-bold shadow-[0_4px_15px_rgba(31,69,53,0.3)] active:scale-[0.98] transition-transform">
                <Compass className="w-5 h-5" />
                Open Qibla Compass
              </button>
            </motion.div>
          </React.Fragment>
        )}
      </AnimatePresence>
    </>
  );
}
