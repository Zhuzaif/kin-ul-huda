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
        <h3 className="text-[11px] font-bold uppercase tracking-wider px-1 text-text-muted">
          Personal &amp; Faith
        </h3>

        <div className="rounded-[24px] overflow-hidden border border-theme-border shadow-[var(--nisa-shadow-card)] divide-y divide-theme-divider bg-theme-surface-card">
          {/* Preferences Row */}
          <button
            type="button"
            onClick={() => onOpenScreen('preferences')}
            className="w-full p-4 flex items-center justify-between hover:bg-theme-surface-alt/50 transition active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-theme-accent/10 border border-theme-accent/15 text-theme-accent flex items-center justify-center shadow-sm">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-[13px] font-bold text-text-primary">My Preferences</h4>
                <p className="text-[11px] mt-0.5 text-text-tertiary">
                  {profile.name ? `${profile.name} · ` : ''}{getMadhabLabel(profile.madhab)}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-text-muted" />
          </button>

          {/* Period Tracker Row */}
          <button
            type="button"
            onClick={() => onOpenScreen('period')}
            className="w-full p-4 flex items-center justify-between hover:bg-theme-surface-alt/50 transition active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-theme-rose/10 border border-theme-rose/15 text-theme-rose flex items-center justify-center shadow-sm">
                <CalendarHeart className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h4 className="text-[13px] font-bold text-text-primary">Period Tracker Settings</h4>
                  <span className="text-[9px] bg-theme-rose/15 text-theme-rose px-1.5 py-0.5 rounded font-semibold">
                    Al-Nisa
                  </span>
                </div>
                <p className="text-[11px] mt-0.5 text-text-tertiary">
                  Cycle: {store.settings.cycleLengthDays} days · Period: {store.settings.periodLengthDays} days
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-text-muted" />
          </button>
        </div>
      </div>

      {/* ── Settings Group 2: App Experience ── */}
      <div className="space-y-2 mb-6">
        <h3 className="text-[11px] font-bold uppercase tracking-wider px-1 text-text-muted">
          App Experience
        </h3>

        <div className="rounded-[24px] overflow-hidden border border-theme-border shadow-[var(--nisa-shadow-card)] divide-y divide-theme-divider bg-theme-surface-card">
          {/* Theme Row */}
          <button
            type="button"
            onClick={() => onOpenScreen('theme')}
            className="w-full p-4 flex items-center justify-between hover:bg-theme-surface-alt/50 transition active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-theme-accent/10 border border-theme-accent/15 text-theme-accent flex items-center justify-center shadow-sm">
                <Palette className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-[13px] font-bold text-text-primary">Appearance Theme</h4>
                <p className="text-[11px] mt-0.5 text-text-tertiary">
                  {getThemeLabel(profile.theme)}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-text-muted" />
          </button>

          {/* Language Row */}
          <button
            type="button"
            onClick={() => onOpenScreen('language')}
            className="w-full p-4 flex items-center justify-between hover:bg-theme-surface-alt/50 transition active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-theme-accent/10 border border-theme-accent/15 text-theme-accent flex items-center justify-center shadow-sm">
                <Languages className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-[13px] font-bold text-text-primary">Language &amp; Region</h4>
                <p className="text-[11px] mt-0.5 text-text-tertiary">
                  {getLanguageLabel(profile.language)}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-text-muted" />
          </button>

          {/* Downloads Row */}
          <button
            type="button"
            onClick={() => onOpenScreen('downloads')}
            className="w-full p-4 flex items-center justify-between hover:bg-theme-surface-alt/50 transition active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-theme-accent/10 border border-theme-accent/15 text-theme-accent flex items-center justify-center shadow-sm">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-[13px] font-bold text-text-primary">Offline Quran Audio</h4>
                <p className="text-[11px] mt-0.5 text-text-tertiary">
                  Manage offline Quran audio
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-text-muted" />
          </button>
        </div>
      </div>

      {/* ── Support Us Banner (Hidden) ── */}
      {false && (
        <button
        type="button"
        onClick={onSupport}
        className="w-full cursor-pointer group relative overflow-hidden rounded-[24px] p-5 text-white shadow-lg transition-transform duration-200 active:scale-[0.98] bg-gradient-to-r from-theme-accent to-theme-orange"
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

          <div className="w-10 h-10 rounded-2xl bg-theme-surface-card backdrop-blur-md flex items-center justify-center border border-theme-border text-white group-hover:bg-white group-hover:text-emerald-800 transition">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </button>
      )}

      {/* Footer Attribution / Promo */}
      <div className="pt-2 pb-6 px-4 flex justify-center">
        <a 
          href="https://play.google.com/store/apps/details?id=com.muslimkids.noorulhuda" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-theme-surface-card border border-theme-accent/20 rounded-[16px] px-3.5 py-2.5 shadow-sm transition hover:bg-theme-surface-dark active:scale-[0.97] max-w-[280px]"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-theme-accent to-theme-accent-strong flex-shrink-0 flex items-center justify-center shadow-inner">
            <HeartHandshake className="w-5 h-5 text-theme-surface" />
          </div>
          <div className="text-left">
            <p className="text-[8px] font-bold text-theme-accent-strong uppercase tracking-widest mb-0.5">Huda Labs</p>
            <h4 className="text-[12px] font-bold text-text-primary leading-tight">Noor ul Huda Kids</h4>
            <p className="text-[9px] text-text-muted leading-tight mt-0.5">Fun &amp; interactive Islamic app</p>
          </div>
        </a>
      </div>
    </div>
  );
}
