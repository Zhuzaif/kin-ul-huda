import React, { useMemo } from 'react';
import {
  SlidersHorizontal,
  CalendarHeart,
  Palette,
  Languages,
  Headphones,
  ChevronRight,
  ArrowRight,
  HeartHandshake,
} from 'lucide-react';
import { useProfile } from '../contexts/ProfileContext';
import { usePurityTracker } from '../contexts/PurityTrackerContext';
import { getLanguageLabel, getThemeLabel } from '../utils/profileStore';
import { getMadhabLabel } from '../utils/prayerTimes';
import type { SettingsScreenId } from '../types/profile';

interface SettingsListProps {
  onOpenScreen: (id: SettingsScreenId) => void;
  onSupport?: () => void;
}

export default function SettingsList({ onOpenScreen, onSupport }: SettingsListProps) {
  const { profile } = useProfile();
  const { store } = usePurityTracker();

  return (
    <div className="px-6 pb-32">
      {/* ── Settings Group 1: Personal & Faith ── */}
      <div className="space-y-2 mb-5">
        <h3 className="text-[11px] font-bold uppercase tracking-wider px-1 text-gray-400">
          Personal &amp; Faith
        </h3>

        <div className="rounded-[24px] overflow-hidden border border-white/60 shadow-sm divide-y divide-gray-100/60 bg-white/70 backdrop-blur-sm">
          {/* Preferences Row */}
          <button
            type="button"
            onClick={() => onOpenScreen('preferences')}
            className="w-full p-4 flex items-center justify-between hover:bg-white/90 transition active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100/80 text-indigo-600 flex items-center justify-center shadow-sm">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-[13px] font-bold text-gray-800">My Preferences</h4>
                <p className="text-[11px] mt-0.5 text-gray-500">
                  {profile.name} · {getMadhabLabel(profile.madhab)}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>

          {/* Period Tracker Row */}
          <button
            type="button"
            onClick={() => onOpenScreen('period')}
            className="w-full p-4 flex items-center justify-between hover:bg-white/90 transition active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100/80 text-rose-600 flex items-center justify-center shadow-sm">
                <CalendarHeart className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h4 className="text-[13px] font-bold text-gray-800">Period Tracker Settings</h4>
                  <span className="text-[9px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-semibold">
                    Al-Nisa
                  </span>
                </div>
                <p className="text-[11px] mt-0.5 text-gray-500">
                  Cycle: {store.settings.cycleLengthDays} days · Period: {store.settings.periodLengthDays} days
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      </div>

      {/* ── Settings Group 2: App Experience ── */}
      <div className="space-y-2 mb-6">
        <h3 className="text-[11px] font-bold uppercase tracking-wider px-1 text-gray-400">
          App Experience
        </h3>

        <div className="rounded-[24px] overflow-hidden border border-white/60 shadow-sm divide-y divide-gray-100/60 bg-white/70 backdrop-blur-sm">
          {/* Theme Row */}
          <button
            type="button"
            onClick={() => onOpenScreen('theme')}
            className="w-full p-4 flex items-center justify-between hover:bg-white/90 transition active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100/80 text-amber-600 flex items-center justify-center shadow-sm">
                <Palette className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-[13px] font-bold text-gray-800">Appearance Theme</h4>
                <p className="text-[11px] mt-0.5 text-gray-500">
                  {getThemeLabel(profile.theme)}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>

          {/* Language Row */}
          <button
            type="button"
            onClick={() => onOpenScreen('language')}
            className="w-full p-4 flex items-center justify-between hover:bg-white/90 transition active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100/80 text-teal-600 flex items-center justify-center shadow-sm">
                <Languages className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-[13px] font-bold text-gray-800">Language &amp; Region</h4>
                <p className="text-[11px] mt-0.5 text-gray-500">
                  {getLanguageLabel(profile.language)}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>

          {/* Downloads Row */}
          <button
            type="button"
            onClick={() => onOpenScreen('downloads')}
            className="w-full p-4 flex items-center justify-between hover:bg-white/90 transition active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100/80 text-purple-600 flex items-center justify-center shadow-sm">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-[13px] font-bold text-gray-800">Offline Quran Audio</h4>
                <p className="text-[11px] mt-0.5 text-gray-500">
                  Manage offline Quran audio
                </p>
              </div>
            </div>
            <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Ready
            </span>
          </button>
        </div>
      </div>

      {/* ── Support Us Banner (Hidden) ── */}
      {false && (
        <button
        type="button"
        onClick={onSupport}
        className="w-full cursor-pointer group relative overflow-hidden rounded-[24px] p-5 text-white shadow-lg transition-transform duration-200 active:scale-[0.98] bg-gradient-to-r from-[#2B604A] to-[#D98A5B]"
      >
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1 max-w-[75%] text-left">
            <div className="flex items-center gap-1.5 text-amber-100 text-[11px] font-semibold">
              <HeartHandshake className="w-4 h-4 text-amber-200" />
              <span>Sadaqah Jariyah Project</span>
            </div>
            <h3 className="text-base font-bold text-white leading-tight">
              Support Nisa App
            </h3>
            <p className="text-[11px] text-white/90 leading-snug">
              Help us keep Nisa ad-free and accessible for sisters worldwide.
            </p>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white group-hover:bg-white group-hover:text-emerald-800 transition">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </button>
      )}

      {/* Footer Attribution */}
      <div className="text-center pt-5 pb-4 text-[11px] text-gray-400 space-y-0.5">
        <p className="font-medium">Al-Nisa • Version 3.4.0</p>
        <p className="text-[10px]">Crafted with love &amp; intention for the Ummah</p>
      </div>
    </div>
  );
}
