import React, { useState } from 'react';
import ProfileSubScreen from './ProfileSubScreen';
import { usePurityTracker } from '../../contexts/PurityTrackerContext';

interface PeriodSettingsScreenProps {
  onBack: () => void;
}

export default function PeriodSettingsScreen({ onBack }: PeriodSettingsScreenProps) {
  const { store, snapshot, updateSettings, logPeriodStartToday } = usePurityTracker();
  const { settings } = store;
  const [confirmLog, setConfirmLog] = useState(false);

  return (
    <ProfileSubScreen
      title="Period Tracker"
      subtitle="Synced with your Purity Dashboard"
      onBack={onBack}
    >
      <div className="flex flex-col gap-5">
        <section className="bg-gradient-to-br from-theme-rose/15 to-theme-orange/10 rounded-[24px] p-5 border border-theme-border">
          <p className="text-[10px] font-bold uppercase tracking-widest text-theme-orange mb-1">
            Current status
          </p>
          <p className="text-xl font-bold text-text-primary">{snapshot.phaseLabel}</p>
          {snapshot.dayInPhase > 0 && (
            <p className="text-[13px] font-medium text-text-secondary mt-1">Day {snapshot.dayInPhase}</p>
          )}
          {!confirmLog ? (
            <button
              type="button"
              onClick={() => setConfirmLog(true)}
              className="mt-4 w-full py-3 rounded-[18px] bg-theme-surface-card/90 text-[13px] font-bold text-theme-orange active:scale-[0.98] transition-all"
            >
              Log period started today
            </button>
          ) : (
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmLog(false)}
                className="flex-1 py-3 rounded-[18px] bg-theme-surface-card/50 text-[13px] font-bold text-text-tertiary active:scale-[0.98] transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  logPeriodStartToday();
                  setConfirmLog(false);
                }}
                className="flex-1 py-3 rounded-[18px] bg-theme-surface-card/90 text-[13px] font-bold text-theme-rose active:scale-[0.98] transition-all"
              >
                Confirm Log
              </button>
            </div>
          )}
        </section>

        <section className="bg-theme-surface-card rounded-[24px] p-5 border border-theme-border shadow-sm">
          <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted block mb-3">
            Cycle length (days)
          </label>
          <div className="flex items-center justify-between gap-4 mb-4">
            <button
              type="button"
              disabled={settings.cycleLengthDays <= 21}
              onClick={() =>
                updateSettings({
                  cycleLengthDays: Math.max(21, settings.cycleLengthDays - 1),
                })
              }
              className={`w-10 h-10 rounded-full font-bold transition-colors ${settings.cycleLengthDays <= 21
                  ? 'bg-theme-surface-dark text-text-muted cursor-not-allowed'
                  : 'bg-theme-surface-dark text-text-primary active:scale-95'
                }`}
            >
              −
            </button>
            <span className="text-3xl font-bold text-text-primary tabular-nums">
              {settings.cycleLengthDays}
            </span>
            <button
              type="button"
              disabled={settings.cycleLengthDays >= 45}
              onClick={() =>
                updateSettings({
                  cycleLengthDays: Math.min(45, settings.cycleLengthDays + 1),
                })
              }
              className={`w-10 h-10 rounded-full font-bold transition-colors ${settings.cycleLengthDays >= 45
                  ? 'bg-theme-surface-dark text-text-muted cursor-not-allowed'
                  : 'bg-theme-surface-dark text-text-primary active:scale-95'
                }`}
            >
              +
            </button>
          </div>
          <p className="text-[12px] text-text-tertiary leading-relaxed">
            Average days from the start of one period to the next.
          </p>
        </section>

        <section className="bg-theme-surface-card rounded-[24px] p-5 border border-theme-border shadow-sm">
          <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted block mb-3">
            Period length (days)
          </label>
          <div className="flex items-center justify-between gap-4 mb-4">
            <button
              type="button"
              disabled={settings.periodLengthDays <= 3}
              onClick={() =>
                updateSettings({
                  periodLengthDays: Math.max(3, settings.periodLengthDays - 1),
                })
              }
              className={`w-10 h-10 rounded-full font-bold transition-colors ${settings.periodLengthDays <= 3
                  ? 'bg-theme-surface-dark text-text-muted cursor-not-allowed'
                  : 'bg-theme-surface-dark text-text-primary active:scale-95'
                }`}
            >
              −
            </button>
            <span className="text-3xl font-bold text-text-primary tabular-nums">
              {settings.periodLengthDays}
            </span>
            <button
              type="button"
              disabled={settings.periodLengthDays >= 15}
              onClick={() =>
                updateSettings({
                  periodLengthDays: Math.min(15, settings.periodLengthDays + 1),
                })
              }
              className={`w-10 h-10 rounded-full font-bold transition-colors ${settings.periodLengthDays >= 15
                  ? 'bg-theme-surface-dark text-text-muted cursor-not-allowed'
                  : 'bg-theme-surface-dark text-text-primary active:scale-95'
                }`}
            >
              +
            </button>
          </div>
          <p className="text-[12px] text-text-tertiary leading-relaxed">
            Typical days of Hayz bleeding. Used to calculate Haiz on your dashboard.
          </p>
        </section>
      </div>
    </ProfileSubScreen>
  );
}
