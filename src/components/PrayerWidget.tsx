import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Clock, Heart, X } from 'lucide-react';
import { usePeriodMode } from '../contexts/PeriodModeContext';
import { useProfile } from '../contexts/ProfileContext';
import { motion, AnimatePresence } from 'motion/react';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { getMadhabLabel, getCalculationMethodLabel } from '../utils/prayerTimes';

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
      <path d="M8.5 11H15.5" stroke="#D4AF37" strokeWidth="1.5" />
      <path d="M12 3.5L13.5 6.5H10.5L12 3.5Z" fill="#D4AF37" />
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

    const islamicParts = new Intl.DateTimeFormat('en-US-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).formatToParts(today);
    const iDay = islamicParts.find((p) => p.type === 'day')?.value;
    const iMonth = islamicParts.find((p) => p.type === 'month')?.value;
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
        <div
          role="button"
          tabIndex={0}
          onClick={() => !isPeriodMode && setIsModalOpen(true)}
          className={`w-full text-left rounded-[32px] p-6 shadow-[var(--nisa-shadow-accent)] relative overflow-hidden transition-all duration-500 active:scale-[0.98] cursor-pointer border ${
            isPeriodMode
              ? 'bg-gradient-to-br from-theme-rose/20 to-theme-rose/10 cursor-default border-theme-rose/20'
              : 'bg-gradient-to-br from-theme-accent-soft to-theme-accent-soft-dark border-theme-border/50 hover:border-theme-accent/30'
          }`}
        >
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-theme-surface-card/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-5">
              <div>
                <p
                  className={`text-sm font-medium uppercase tracking-wide ${isPeriodMode ? 'text-theme-orange/80' : 'text-theme-accent/70'}`}
                >
                  {dates.gregorian || '...'}
                </p>
                <p
                  className={`text-xs font-semibold mt-0.5 ${isPeriodMode ? 'text-theme-orange/70' : 'text-theme-accent/60'}`}
                >
                  {dates.islamic || '...'}
                </p>
              </div>
              {isPeriodMode ? (
                <div
                  className="w-10 h-10 bg-theme-surface-card/50 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xs"
                  title="Period Mode Active"
                >
                  <Heart className="w-5 h-5 text-theme-rose fill-current" />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate?.('qibla');
                  }}
                  title="Find Qibla Direction"
                  className="w-10 h-10 bg-theme-surface-card/50 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xs hover:bg-theme-surface-card/70 active:scale-95 transition-all group"
                >
                  <QiblaIcon className="w-5 h-5 text-theme-accent-strong group-hover:scale-110 transition-transform" />
                </button>
              )}
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
                      <p className="text-sm font-medium text-theme-orange/80 mb-1">Current Focus</p>
                      <h3 className="text-3xl font-bold text-text-primary tracking-tight">Dhikr Time</h3>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`prayer-${nextPrayerName}-${profile.madhab}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-sm font-medium text-theme-accent/80 mb-1">Next Prayer</p>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl sm:text-4xl font-bold text-theme-accent-strong tracking-tight">
                          {loading ? '...' : nextPrayerName}
                        </h3>
                        {activePrayerTime && !loading && (
                          <span className="text-xs font-bold text-theme-accent-strong bg-theme-surface-card/50 px-2 py-0.5 rounded-lg shadow-2xs">
                            {activePrayerTime}
                          </span>
                        )}
                      </div>
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
                  className={`flex items-center gap-1.5 bg-theme-surface-card/60 backdrop-blur-sm px-3 pt-1.5 pb-1 rounded-xl shadow-sm ${isPeriodMode ? 'text-theme-orange' : 'text-theme-accent-strong'}`}
                >
                  {isPeriodMode ? (
                    <span className="text-sm font-semibold tracking-tight pb-0.5 px-2">
                      SubhanAllah
                    </span>
                  ) : (
                    <>
                      <Clock className="w-4 h-4 mb-0.5 opacity-80 text-theme-accent-strong" />
                      <span className="text-base sm:text-lg font-bold tabular-nums tracking-tight font-mono text-theme-accent-strong">
                        {formatCountdown(timeLeft)}
                      </span>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {!isPeriodMode && (
              <div className="mt-4 pt-3.5 border-t border-theme-accent/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate?.('qibla');
                  }}
                  className="flex items-center gap-2 bg-theme-surface-card/70 hover:bg-theme-surface-card text-theme-accent-strong px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs active:scale-95 border border-theme-border"
                >
                  <QiblaIcon className="w-4 h-4 text-theme-gold" />
                  <span>Qibla Direction</span>
                </button>

                <span className="text-[11px] font-semibold text-theme-accent/70">
                  Tap card for timetable
                </span>
              </div>
            )}
          </div>
        </div>
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

                  <div className="flex flex-col mb-6 bg-theme-surface-dark/50 rounded-[24px] p-2 border border-theme-border">
                    {widgetPrayers.map((prayer, i) => (
                      <div
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
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      onNavigate?.('profile');
                    }}
                    className="w-full mb-3 py-3 rounded-[18px] bg-theme-gold/10 text-[13px] font-bold text-theme-gold active:scale-[0.98] transition-transform"
                  >
                    Adjust madhab & calculation in Profile
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      onNavigate?.('qibla');
                    }}
                    className="w-full bg-theme-accent-strong text-white py-4 rounded-[20px] flex items-center justify-center gap-2 font-bold shadow-[var(--nisa-shadow-accent)] active:scale-[0.98] transition-transform"
                  >
                    <QiblaIcon className="w-5 h-5 text-theme-gold" />
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
