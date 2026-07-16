import React from 'react';
import ProfileSubScreen from './ProfileSubScreen';
import { usePurityTracker } from '../../contexts/PurityTrackerContext';

interface PeriodSettingsScreenProps {
  onBack: () => void;
}

export default function PeriodSettingsScreen({ onBack }: PeriodSettingsScreenProps) {
  const { store, snapshot, updateSettings, logPeriodStartToday } = usePurityTracker();
  const { settings } = store;

  return (
    <ProfileSubScreen
      title="Period Tracker"
      subtitle="Synced with your Purity Dashboard"
      onBack={onBack}
    >
      <div className="flex flex-col gap-5">
        <section className="bg-gradient-to-br from-soft-pink to-light-peach/80 rounded-[24px] p-5 border border-white/60">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#D98A5B] mb-1">
            Current status
          </p>
          <p className="text-xl font-bold text-gray-800">{snapshot.phaseLabel}</p>
          {snapshot.dayInPhase > 0 && (
            <p className="text-[13px] font-medium text-gray-600 mt-1">Day {snapshot.dayInPhase}</p>
          )}
          <button
            type="button"
            onClick={logPeriodStartToday}
            className="mt-4 w-full py-3 rounded-[18px] bg-white/90 text-[13px] font-bold text-[#D98A5B] active:scale-[0.98] transition-all"
          >
            Log period started today
          </button>
        </section>

        <section className="bg-white/70 rounded-[24px] p-5 border border-white/60 shadow-sm">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-3">
            Cycle length (days)
          </label>
          <div className="flex items-center justify-between gap-4 mb-4">
            <button
              type="button"
              onClick={() =>
                updateSettings({
                  cycleLengthDays: Math.max(21, settings.cycleLengthDays - 1),
                })
              }
              className="w-10 h-10 rounded-full bg-[#FAF8F5] font-bold text-gray-700 active:scale-95"
            >
              −
            </button>
            <span className="text-3xl font-bold text-gray-800 tabular-nums">
              {settings.cycleLengthDays}
            </span>
            <button
              type="button"
              onClick={() =>
                updateSettings({
                  cycleLengthDays: Math.min(45, settings.cycleLengthDays + 1),
                })
              }
              className="w-10 h-10 rounded-full bg-[#FAF8F5] font-bold text-gray-700 active:scale-95"
            >
              +
            </button>
          </div>
          <p className="text-[12px] text-gray-500 leading-relaxed">
            Average days from the start of one period to the next.
          </p>
        </section>

        <section className="bg-white/70 rounded-[24px] p-5 border border-white/60 shadow-sm">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-3">
            Period length (days)
          </label>
          <div className="flex items-center justify-between gap-4 mb-4">
            <button
              type="button"
              onClick={() =>
                updateSettings({
                  periodLengthDays: Math.max(3, settings.periodLengthDays - 1),
                })
              }
              className="w-10 h-10 rounded-full bg-[#FAF8F5] font-bold text-gray-700 active:scale-95"
            >
              −
            </button>
            <span className="text-3xl font-bold text-gray-800 tabular-nums">
              {settings.periodLengthDays}
            </span>
            <button
              type="button"
              onClick={() =>
                updateSettings({
                  periodLengthDays: Math.min(15, settings.periodLengthDays + 1),
                })
              }
              className="w-10 h-10 rounded-full bg-[#FAF8F5] font-bold text-gray-700 active:scale-95"
            >
              +
            </button>
          </div>
          <p className="text-[12px] text-gray-500 leading-relaxed">
            Typical days of Hayz bleeding. Used to calculate Haiz on your dashboard.
          </p>
        </section>
      </div>
    </ProfileSubScreen>
  );
}
