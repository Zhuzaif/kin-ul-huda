import React, { useState, useRef, useEffect } from 'react';
import { Heart, Leaf, Droplets, CalendarPlus, ChevronDown, Check } from 'lucide-react';
import { usePurityTracker } from '../contexts/PurityTrackerContext';
import type { PurityStatus } from '../types/purity';

const STATUS_OPTIONS: Array<{
  key: PurityStatus;
  label: string;
  sub: string;
  dot: string;
  activeBg: string;
  activeBorder: string;
  activeText: string;
}> = [
  {
    key: 'haiz',
    label: 'Haiz',
    sub: 'Period',
    dot: 'bg-theme-rose',
    activeBg: 'bg-theme-rose/10',
    activeBorder: 'border-theme-rose/30',
    activeText: 'text-theme-rose',
  },
  {
    key: 'istihada',
    label: 'Istihada',
    sub: 'Irregular',
    dot: 'bg-text-muted',
    activeBg: 'bg-theme-surface-alt',
    activeBorder: 'border-text-muted/30',
    activeText: 'text-text-secondary',
  },
  {
    key: 'taharah',
    label: 'Taharah',
    sub: 'Pure',
    dot: 'bg-theme-accent',
    activeBg: 'bg-theme-accent/10',
    activeBorder: 'border-theme-accent/30',
    activeText: 'text-theme-accent',
  },
];

function getGuidance(status: PurityStatus, dayInPhase: number, daysUntil: number | null) {
  if (status === 'haiz') {
    return {
      icon: Heart,
      iconColor: 'text-theme-rose',
      title: 'Salah is paused',
      body: `Day ${dayInPhase} of Haiz — focus on dhikr, duas, and listening to the Quran. You're still growing spiritually.`,
      bg: 'bg-theme-rose/10',
      border: 'border-theme-rose/20',
    };
  }
  if (status === 'istihada') {
    return {
      icon: Droplets,
      iconColor: 'text-text-tertiary',
      title: 'Istihada — Salah continues',
      body: 'Irregular bleeding does not pause Salah or fasting. Perform Wudu for each prayer and continue worship as normal. Consult a scholar for your specific situation.',
      bg: 'bg-theme-surface-alt',
      border: 'border-theme-border',
    };
  }
  if (!daysUntil && dayInPhase === 0) {
    return {
      icon: CalendarPlus,
      iconColor: 'text-theme-accent',
      title: 'Welcome to your tracker',
      body: 'Log when your period starts to track Haiz, Taharah, and get personalised guidance.',
      bg: 'bg-theme-accent-soft',
      border: 'border-theme-accent/20',
    };
  }
  return {
    icon: Leaf,
    iconColor: 'text-theme-accent',
    title: 'You are in Taharah',
    body: daysUntil
      ? `Salah and fasting apply as usual. Next period expected in ~${daysUntil} day${daysUntil === 1 ? '' : 's'}.`
      : 'Salah and fasting apply as usual. You may be due for your next cycle — log when period starts.',
    bg: 'bg-theme-accent-soft',
    border: 'border-theme-accent/20',
  };
}

function ringStroke(status: PurityStatus): string {
  if (status === 'haiz') return 'var(--color-theme-rose)';
  if (status === 'istihada') return 'var(--color-text-muted)';
  return 'var(--color-theme-accent)';
}

