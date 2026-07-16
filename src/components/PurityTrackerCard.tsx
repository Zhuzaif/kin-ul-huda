import React from 'react';
import { Heart, Leaf, Droplets, CalendarPlus } from 'lucide-react';
import { usePurityTracker } from '../contexts/PurityTrackerContext';
import type { PurityStatus } from '../types/purity';

const LEGEND: Array<{
  key: PurityStatus;
  label: string;
  sub: string;
  color: string;
}> = [
  { key: 'haiz', label: 'Haiz', sub: 'Period', color: 'bg-soft-pink-dark' },
  { key: 'istihada', label: 'Istihada', sub: 'Irregular', color: 'bg-gray-300' },
  { key: 'taharah', label: 'Taharah', sub: 'Pure', color: 'bg-soft-mint-dark' },
];

function getStatusMessage(status: PurityStatus, dayInPhase: number, daysUntil: number | null) {
  if (status === 'haiz') {
    return {
      title: 'Salah is paused',
      body: `Day ${dayInPhase} of Haiz. Focus on dhikr, duas, and listening to the Quran. You're still growing spiritually.`,
      icon: Heart,
      iconClass: 'text-soft-pink-dark fill-current',
      boxClass: 'from-light-peach/80 to-soft-pink/60',
    };
  }
  if (status === 'istihada') {
    return {
      title: 'Istihada — Salah paused',
      body: 'Irregular bleeding noted. Consult your scholar for specific rulings. Dhikr and Quran listening remain encouraged.',
      icon: Droplets,
      iconClass: 'text-gray-500',
      boxClass: 'from-gray-100/90 to-soft-pink/40',
    };
  }
  if (!daysUntil && dayInPhase === 0) {
    return {
      title: 'Welcome to your tracker',
      body: 'Log when your period starts to track Haiz, Taharah, and get personalised guidance.',
      icon: CalendarPlus,
      iconClass: 'text-[#2B604A]',
      boxClass: 'from-soft-mint/80 to-muted-gold-light/60',
    };
  }
  return {
    title: 'You are in Taharah',
    body: daysUntil
      ? `Salah and fasting apply as usual. Next period expected in about ${daysUntil} day${daysUntil === 1 ? '' : 's'}.`
      : 'Salah and fasting apply as usual. You may be due for your next cycle — log when period starts.',
    icon: Leaf,
    iconClass: 'text-[#2B604A]',
    boxClass: 'from-soft-mint/80 to-muted-gold-light/60',
  };
}

function ringColor(status: PurityStatus): string {
  if (status === 'haiz') return 'text-soft-pink-dark';
  if (status === 'istihada') return 'text-gray-300';
  return 'text-soft-mint-dark';
}

function badgeStyles(status: PurityStatus): string {
  if (status === 'haiz') return 'text-soft-pink-dark bg-soft-pink border-soft-pink-dark/25';
  if (status === 'istihada') return 'text-gray-600 bg-gray-100 border-gray-200';
  return 'text-[#2B604A] bg-soft-mint border-soft-mint-dark/30';
}

function dayBadgeStyles(status: PurityStatus): string {
  if (status === 'haiz') return 'text-[#2B604A] bg-soft-mint border-soft-mint-dark/30';
  if (status === 'istihada') return 'text-gray-600 bg-gray-100 border-gray-200';
  return 'text-[#D98A5B] bg-muted-gold-light border-muted-gold/30';
}

export default function PurityTrackerCard() {
  const { snapshot, setStatus, logPeriodStartToday, clearManualStatus } = usePurityTracker();
  const { status, dayInPhase, ringProgress, phaseLabel, isManual, daysUntilPeriodEstimate, lastPeriodStart } =
    snapshot;

  const message = getStatusMessage(status, dayInPhase, daysUntilPeriodEstimate);
  const MessageIcon = message.icon;
  const showDay = dayInPhase > 0;
  const centerValue = showDay ? dayInPhase : '—';

  return (
    <div className="px-6 mb-6">
      <div className="relative overflow-hidden rounded-[32px] bg-white/60 backdrop-blur-sm border border-white/60 shadow-[0_4px_28px_rgba(0,0,0,0.04)]">
        <div className="absolute inset-0 bg-gradient-to-br from-soft-pink/40 via-white/50 to-light-peach/30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-muted-gold-light/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D98A5B] block mb-1">
                Purity Dashboard
              </span>
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">My Cycle</h2>
            </div>
            {showDay && (
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border ${dayBadgeStyles(status)}`}
              >
                Day {dayInPhase}
              </span>
            )}
          </div>

          {lastPeriodStart && (
            <p className="text-[11px] font-medium text-gray-500 mb-4 -mt-1">
              Period started{' '}
              {new Date(lastPeriodStart + 'T12:00:00').toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
              })}
              {isManual && (
                <button
                  type="button"
                  onClick={clearManualStatus}
                  className="ml-2 text-[#D98A5B] font-bold underline-offset-2 hover:underline"
                >
                  Use auto
                </button>
              )}
            </p>
          )}

          <div className="flex justify-center mb-6">
            <div className="relative w-44 h-44">
              <svg className="w-full h-full transform -rotate-90 absolute inset-0" viewBox="0 0 36 36">
                <path
                  className="text-warm-beige-dark"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={ringColor(status)}
                  strokeWidth="2.5"
                  strokeDasharray={`${ringProgress}, 100`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Status
                </span>
                <span className="text-4xl font-bold text-gray-800 tracking-tight tabular-nums">
                  {centerValue}
                </span>
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider mt-2 px-4 py-1.5 rounded-full border ${badgeStyles(status)}`}
                >
                  {phaseLabel}
                </span>
              </div>
              <div
                className={`absolute inset-0 rounded-full blur-2xl scale-90 -z-10 ${
                  status === 'haiz'
                    ? 'bg-soft-pink-dark/15'
                    : status === 'taharah'
                      ? 'bg-soft-mint-dark/15'
                      : 'bg-gray-200/30'
                }`}
              />
            </div>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center mb-2">
            Tap to update status
          </p>
          <div className="flex justify-center gap-2 mb-5 flex-wrap">
            {LEGEND.map((item) => {
              const isActive = status === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setStatus(item.key)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full border transition-all active:scale-95 ${
                    isActive
                      ? 'bg-white shadow-sm border-soft-pink-dark/30 ring-2 ring-soft-pink-dark/20'
                      : 'bg-white/50 border-white/80 hover:bg-white/80'
                  }`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-bold text-gray-700 leading-none">{item.label}</span>
                    <span className="text-[9px] font-medium text-gray-400">{item.sub}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={logPeriodStartToday}
            className="w-full mb-5 flex items-center justify-center gap-2 py-3 rounded-[20px] bg-white/90 border border-white shadow-sm text-[13px] font-bold text-[#D98A5B] active:scale-[0.98] transition-all hover:bg-white"
          >
            <CalendarPlus className="w-4 h-4" />
            Period started today
          </button>

          <div
            className={`rounded-[24px] bg-gradient-to-r ${message.boxClass} p-4 border border-white/70 flex gap-3.5`}
          >
            <div className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center shadow-sm flex-shrink-0">
              <MessageIcon className={`w-5 h-5 ${message.iconClass}`} />
            </div>
            <div>
              <p className="text-[13px] font-bold text-gray-800 mb-1">{message.title}</p>
              <p className="text-[13px] font-medium text-gray-600/90 leading-relaxed">{message.body}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
