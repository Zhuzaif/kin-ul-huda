import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Clock, Heart, X } from 'lucide-react';
import { usePeriodMode } from '../contexts/PeriodModeContext';
import { useProfile } from '../contexts/ProfileContext';
import { motion, AnimatePresence } from 'motion/react';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { getMadhabLabel, getCalculationMethodLabel } from '../utils/prayerTimes';
import { listVariants, listItemVariants, buttonTap } from '../lib/motion';
import { setPendingProfileScreen } from './ProfileLayout';

function QiblaIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <path
        d="M12 2.5V4.5M12 19.5V21.5M2.5 12H4.5M19.5 12H21.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <rect x="8.5" y="8.5" width="7" height="7" rx="1.5" fill="currentColor" />
      <path d="M8.5 11H15.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 3.5L13.5 6.5H10.5L12 3.5Z" fill="currentColor" />
    </svg>
  );
}

export default function PrayerWidget({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const { isPeriodMode } = usePeriodMode();
  const { profile } = useProfile();
  const { widgetPrayers, nextPrayerName, activePrayerTime, activePrayerDate, loading } = usePrayerTimes(
    profile.madhab,
    profile.calculationMethod
  );

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const playedAdhans = React.useRef(new Set<number>());

  const [dates, setDates] = useState({ gregorian: '', islamic: '' });

  useEffect(() => {
    const today = new Date();
    const gregorian = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(today);

    const ISLAMIC_MONTHS = [
      'Muharram', 'Safar', 'Rabiʻ I', 'Rabiʻ II', 'Jumada I', 'Jumada II',
      'Rajab', 'Shaʻban', 'Ramadan', 'Shawwal', 'Dhuʻl-Qiʻdah', 'Dhuʻl-Hijjah'
    ];

    const islamicParts = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).formatToParts(today);
    
    const iDay = islamicParts.find((p) => p.type === 'day')?.value;
    const iMonthNum = parseInt(islamicParts.find((p) => p.type === 'month')?.value || '1', 10);
    const iMonth = ISLAMIC_MONTHS[iMonthNum - 1] || '';
    const iYear = islamicParts.find((p) => p.type === 'year')?.value;
    const islamic = `${iDay} ${iMonth} ${iYear}`;

    setDates({ gregorian, islamic });
    setPortalTarget(document.getElementById('mobile-frame-root'));
  }, []);

  useEffect(() => {
    if (!activePrayerDate) return;

    const updateTimer = () => {
      const now = new Date();
      const diffInSeconds = Math.floor((activePrayerDate.getTime() - now.getTime()) / 1000);
      setTimeLeft(diffInSeconds <= 0 ? 0 : diffInSeconds);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [activePrayerDate]);

  useEffect(() => {
    if (timeLeft === 0 && activePrayerDate) {
      const timeKey = activePrayerDate.getTime();
      if (!playedAdhans.current.has(timeKey)) {
        const audio = new Audio('/adhan.mp3');
        audio.play().catch((e) => console.error('Adhan autoplay blocked:', e));
        playedAdhans.current.add(timeKey);
      }
    }
  }, [timeLeft, activePrayerDate]);

  const formatCountdown = (seconds: number | null) => {
    if (seconds === null) return '00:00:00';
    const safeSeconds = Math.max(0, seconds);
    const h = Math.floor(safeSeconds / 3600);
    const m = Math.floor((safeSeconds % 3600) / 60);
    const s = safeSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const madhabNote = `${getMadhabLabel(profile.madhab)} · ${getCalculationMethodLabel(profile.calculationMethod)}`;

  return (
    <>
      <div className="px-6 mb-6">
        {isPeriodMode ? (
          <div className="p-4 rounded-[1.25rem] bg-theme-surface-card border border-theme-rose/30 relative overflow-hidden shadow-[var(--nisa-shadow-card)] cursor-default">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-theme-rose opacity-10 rounded-full blur-2xl pointer-events-none"></div>

            {/* Top Row */}
            <div className="flex justify-between items-end relative z-10">
                <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Current Focus</p>
                    <h2 className="text-3xl font-bold text-theme-rose">Dhikr Time</h2>
                </div>

                {/* Period Mode Badge */}
                <div className="bg-theme-surface-dark border border-theme-border rounded-lg py-2 px-3 flex flex-col items-center justify-center">
                    <Heart className="w-5 h-5 text-theme-rose fill-current mb-1" />
                    <span className="text-[10px] font-bold text-theme-rose uppercase tracking-widest">Period Mode</span>
                </div>
            </div>

            {/* Bottom Row: Call to Action Buttons */}
            <div className="mt-5 flex justify-between gap-3 relative z-10">
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate?.('duas');
                  }}
                  className="flex-1 bg-gradient-to-br from-theme-rose to-theme-orange text-white font-bold py-2.5 px-2 rounded-full text-xs flex items-center justify-center gap-2 hover:opacity-90 transition shadow-md"
                >
                    <Heart className="w-3.5 h-3.5 text-white" /> Open Duas & Dhikr
                </button>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => setIsModalOpen(true)}
            role="button"
            className="p-4 rounded-[1.25rem] bg-theme-surface-card border border-theme-accent/30 relative overflow-hidden shadow-[var(--nisa-shadow-card)] cursor-pointer"
          >
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-theme-accent opacity-10 rounded-full blur-2xl pointer-events-none"></div>

            {/* Top Row: Next Prayer & Countdown */}
            <div className="flex justify-between items-end relative z-10">
                <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Next Prayer</p>
                    <div className="flex items-baseline gap-3">
                        <h2 className="text-3xl font-bold text-theme-accent-strong">{loading ? '...' : nextPrayerName.toUpperCase()}</h2>
                        {activePrayerTime && !loading && (
                          <span className="text-sm font-medium text-theme-accent-strong">{activePrayerTime}</span>
                        )}
                    </div>
                </div>

                {/* Timer block */}
                <div className="bg-theme-surface-dark border border-theme-border rounded-lg py-1.5 px-2.5 flex flex-col items-center justify-center">
                    <div className="text-theme-accent-strong font-mono text-base font-bold tracking-widest">
                        {formatCountdown(timeLeft)}
                    </div>
                    <div className="flex justify-between w-full px-1 mt-0.5">
                        <span className="text-[9px] text-text-muted">H</span>
                        <span className="text-[9px] text-text-muted">M</span>
                        <span className="text-[9px] text-text-muted">S</span>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Call to Action Buttons */}
            <div className="mt-5 flex justify-between gap-3 relative z-10">
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate?.('qibla');
                  }}
                  className="flex-1 bg-gradient-to-br from-theme-accent-strong to-theme-accent text-theme-surface-dark font-bold py-2.5 px-2 rounded-full text-xs flex items-center justify-center gap-2 hover:opacity-90 transition shadow-md"
                >
                    <QiblaIcon className="w-3.5 h-3.5 text-theme-surface-dark" /> Qibla Direction
                </button>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(true);
                  }}
                  className="flex-1 bg-gradient-to-br from-theme-accent-strong to-theme-accent text-theme-surface-dark font-bold py-2.5 px-2 rounded-full text-xs flex items-center justify-center gap-2 hover:opacity-90 transition shadow-md"
                >
                    <Clock className="w-3.5 h-3.5 text-theme-surface-dark" /> Full Timetable
                </button>
            </div>
          </div>
        )}
      </div>

      {portalTarget &&
        createPortal(
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
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="absolute bottom-0 left-0 right-0 bg-theme-surface-elevated rounded-t-[32px] pt-4 pb-8 px-6 z-50 shadow-2xl border-t border-theme-border"
                >
                  <div className="flex justify-center mb-6">
                    <div className="w-12 h-1.5 bg-theme-surface-dark rounded-full" />
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                        Prayer Times
                      </h2>
                      <p className="text-sm text-text-tertiary font-medium">{dates.islamic || '...'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="w-8 h-8 bg-theme-surface-dark rounded-full flex items-center justify-center text-text-tertiary hover:bg-theme-surface-dark/80 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-theme-gold font-semibold mb-4">{madhabNote}</p>

                  <motion.div 
                    variants={listVariants}
                    initial="initial"
                    animate="animate"
                    className="flex flex-col mb-6 bg-theme-surface-dark/50 rounded-[24px] p-2 border border-theme-border"
                  >
                    {widgetPrayers.map((prayer, i) => (
                      <motion.div
                        variants={listItemVariants}
                        key={i}
                        className={`flex items-center justify-between p-3.5 rounded-[18px] transition-all duration-300 ${
                          prayer.active
                            ? 'bg-theme-accent-soft shadow-sm scale-[1.02] border border-theme-accent/10'
                            : prayer.passed
                              ? 'opacity-40 grayscale-[50%]'
                              : 'bg-transparent hover:bg-theme-surface-alt/50'
                        }`}
                      >
                        <span
                          className={`text-[15px] font-bold ${prayer.active ? 'text-theme-accent-strong' : 'text-text-primary'}`}
                        >
                          {prayer.name}
                          {prayer.name === 'Asr' && (
                            <span className="text-[10px] font-medium text-text-muted ml-1">
                              ({getMadhabLabel(profile.madhab)})
                            </span>
                          )}
                        </span>
                        <span
                          className={`text-[14px] font-bold tabular-nums ${prayer.active ? 'text-theme-accent-strong' : 'text-text-tertiary'}`}
                        >
                          {prayer.time}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.button
                    whileTap={buttonTap}
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setPendingProfileScreen('preferences');
                      onNavigate?.('profile');
                    }}
                    className="w-full mb-3 py-3 rounded-[18px] bg-theme-gold/10 text-[13px] font-bold text-theme-gold transition-colors"
                  >
                    Adjust madhab & calculation in Profile
                  </motion.button>

                  <motion.button
                    whileTap={buttonTap}
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      onNavigate?.('qibla');
                    }}
                    className="w-full bg-theme-accent-strong text-white py-4 rounded-[20px] flex items-center justify-center gap-2 font-bold shadow-[var(--nisa-shadow-accent)] transition-colors"
                  >
                    <QiblaIcon className="w-5 h-5" />
                    Open Qibla Compass
                  </motion.button>
                </motion.div>
              </React.Fragment>
            )}
          </AnimatePresence>,
          portalTarget
        )}
    </>
  );
}
