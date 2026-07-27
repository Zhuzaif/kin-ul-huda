import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, MapPin, Check, Bell, BellRing } from 'lucide-react';
import { useProfile } from '../contexts/ProfileContext';
import { setCachedCoords, computePrayerSchedule, formatPrayerTime } from '../utils/prayerTimes';
import type { Madhab } from '../types/profile';

type MadhhabKey = 'hanafi' | 'maliki' | 'shafi';
type Step = 0 | 1 | 2 | 3 | 4;

// ─── Islamic 8-point star SVG pattern ────────────────────────────────────────
function GeometricPattern({ opacity = 0.035 }: { opacity?: number }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      <defs>
        <pattern id="star8" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <g stroke="#F0A500" strokeWidth="0.6" fill="none">
            {/* 8-point star */}
            <polygon points="40,8 47,30 68,30 52,44 58,66 40,53 22,66 28,44 12,30 33,30" />
            <polygon points="40,18 44,32 58,32 47,40 51,55 40,47 29,55 33,40 22,32 36,32" />
            {/* Corner diamonds */}
            <polygon points="0,0 8,12 0,24 -8,12" />
            <polygon points="80,0 88,12 80,24 72,12" />
            <polygon points="0,80 8,92 0,104 -8,92" />
            <polygon points="80,80 88,92 80,104 72,92" />
            {/* Cross lines */}
            <line x1="40" y1="0" x2="40" y2="8" />
            <line x1="40" y1="72" x2="40" y2="80" />
            <line x1="0" y1="40" x2="8" y2="40" />
            <line x1="72" y1="40" x2="80" y2="40" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#star8)" />
    </svg>
  );
}

// ─── Radar pulse (location step) ─────────────────────────────────────────────
function RadarPulse() {
  return (
    <div className="relative flex items-center justify-center w-48 h-48 mx-auto">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{ borderColor: 'rgba(240,165,0,0.35)' }}
          initial={{ width: 40, height: 40, opacity: 0.9 }}
          animate={{ width: 192, height: 192, opacity: 0 }}
          transition={{
            duration: 2.4,
            delay: i * 0.8,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
      <motion.div
        className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #F0A500, #D08B00)',
          boxShadow: '0 0 32px rgba(240,165,0,0.5)',
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <MapPin size={22} color="#07070E" strokeWidth={2} />
      </motion.div>
    </div>
  );
}

// ─── Bell animation (notifications step) ─────────────────────────────────────
function BellAnimation() {
  return (
    <div className="relative flex items-center justify-center w-48 h-48 mx-auto">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ border: '1px solid rgba(240,165,0,0.3)' }}
          initial={{ width: 48, height: 48, opacity: 0.8 }}
          animate={{ width: 192, height: 192, opacity: 0 }}
          transition={{ duration: 2.2, delay: i * 0.75, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
      <motion.div
        className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #F0A500, #D08B00)',
          boxShadow: '0 0 36px rgba(240,165,0,0.45)',
        }}
        animate={{ rotate: [0, -12, 12, -8, 8, -4, 4, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
      >
        <BellRing size={28} color="#07070E" strokeWidth={2} />
      </motion.div>
    </div>
  );
}

// ─── Step 0 — Name ────────────────────────────────────────────────────────────
function NameStep({ onNext }: { onNext: (name: string) => void }) {
  const [val, setVal] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { setTimeout(() => ref.current?.focus(), 600); }, []);

  return (
    <div className="flex flex-col h-full px-8 pt-16 pb-10 justify-between">
      <div>
        {/* Decorative Arabic — "اسمك" (your name) */}
        <div
          className="text-8xl mb-6 select-none"
          style={{
            fontFamily: "'Amiri', serif",
            color: 'rgba(240,165,0,0.07)',
            lineHeight: 1,
            direction: 'rtl',
            userSelect: 'none',
          }}
        >
          اسمك
        </div>

        <p
          className="text-xs tracking-[0.3em] uppercase mb-4"
          style={{ fontFamily: "'Outfit', sans-serif", color: '#5A5A7A' }}
        >
          Step 1 of 4
        </p>

        <h1
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(2.4rem, 8vw, 4rem)',
            lineHeight: 1.05,
            color: '#F5F3EE',
            letterSpacing: '-0.03em',
          }}
        >
          What's your<br />
          <span style={{ color: '#F0A500' }}>name?</span>
        </h1>

        <p
          className="mt-4 text-sm leading-relaxed"
          style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300, color: '#5A5A7A' }}
        >
          We use it to personalise your daily prayer reminders.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="relative">
          <input
            ref={ref}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && val.trim() && onNext(val.trim())}
            placeholder="Your full name"
            className="w-full bg-transparent outline-none py-4 text-2xl border-b-2 transition-colors duration-300"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 600,
              borderColor: val.trim() ? '#F0A500' : 'rgba(255,255,255,0.1)',
              color: '#F5F3EE',
            }}
          />
          <AnimatePresence>
            {val.trim() && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute right-0 bottom-4"
              >
                <Check size={20} color="#F0A500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={!val.trim()}
          onClick={() => val.trim() && onNext(val.trim())}
          className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl font-semibold text-base transition-all duration-300 disabled:opacity-20"
          style={{
            fontFamily: "'Outfit', sans-serif",
            background: val.trim() ? 'linear-gradient(135deg, #F0A500 0%, #D08B00 100%)' : '#1A1A2E',
            color: val.trim() ? '#07070E' : '#5A5A7A',
            letterSpacing: '0.02em',
          }}
        >
          Continue <ArrowRight size={18} strokeWidth={2.5} />
        </motion.button>
      </div>
    </div>
  );
}