export default function PurityTrackerCard() {
  const { snapshot, setStatus, logPeriodStartToday, clearManualStatus } = usePurityTracker();
  const { status, dayInPhase, ringProgress, phaseLabel, isManual, daysUntilPeriodEstimate, lastPeriodStart } =
    snapshot;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen]);

  const guidance = getGuidance(status, dayInPhase, daysUntilPeriodEstimate);
  const GuidanceIcon = guidance.icon;
  const showDay = dayInPhase > 0;
  const activeOpt = STATUS_OPTIONS.find((o) => o.key === status)!;

  return (
    <div className="px-5 mb-5 nisa-slide-up">
      {/* ── Main tracker card ── */}
      <div className="rounded-[28px] bg-theme-surface-card border border-theme-border shadow-[var(--nisa-shadow-card)] overflow-hidden">
        <div className="p-5 pb-4">
          {/* Header row */}
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-[17px] font-bold text-text-primary tracking-tight">My Cycle</h2>
              {lastPeriodStart && (
                <p className="text-[11px] font-medium text-text-muted mt-0.5">
                  Started{' '}
                  {new Date(lastPeriodStart + 'T12:00:00').toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                  })}
                  {isManual && (
                    <button
                      type="button"
                      onClick={clearManualStatus}
                      className="ml-1.5 text-theme-orange font-semibold hover:underline"
                    >
                      · Auto
                    </button>
                  )}
                </p>
              )}
            </div>
            {showDay && (
              <span className="text-[11px] font-bold text-text-tertiary bg-theme-surface-dark px-3 py-1 rounded-full">
                Day {dayInPhase}
              </span>
            )}
          </div>

          {/* Ring + Status Dropdown */}
          <div className="flex items-center gap-5 my-5">
            {/* Progress Ring — number only, no badge */}
            <div className="relative w-[100px] h-[100px] flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="var(--color-theme-surface-dark)"
                  strokeWidth="2.5"
                />
                <circle
                  className="nisa-ring-animate"
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke={ringStroke(status)}
                  strokeWidth="2.5"
                  strokeDasharray={`${ringProgress}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[32px] font-bold text-text-primary tabular-nums leading-none">
                  {showDay ? dayInPhase : '—'}
                </span>
              </div>
            </div>

            {/* Status Dropdown */}
            <div className="flex-1 flex flex-col gap-2.5" ref={dropdownRef}>
              <div className="relative">
                {/* Current status display / toggle button */}
                <button
                  type="button"
                  onClick={() => setDropdownOpen((p) => !p)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border transition-all duration-200 active:scale-[0.97] ${activeOpt.activeBg} ${activeOpt.activeBorder}`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${activeOpt.dot} flex-shrink-0`} />
                  <div className="flex-1 text-left">
                    <span className={`text-[13px] font-bold leading-none ${activeOpt.activeText}`}>
                      {activeOpt.label}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-text-muted transition-transform duration-200 ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-theme-surface-card rounded-2xl border border-theme-border shadow-[0_8px_24px_rgba(0,0,0,0.08)] z-20 overflow-hidden">
                    {STATUS_OPTIONS.map((opt) => {
                      const isCurrent = status === opt.key;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => {
                            setStatus(opt.key);
                            setDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3.5 py-3 transition-colors duration-150 ${
                            isCurrent ? 'bg-theme-surface-alt' : 'hover:bg-theme-surface-alt'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full ${opt.dot} flex-shrink-0`} />
                          <span className={`text-[13px] font-semibold flex-1 text-left ${
                            isCurrent ? opt.activeText : 'text-text-secondary'
                          }`}>
                            {opt.label}
                          </span>
                          <span className="text-[10px] text-text-muted">{opt.sub}</span>
                          {isCurrent && <Check className="w-3.5 h-3.5 text-theme-accent ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Period started today button */}
              <button
                type="button"
                onClick={logPeriodStartToday}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-theme-orange/10 border border-theme-orange/20 text-[12px] font-semibold text-theme-orange active:scale-[0.98] transition-all hover:bg-theme-orange/20"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                Period started today
              </button>
            </div>
          </div>
        </div>

        {/* Guidance message — pinned at bottom of card */}
        <div className={`px-5 py-4 ${guidance.bg} border-t ${guidance.border} flex gap-3`}>
          <div className="w-9 h-9 rounded-xl bg-theme-surface-card flex items-center justify-center flex-shrink-0 shadow-sm">
            <GuidanceIcon className={`w-4 h-4 ${guidance.iconColor}`} />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-text-primary mb-0.5">{guidance.title}</p>
            <p className="text-[11.5px] text-text-tertiary leading-relaxed">{guidance.body}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
