import React, { useMemo } from 'react';
import { Clock, MapPin, Check } from 'lucide-react';
import ProfileSubScreen from './ProfileSubScreen';
import { useProfile } from '../../contexts/ProfileContext';
import { usePrayerTimes } from '../../hooks/usePrayerTimes';
import {
  MADHAB_OPTIONS,
  CALCULATION_METHOD_OPTIONS,
  getCalculationMethodLabel,
} from '../../utils/prayerTimes';
import type { CalculationMethodId, Madhab } from '../../types/profile';

interface PreferencesScreenProps {
  onBack: () => void;
}

export default function PreferencesScreen({ onBack }: PreferencesScreenProps) {
  const { profile, updateProfile } = useProfile();
  const { schedule, loading } = usePrayerTimes(profile.madhab, profile.calculationMethod);

  const selectedMadhab = useMemo(
    () => MADHAB_OPTIONS.find((m) => m.id === profile.madhab),
    [profile.madhab]
  );

  const asrTime = schedule.find((p) => p.name === 'Asr')?.time;

  return (
    <ProfileSubScreen
      title="My Preferences"
      subtitle="Prayer times, name & reminders"
      onBack={onBack}
    >
      <div className="flex flex-col gap-5">
        <section className="bg-white/70 rounded-[24px] p-5 border border-white/60 shadow-sm">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">
            Display name
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => updateProfile({ name: e.target.value.slice(0, 32) })}
            placeholder="Your name"
            className="w-full bg-[#FAF8F5] rounded-2xl px-4 py-3 text-[15px] font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-soft-mint-dark/40 border border-transparent"
          />
        </section>

        <section className="bg-gradient-to-br from-soft-mint/60 to-white/80 rounded-[24px] p-5 border border-soft-mint-dark/20 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-[#2B604A]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#2B604A]">
              Today&apos;s prayer times
            </span>
          </div>
          {loading ? (
            <p className="text-[13px] text-gray-500">Calculating for your location…</p>
          ) : (
            <>
              <div className="grid grid-cols-5 gap-1.5 mb-3">
                {schedule.map((p) => (
                  <div
                    key={p.name}
                    className={`text-center rounded-[14px] py-2 px-0.5 ${
                      p.name === 'Asr'
                        ? 'bg-[#2B604A] text-white shadow-sm'
                        : 'bg-white/80 text-gray-700'
                    }`}
                  >
                    <p className="text-[8px] font-bold uppercase opacity-80">{p.name}</p>
                    <p className="text-[9px] font-bold tabular-nums mt-0.5 leading-tight whitespace-nowrap">
                      {p.time}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-gray-400" />
                <span>
                  <strong className="text-gray-800">{selectedMadhab?.label}</strong> ·{' '}
                  {getCalculationMethodLabel(profile.calculationMethod)}
                  {asrTime && (
                    <>
                      {' '}
                      — Asr at <strong>{asrTime}</strong>
                    </>
                  )}
                </span>
              </p>
            </>
          )}
        </section>

        <section className="bg-white/70 rounded-[24px] p-5 border border-white/60 shadow-sm">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
            Madhab — affects Asr time
          </label>
          <p className="text-[12px] text-gray-500 mb-4 leading-relaxed">
            Fajr, Dhuhr, Maghrib & Isha stay the same. Only <strong>Asr</strong> changes between
            Hanafi and the other schools.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {MADHAB_OPTIONS.map((opt) => {
              const selected = profile.madhab === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateProfile({ madhab: opt.id as Madhab })}
                  className={`text-left px-3.5 py-3 rounded-[18px] border transition-all active:scale-[0.98] ${
                    selected
                      ? 'bg-soft-mint border-[#2B604A]/25 ring-2 ring-[#2B604A]/10'
                      : 'bg-[#FAF8F5] border-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[13px] font-bold text-gray-800">{opt.label}</span>
                    {selected && <Check className="w-4 h-4 text-[#2B604A]" />}
                  </div>
                  <span className="text-[10px] font-semibold text-[#2B604A] block">{opt.asrRule}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="bg-white/70 rounded-[24px] p-5 border border-white/60 shadow-sm">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
            Calculation method
          </label>
          <p className="text-[12px] text-gray-500 mb-4 leading-relaxed">
            Regional authority for Fajr & Isha angles. Choose what your local masjid follows.
          </p>
          <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto hide-scrollbar">
            {CALCULATION_METHOD_OPTIONS.map((opt) => {
              const selected = profile.calculationMethod === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    updateProfile({ calculationMethod: opt.id as CalculationMethodId })
                  }
                  className={`w-full text-left px-4 py-3 rounded-[16px] border transition-all active:scale-[0.98] flex items-center justify-between gap-2 ${
                    selected
                      ? 'bg-muted-gold-light/80 border-muted-gold/40 ring-1 ring-muted-gold/30'
                      : 'bg-[#FAF8F5] border-gray-100'
                  }`}
                >
                  <div>
                    <span className="text-[13px] font-bold text-gray-800 block">{opt.label}</span>
                    <span className="text-[11px] text-gray-500">{opt.region}</span>
                  </div>
                  {selected && <Check className="w-4 h-4 text-muted-gold flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </section>

        <section className="bg-white/70 rounded-[24px] p-5 border border-white/60 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[14px] font-bold text-gray-800">Prayer reminders</p>
              <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
                Browser notifications before the next salah (when supported).
              </p>
            </div>
            <button
              type="button"
              onClick={() => updateProfile({ prayerReminders: !profile.prayerReminders })}
              className={`relative w-14 h-8 rounded-full transition-colors flex-shrink-0 ${
                profile.prayerReminders ? 'bg-[#2B604A]' : 'bg-gray-200'
              }`}
              aria-label="Toggle prayer reminders"
            >
              <span
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  profile.prayerReminders ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </section>
      </div>
    </ProfileSubScreen>
  );
}