// ─── Step 1 — Location ────────────────────────────────────────────────────────
function LocationStep({
  name,
  onAllow,
  onSkip,
}: {
  name: string;
  onAllow: (coords: { lat: number; lng: number } | null) => void;
  onSkip: () => void;
}) {
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');

  function handleAllow() {
    setState('loading');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
          setState('done');
          setTimeout(() => onAllow(coords), 600);
        },
        () => {
          // Permission denied or error — still proceed
          setState('done');
          setTimeout(() => onAllow(null), 600);
        }
      );
    } else {
      setState('done');
      setTimeout(() => onAllow(null), 600);
    }
  }

  return (
    <div className="flex flex-col h-full px-8 pt-16 pb-10 justify-between">
      <div>
        <div
          className="text-8xl mb-6 select-none"
          style={{
            fontFamily: "'Amiri', serif",
            color: 'rgba(240,165,0,0.07)',
            lineHeight: 1,
            direction: 'rtl',
          }}
        >
          موقعك
        </div>
        <p
          className="text-xs tracking-[0.3em] uppercase mb-4"
          style={{ fontFamily: "'Outfit', sans-serif", color: '#5A5A7A' }}
        >
          Step 2 of 4
        </p>
        <h1
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(2.4rem, 8vw, 4rem)',
            lineHeight: 1.05,
            color: '#F5F3EE',
            letterSpacing: '-0.03em',
          }}
        >
          Enable your<br />
          <span style={{ color: '#F0A500' }}>location</span>
        </h1>
        <p
          className="mt-4 text-sm leading-relaxed"
          style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300, color: '#5A5A7A' }}
        >
          Hey {name || 'there'} — accurate prayer times need your coordinates. We never store or share them.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <RadarPulse />

        <div className="flex flex-col gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleAllow}
            disabled={state !== 'idle'}
            className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl font-semibold text-base"
            style={{
              fontFamily: "'Outfit', sans-serif",
              background: state === 'done'
                ? 'linear-gradient(135deg, #2ECC71, #1DA85A)'
                : 'linear-gradient(135deg, #F0A500 0%, #D08B00 100%)',
              color: '#07070E',
              letterSpacing: '0.02em',
            }}
          >
            {state === 'idle' && <><MapPin size={18} strokeWidth={2} /> Allow Location</>}
            {state === 'loading' && (
              <motion.div
                className="w-5 h-5 rounded-full border-2 border-current border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />
            )}
            {state === 'done' && <><Check size={18} strokeWidth={2.5} /> Location Granted</>}
          </motion.button>
          <button
            onClick={onSkip}
            className="text-center py-3 text-sm transition-colors"
            style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300, color: '#5A5A7A' }}
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Notification options ─────────────────────────────────────────────────────
const NOTIF_OPTIONS = [
  {
    id: 'adhan',
    icon: BellRing,
    title: 'Adhan Alerts',
    arabic: 'الأذان',
    desc: 'Audio call to prayer at each of the five daily prayer times.',
    color: '#F0A500',
    glow: 'rgba(240,165,0,0.2)',
  },
  {
    id: 'reminders',
    icon: Bell,
    title: 'Daily Reminders',
    arabic: 'تذكير',
    desc: 'Gentle nudges 15 minutes before each prayer begins.',
    color: '#7B5EA7',
    glow: 'rgba(123,94,167,0.2)',
  },
] as const;

