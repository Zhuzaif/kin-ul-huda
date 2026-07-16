import React, { useMemo } from 'react';
import { User2, Flower2, Moon, Globe, CloudDownload, ChevronRight, Heart } from 'lucide-react';
import { useProfile } from '../contexts/ProfileContext';
import { usePurityTracker } from '../contexts/PurityTrackerContext';
import { getLanguageLabel, getThemeLabel } from '../utils/profileStore';
import { getMadhabLabel, getCalculationMethodLabel } from '../utils/prayerTimes';
import type { SettingsScreenId } from '../types/profile';

interface SettingsListProps {
  onOpenScreen: (id: SettingsScreenId) => void;
  onSupport?: () => void;
}

export default function SettingsList({ onOpenScreen, onSupport }: SettingsListProps) {
  const { profile } = useProfile();
  const { store } = usePurityTracker();

  const settingsItems = useMemo(
    () => [
      {
        id: 'preferences' as const,
        title: 'My Preferences',
        icon: User2,
        secondary: profile.name
          ? `${profile.name} · ${getMadhabLabel(profile.madhab)}`
          : `${getMadhabLabel(profile.madhab)} · ${getCalculationMethodLabel(profile.calculationMethod)}`,
        color: 'text-gray-600',
        bg: 'bg-gray-100',
      },
      {
        id: 'period' as const,
        title: 'Period Tracker Settings',
        icon: Flower2,
        secondary: `Cycle: ${store.settings.cycleLengthDays} days · Period: ${store.settings.periodLengthDays} days`,
        color: 'text-soft-pink-dark',
        bg: 'bg-soft-pink',
      },
      {
        id: 'theme' as const,
        title: 'Theme',
        icon: Moon,
        secondary: getThemeLabel(profile.theme),
        color: 'text-muted-gold',
        bg: 'bg-muted-gold-light',
      },
      {
        id: 'language' as const,
        title: 'Language',
        icon: Globe,
        secondary: getLanguageLabel(profile.language),
        color: 'text-[#2B604A]',
        bg: 'bg-soft-mint',
      },
      {
        id: 'downloads' as const,
        title: 'Downloads',
        icon: CloudDownload,
        secondary: 'Manage offline Quran audio',
        color: 'text-gray-600',
        bg: 'bg-gray-100',
      },
    ],
    [profile, store.settings]
  );

  return (
    <div className="px-6 pb-32">
      <div className="flex flex-col gap-3 mb-8">
        {settingsItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onOpenScreen(item.id)}
              className="w-full flex items-center justify-between bg-white/70 hover:bg-white backdrop-blur-sm p-4 rounded-[20px] shadow-sm border border-white/60 transition-all active:scale-[0.98] group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${item.color} stroke-[2]`} />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-[15px] font-bold text-gray-800">{item.title}</span>
                  {item.secondary && (
                    <span className="text-[12px] font-medium text-gray-500 mt-0.5">{item.secondary}</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors" />
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onSupport}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-soft-pink-dark to-[#D98A5B] text-white py-4 rounded-[24px] shadow-[0_4px_15px_rgba(235,182,186,0.3)] active:scale-[0.98] transition-all"
      >
        <Heart className="w-5 h-5 fill-current" />
        <span className="text-[15px] font-bold">Support Us</span>
      </button>
    </div>
  );
}
