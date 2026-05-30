import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Compass, Clock, Heart, X, ChevronRight } from 'lucide-react';
import { usePeriodMode } from '../contexts/PeriodModeContext';
import { motion, AnimatePresence } from 'motion/react';
import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from 'adhan';

interface PrayerItem {
  name: string;
  time: string;
  passed: boolean;
  active?: boolean;
  dateObj?: Date;
}

export default function PrayerWidget({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const { isPeriodMode } = usePeriodMode();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const playedAdhans = React.useRef(new Set<number>());
  
  const [dates, setDates] = useState({ gregorian: '', islamic: '' });
  const [prayers, setPrayers] = useState<PrayerItem[]>([
    { name: 'Fajr', time: '--:-- AM', passed: false },
    { name: 'Dhuhr', time: '--:-- PM', passed: false },
    { name: 'Asr', time: '--:-- PM', passed: false },
    { name: 'Maghrib', time: '--:-- PM', passed: false },
    { name: 'Isha', time: '--:-- PM', passed: false },
  ]);
  const [nextPrayerName, setNextPrayerName] = useState('...');

  useEffect(() => {
    const today = new Date();
    const gregorian = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(today);
    
    const islamicParts = new Intl.DateTimeFormat('en-US-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).formatToParts(today);
    const iDay = islamicParts.find(p => p.type === 'day')?.value;
    const iMonth = islamicParts.find(p => p.type === 'month')?.value;
    const iYear = islamicParts.find(p => p.type === 'year')?.value;
    const islamic = `${iDay} ${iMonth} ${iYear}`;
    
    setDates({ gregorian, islamic });
    setPortalTarget(document.getElementById('mobile-frame-root'));
  }, []);

  useEffect(() => {
    const calculatePrayers = (lat: number, lng: number) => {
      const coordinates = new Coordinates(lat, lng);
      const params = CalculationMethod.Karachi();
      params.madhab = Madhab.Hanafi; // Defaulting to Hanafi Asr method
      
      const date = new Date();
      const pt = new PrayerTimes(coordinates, date, params);
      
      const formatTime = (d: Date) => {
        return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(d);
      };
      
      const now = new Date();
      const p: PrayerItem[] = [
        { name: 'Fajr', dateObj: pt.fajr, time: formatTime(pt.fajr), passed: now > pt.fajr },
        { name: 'Dhuhr', dateObj: pt.dhuhr, time: formatTime(pt.dhuhr), passed: now > pt.dhuhr },
        { name: 'Asr', dateObj: pt.asr, time: formatTime(pt.asr), passed: now > pt.asr },
        { name: 'Maghrib', dateObj: pt.maghrib, time: formatTime(pt.maghrib), passed: now > pt.maghrib },
        { name: 'Isha', dateObj: pt.isha, time: formatTime(pt.isha), passed: now > pt.isha },
      ];
      
      let nextIndex = p.findIndex(prayer => !prayer.passed);
      
      if (nextIndex === -1) {
        // All prayers for today have passed, calculate tomorrow's Fajr
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowPt = new PrayerTimes(coordinates, tomorrow, params);
        p[0].dateObj = tomorrowPt.fajr;
        p[0].active = true;
        setNextPrayerName('Fajr');
      } else {
        p[nextIndex].active = true;
        setNextPrayerName(p[nextIndex].name);
      }
      
      setPrayers(p);
    };

    const fetchLocation = async () => {
      try {
        const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
        if (res.ok) {
          const data = await res.json();
          calculatePrayers(parseFloat(data.latitude), parseFloat(data.longitude));
        }
      } catch (e) {
        console.error("Failed to load location for prayer times", e);
        // Fallback to Mecca if IP fetch fails
        calculatePrayers(21.4225, 39.8262); 
      }
    };
    fetchLocation();
  }, []);

  useEffect(() => {
    if (prayers.length === 0 || !prayers.some(p => p.active)) return;
    
    const nextP = prayers.find(p => p.active);
    if (!nextP || !nextP.dateObj) return;

    const updateTimer = () => {
      const now = new Date();
      const diffInSeconds = Math.floor((nextP.dateObj!.getTime() - now.getTime()) / 1000);
      if (diffInSeconds <= 0) {
        setTimeLeft(0);
        // In a full app, we would re-fetch/re-calculate prayers here to refresh for the next day
      } else {
        setTimeLeft(diffInSeconds);
      }
    };
    
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [prayers]);

  useEffect(() => {
    if (timeLeft === 0 && prayers.length > 0) {
      const activePrayer = prayers.find(p => p.active);
      if (activePrayer && activePrayer.dateObj) {
        const timeKey = activePrayer.dateObj.getTime();
        if (!playedAdhans.current.has(timeKey)) {
          const audio = new Audio('/adhan.mp3');
          audio.play().catch(e => console.error("Adhan autoplay blocked by browser policy:", e));
          playedAdhans.current.add(timeKey);
        }
      }
    }
  }, [timeLeft, prayers]);

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '--:--:--';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `-${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="px-6 mb-6">
        <div 
          role="button"
          tabIndex={0}
          onClick={() => !isPeriodMode && setIsModalOpen(true)}
          className={`w-full text-left rounded-[32px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden transition-all duration-500 active:scale-[0.98] cursor-pointer ${
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
                  {dates.gregorian || '...'}
                </p>
                <p className={`text-xs font-semibold mt-0.5 ${isPeriodMode ? 'text-[#D98A5B]/70' : 'text-[#2B604A]/60'}`}>
                  {dates.islamic || '...'}
                </p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate?.('qibla');
                }}
                className="w-10 h-10 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white/60 transition-colors"
              >
                {isPeriodMode ? (
                  <Heart className="w-5 h-5 text-soft-pink-dark fill-current" />
                ) : (
                  <Compass className="w-5 h-5 text-[#2B604A]" />
                )}
              </button>
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
                      <h3 className="text-4xl font-bold text-[#1F4535] tracking-tight">{nextPrayerName}</h3>
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
        </div>
      </div>

      {portalTarget && createPortal(
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
              
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Prayer Times</h2>
                  <p className="text-sm text-gray-500 font-medium">{dates.islamic || '...'}</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col mb-6 bg-gray-50/80 rounded-[24px] p-2 border border-gray-100/80">
                {prayers.map((prayer, i) => (
                  <div 
                    key={i} 
                    className={`flex items-center justify-between p-3.5 rounded-[18px] transition-all duration-300 ${
                      prayer.active ? 'bg-soft-mint shadow-sm scale-[1.02] border border-[#2B604A]/10' : 
                      prayer.passed ? 'opacity-40 grayscale-[50%]' : 'bg-transparent hover:bg-gray-100/50'
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

              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  onNavigate?.('qibla');
                }}
                className="w-full bg-[#1F4535] text-white py-4 rounded-[20px] flex items-center justify-center gap-2 font-bold shadow-[0_4px_15px_rgba(31,69,53,0.3)] active:scale-[0.98] transition-transform"
              >
                <Compass className="w-5 h-5" />
                Open Qibla Compass
              </button>
            </motion.div>
          </React.Fragment>
          )}
        </AnimatePresence>,
        portalTarget
      )}
    </>
  );
}