// ─── Step 2 — Notifications ───────────────────────────────────────────────────
function NotificationStep({
  onNext,
  onSkip,
}: {
  onNext: (prefs: { adhan: boolean; reminders: boolean }) => void;
  onSkip: () => void;
}) {
  const [enabled, setEnabled] = useState<Set<string>>(new Set(['adhan', 'reminders']));
  const [requesting, setRequesting] = useState(false);

  function toggle(id: string) {
    setEnabled((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleEnable() {
    setRequesting(true);
    try {
      if ('Notification' in window) await Notification.requestPermission();
    } catch (_) { }
    const prefs = { adhan: enabled.has('adhan'), reminders: enabled.has('reminders') };
    setTimeout(() => onNext(prefs), 600);
  }

  return (
    <div className="flex flex-col h-full px-8 pt-14 pb-10 justify-between">
      <div>
        <div
          className="text-8xl mb-4 select-none"
          style={{
            fontFamily: "'Amiri', serif",
            color: 'rgba(240,165,0,0.07)',
            lineHeight: 1,
            direction: 'rtl',
          }}
        >
          إشعارات
        </div>
        <p
          className="text-xs tracking-[0.3em] uppercase mb-3"
          style={{ fontFamily: "'Outfit', sans-serif", color: '#5A5A7A' }}
        >
          Step 3 of 4
        </p>
        <h1
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(2.2rem, 7vw, 3.4rem)',
            lineHeight: 1.05,
            color: '#F5F3EE',
            letterSpacing: '-0.03em',
          }}
        >
          Never miss<br />
          <span style={{ color: '#F0A500' }}>a prayer</span>
        </h1>
        <p
          className="mt-3 text-sm"
          style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300, color: '#5A5A7A' }}
        >
          Choose which notifications to receive.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <BellAnimation />

        {/* Toggle tiles */}
        <div className="flex flex-col gap-3">
          {NOTIF_OPTIONS.map((opt) => {
            const active = enabled.has(opt.id);
            const Icon = opt.icon;
            return (
              <motion.button
                key={opt.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggle(opt.id)}
                className="flex items-center gap-4 w-full rounded-2xl px-5 py-4 text-left transition-all duration-250"
                style={{
                  background: active
                    ? `linear-gradient(135deg, ${opt.color}18, ${opt.color}08)`
                    : 'rgba(255,255,255,0.03)',
                  border: active
                    ? `1.5px solid ${opt.color}55`
                    : '1.5px solid rgba(255,255,255,0.06)',
                  boxShadow: active ? `0 0 24px ${opt.glow}` : 'none',
                }}
              >
                {/* Icon badge */}
                <div
                  className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-250"
                  style={{
                    background: active ? `${opt.color}22` : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${active ? opt.color + '44' : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  <Icon size={20} strokeWidth={1.8} style={{ color: active ? opt.color : '#5A5A7A' }} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-sm font-semibold"
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        color: active ? opt.color : '#F5F3EE',
                        transition: 'color 0.25s',
                      }}
                    >
                      {opt.title}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Amiri', serif",
                        fontSize: '0.95rem',
                        color: active ? `${opt.color}88` : 'rgba(245,243,238,0.15)',
                        transition: 'color 0.25s',
                        direction: 'rtl',
                      }}
                    >
                      {opt.arabic}
                    </span>
                  </div>
                  <p
                    className="text-xs mt-0.5 leading-relaxed"
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 300,
                      color: active ? 'rgba(245,243,238,0.45)' : '#5A5A7A',
                      transition: 'color 0.25s',
                    }}
                  >
                    {opt.desc}
                  </p>
                </div>

                {/* Custom toggle pill */}
                <div
                  className="shrink-0 w-11 h-6 rounded-full relative transition-all duration-300"
                  style={{
                    background: active
                      ? `linear-gradient(135deg, ${opt.color}, ${opt.color}CC)`
                      : 'rgba(255,255,255,0.08)',
                  }}
                >
                  <motion.div
                    className="absolute top-0.5 w-5 h-5 rounded-full"
                    animate={{ left: active ? '22px' : '2px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    style={{ background: active ? '#07070E' : '#3A3A5A' }}
                  />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-1">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleEnable}
            disabled={requesting}
            className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl font-semibold text-base"
            style={{
              fontFamily: "'Outfit', sans-serif",
              background: enabled.size > 0
                ? 'linear-gradient(135deg, #F0A500 0%, #D08B00 100%)'
                : '#1A1A2E',
              color: enabled.size > 0 ? '#07070E' : '#5A5A7A',
              letterSpacing: '0.02em',
            }}
          >
            {requesting ? (
              <motion.div
                className="w-5 h-5 rounded-full border-2 border-current border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />
            ) : (
              <>{enabled.size > 0 ? 'Enable Notifications' : 'Continue'} <ArrowRight size={18} strokeWidth={2.5} /></>
            )}
          </motion.button>
          <button
            onClick={onSkip}
            className="text-center py-2 text-sm transition-colors"
            style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300, color: '#5A5A7A' }}
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Madhab data ──────────────────────────────────────────────────────────────
const MADHABS: {
  key: MadhhabKey;
  name: string;
  arabic: string;
  sub: string;
  color: string;
  glow: string;
}[] = [
    {
      key: 'hanafi',
      name: 'Hanafi',
      arabic: 'حنفي',
      sub: 'Shadow = 2× object length',
      color: '#F0A500',
      glow: 'rgba(240,165,0,0.25)',
    },
    {
      key: 'maliki',
      name: 'Maliki',
      arabic: 'مالكي',
      sub: 'Shadow = 1× object length',
      color: '#7B5EA7',
      glow: 'rgba(123,94,167,0.25)',
    },
    {
      key: 'shafi',
      name: "Shafi'i",
      arabic: 'شافعي',
      sub: 'Shadow = 1× object length',
      color: '#4ECDC4',
      glow: 'rgba(78,205,196,0.25)',
    },
  ];

// ─── Step 3 — Madhab ─────────────────────────────────────────────────────────
function MadhabStep({ onNext }: { onNext: (m: MadhhabKey) => void }) {
  const [selected, setSelected] = useState<MadhhabKey | null>(null);

  return (
    <div className="flex flex-col h-full px-6 pt-14 pb-10 justify-between">
      <div className="mb-6">
        <div
          className="text-8xl mb-4 select-none"
          style={{
            fontFamily: "'Amiri', serif",
            color: 'rgba(240,165,0,0.07)',
            lineHeight: 1,
            direction: 'rtl',
          }}
        >
          المذهب
        </div>
        <p
          className="text-xs tracking-[0.3em] uppercase mb-3"
          style={{ fontFamily: "'Outfit', sans-serif", color: '#5A5A7A' }}
        >
          Step 4 of 4
        </p>
        <h1
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(2rem, 7vw, 3.2rem)',
            lineHeight: 1.05,
            color: '#F5F3EE',
            letterSpacing: '-0.03em',
          }}
        >
          Your school of<br />
          <span style={{ color: '#F0A500' }}>jurisprudence</span>
        </h1>
        <p
          className="mt-3 text-sm"
          style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300, color: '#5A5A7A' }}
        >
          Determines when Asr prayer begins.
        </p>
      </div>

      {/* 3 big tappable tiles */}
      <div className="grid grid-cols-3 gap-3 flex-1 mb-6" style={{ maxHeight: 260 }}>
        {MADHABS.map((m) => {
          const active = selected === m.key;
          return (
            <motion.button
              key={m.key}
              whileTap={{ scale: 0.94 }}
              onClick={() => setSelected(m.key)}
              className="flex flex-col items-center justify-center rounded-2xl relative overflow-hidden"
              style={{
                background: active
                  ? `linear-gradient(145deg, ${m.color}22, ${m.color}0A)`
                  : 'rgba(255,255,255,0.03)',
                border: active ? `1.5px solid ${m.color}` : '1.5px solid rgba(255,255,255,0.06)',
                boxShadow: active ? `0 0 32px ${m.glow}` : 'none',
                transition: 'all 0.25s ease',
                minHeight: 160,
              }}
            >
              {/* Big Arabic */}
              <span
                style={{
                  fontFamily: "'Amiri', serif",
                  fontSize: '2.8rem',
                  lineHeight: 1.1,
                  color: active ? m.color : 'rgba(245,243,238,0.2)',
                  transition: 'color 0.25s',
                  direction: 'rtl',
                }}
              >
                {m.arabic}
              </span>
              <span
                className="mt-2 text-xs font-semibold tracking-wider"
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  color: active ? m.color : '#5A5A7A',
                  transition: 'color 0.25s',
                  letterSpacing: '0.06em',
                }}
              >
                {m.name.toUpperCase()}
              </span>
              <span
                className="mt-1.5 text-center px-2"
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 300,
                  fontSize: '0.65rem',
                  lineHeight: 1.4,
                  color: active ? 'rgba(245,243,238,0.55)' : 'rgba(90,90,122,0.6)',
                  transition: 'color 0.25s',
                }}
              >
                {m.sub}
              </span>

              {active && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: m.color }}
                >
                  <Check size={11} color="#07070E" strokeWidth={3} />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        disabled={!selected}
        onClick={() => selected && onNext(selected)}
        className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl font-semibold text-base transition-all duration-300 disabled:opacity-20"
        style={{
          fontFamily: "'Outfit', sans-serif",
          background: selected ? 'linear-gradient(135deg, #F0A500 0%, #D08B00 100%)' : '#1A1A2E',
          color: selected ? '#07070E' : '#5A5A7A',
          letterSpacing: '0.02em',
        }}
      >
        Confirm <ArrowRight size={18} strokeWidth={2.5} />
      </motion.button>
    </div>
  );
}

// ─── Step 4 — Done ────────────────────────────────────────────────────────────
function DoneStep({
  name,
  madhab,
  locationCoords,
  onEnter,
}: {
  name: string;
  madhab: MadhhabKey;
  locationCoords: { lat: number; lng: number } | null;
  onEnter: () => void;
}) {
  const m = MADHABS.find((x) => x.key === madhab)!;
  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  // Compute live prayer times based on collected data
  const [times, setTimes] = useState<string[]>(['--:--', '--:--', '--:--', '--:--', '--:--']);
  useEffect(() => {
    const coords = locationCoords ?? { lat: 21.4225, lng: 39.8262 }; // fallback to Mecca
    try {
      const schedule = computePrayerSchedule(coords.lat, coords.lng, madhab, 'karachi');
      setTimes(schedule.map((s) => {
        // Format to HH:MM (24h) for the preview card
        const d = s.dateObj;
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      }));
    } catch {
      // Keep default times on error
    }
  }, [locationCoords, madhab]);

  return (
    <div className="flex flex-col h-full px-8 pt-14 pb-10">
      <div className="mb-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xs tracking-[0.3em] uppercase mb-3"
          style={{ fontFamily: "'Outfit', sans-serif", color: '#5A5A7A' }}
        >
          All set
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(2.4rem, 8vw, 4rem)',
            lineHeight: 1.05,
            color: '#F5F3EE',
            letterSpacing: '-0.03em',
          }}
        >
          Ahlan,<br />
          <span style={{ color: '#F0A500' }}>{name}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-3 text-sm"
          style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300, color: '#5A5A7A' }}
        >
          {m.name} method · May your prayers be accepted.
        </motion.p>
      </div>

      {/* Prayer times preview card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="rounded-2xl overflow-hidden mb-6 flex-1"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <span className="text-xs tracking-widest uppercase" style={{ fontFamily: "'Outfit', sans-serif", color: '#5A5A7A' }}>
            Today&apos;s Times
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              fontFamily: "'Outfit', sans-serif",
              background: `${m.color}22`,
              color: m.color,
              border: `1px solid ${m.color}44`,
            }}
          >
            {m.name}
          </span>
        </div>
        {prayers.map((p, i) => (
          <motion.div
            key={p}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 + i * 0.07 }}
            className="flex items-center justify-between px-5 py-3.5"
            style={{
              borderBottom: i < prayers.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}
          >
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 400,
                fontSize: '0.9rem',
                color: i === 2 ? m.color : '#F5F3EE',
              }}
            >
              {p}
            </span>
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600,
                fontSize: '0.9rem',
                color: i === 2 ? m.color : 'rgba(245,243,238,0.6)',
                letterSpacing: '0.06em',
              }}
            >
              {times[i]}
            </span>
          </motion.div>
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95 }}
        whileTap={{ scale: 0.97 }}
        onClick={onEnter}
        className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl font-semibold text-base"
        style={{
          fontFamily: "'Outfit', sans-serif",
          background: 'linear-gradient(135deg, #F0A500 0%, #D08B00 100%)',
          color: '#07070E',
          letterSpacing: '0.02em',
        }}
      >
        Enter App <ArrowRight size={18} strokeWidth={2.5} />
      </motion.button>
    </div>
  );
}

// ─── Root Onboarding Orchestrator ─────────────────────────────────────────────
export default function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const { updateProfile } = useProfile();
  const [step, setStep] = useState<Step>(0);
  const [dir, setDir] = useState(1);
  const [name, setName] = useState('');
  const [madhab, setMadhab] = useState<MadhhabKey>('hanafi');
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null);

  const next = useCallback((s: Step) => {
    setDir(1);
    setStep(s);
  }, []);

  const handleComplete = useCallback(() => {
    // Sync all collected data to profile
    const profileUpdate: Record<string, unknown> = {
      name,
      madhab: madhab as Madhab,
      onboardingCompleted: true,
    };

    if (locationCoords) {
      profileUpdate.locationCoords = locationCoords;
      setCachedCoords(locationCoords);
    }

    updateProfile(profileUpdate as any);
    onComplete();
  }, [name, madhab, locationCoords, updateProfile, onComplete]);

  const stepVariants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: '0%', opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  // Arc progress
  const total = 4;
  const progress = Math.min(step / total, 1);
  const r = 18;
  const circ = 2 * Math.PI * r;
  const dash = circ * progress;

  return (
    <div
      className="size-full min-h-screen flex items-center justify-center"
      style={{ background: '#07070E' }}
    >
      <div className="relative w-full max-w-sm h-screen max-h-[820px] overflow-hidden flex flex-col">
        {/* Background pattern */}
        <GeometricPattern opacity={0.04} />

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-8 pt-6 pb-0 shrink-0">
          {/* Arc progress */}
          <div className="flex items-center gap-3">
            <svg width="44" height="44" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
              <motion.circle
                cx="22"
                cy="22"
                r={r}
                fill="none"
                stroke="#F0A500"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={`${circ}`}
                initial={{ strokeDashoffset: circ }}
                animate={{ strokeDashoffset: circ - dash }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{ rotate: '-90deg', transformOrigin: '22px 22px' }}
              />
              <text
                x="22"
                y="27"
                textAnchor="middle"
                fill="#F0A500"
                fontSize="11"
                fontFamily="'Outfit', sans-serif"
                fontWeight="600"
              >
                {step < 4 ? `${step + 1}/4` : '✓'}
              </text>
            </svg>
            <span
              className="text-xs tracking-[0.2em] uppercase"
              style={{ fontFamily: "'Outfit', sans-serif", color: '#5A5A7A' }}
            >
              {['Name', 'Location', 'Notifications', 'Method', 'Ready'][step]}
            </span>
          </div>

          {/* Logo mark */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(240,165,0,0.12)', border: '1px solid rgba(240,165,0,0.25)' }}
          >
            <span style={{ fontFamily: "'Amiri', serif", fontSize: '1rem', color: '#F0A500' }}>☽</span>
          </div>
        </div>

        {/* Card area */}
        <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease: [0.4, 0, 0.15, 1] }}
              className="absolute inset-0 flex flex-col min-h-full"
            >
              {step === 0 && (
                <NameStep onNext={(n) => { setName(n); next(1); }} />
              )}
              {step === 1 && (
                <LocationStep
                  name={name}
                  onAllow={(coords) => {
                    if (coords) setLocationCoords(coords);
                    next(2);
                  }}
                  onSkip={() => next(2)}
                />
              )}
              {step === 2 && (
                <NotificationStep
                  onNext={(prefs) => {
                    updateProfile({
                      prayerReminders: prefs.adhan || prefs.reminders,
                      notificationPrefs: prefs,
                    });
                    next(3);
                  }}
                  onSkip={() => next(3)}
                />
              )}
              {step === 3 && (
                <MadhabStep onNext={(m) => { setMadhab(m); next(4); }} />
              )}
              {step === 4 && (
                <DoneStep
                  name={name}
                  madhab={madhab}
                  locationCoords={locationCoords}
                  onEnter={handleComplete}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
