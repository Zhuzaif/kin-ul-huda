import React, { useState, useEffect } from 'react';
import { useBackHandler } from '../hooks/useBackHandler';
import { BACK_PRIORITY } from '../lib/backButton';
import ProfileHeader from './ProfileHeader';
import SpiritualGoalCard from './SpiritualGoalCard';
import SettingsList from './SettingsList';
import type { SettingsScreenId } from '../types/profile';
import PreferencesScreen from './profile/PreferencesScreen';
import PeriodSettingsScreen from './profile/PeriodSettingsScreen';
import ThemeScreen from './profile/ThemeScreen';
import LanguageScreen from './profile/LanguageScreen';
import DownloadsScreen from './profile/DownloadsScreen';

interface ProfileLayoutProps {
  onOverlayChange?: (open: boolean) => void;
}

export default function ProfileLayout({ onOverlayChange }: ProfileLayoutProps) {
  const [activeScreen, setActiveScreen] = useState<SettingsScreenId>(null);
  const [showSupport, setShowSupport] = useState(false);

  useEffect(() => {
    onOverlayChange?.(activeScreen !== null || showSupport);
  }, [activeScreen, showSupport, onOverlayChange]);

  // Android back closes the open settings sub-screen / support modal first.
  useBackHandler(activeScreen !== null, () => setActiveScreen(null));
  useBackHandler(showSupport, () => setShowSupport(false), BACK_PRIORITY.modal);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'preferences':
        return <PreferencesScreen onBack={() => setActiveScreen(null)} />;
      case 'period':
        return <PeriodSettingsScreen onBack={() => setActiveScreen(null)} />;
      case 'theme':
        return <ThemeScreen onBack={() => setActiveScreen(null)} />;
      case 'language':
        return <LanguageScreen onBack={() => setActiveScreen(null)} />;
      case 'downloads':
        return <DownloadsScreen onBack={() => setActiveScreen(null)} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex w-full flex-col h-full animate-in fade-in duration-300 relative">
      <div className="flex-1 overflow-y-auto scroll-smooth hide-scrollbar">
        <ProfileHeader
          onOpenPreferences={() => setActiveScreen('preferences')}
        />
        {/* <SpiritualGoalCard /> */}
        <SettingsList
          onOpenScreen={setActiveScreen}
          onSupport={() => setShowSupport(true)}
        />
      </div>

      {showSupport && (
        <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center p-6 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-theme-surface-elevated rounded-[28px] p-6 shadow-2xl border border-theme-border animate-in slide-in-from-bottom-4 duration-300">
            <h3 className="text-xl font-bold text-text-primary mb-2">Support Nisa</h3>
            <p className="text-[13px] text-text-secondary leading-relaxed mb-6">
              Your support helps us build better fiqh guidance, purity tracking, and Quran tools
              for sisters worldwide. JazakAllah khair.
            </p>
            <a
              href="mailto:support@nisa.app?subject=Support%20Nisa%20App"
              className="block w-full text-center py-3.5 rounded-[20px] bg-gradient-to-r from-theme-rose to-theme-orange text-white font-bold text-[14px] mb-3"
            >
              Contact us
            </a>
            <button
              type="button"
              onClick={() => setShowSupport(false)}
              className="w-full py-3 rounded-[20px] text-text-secondary font-semibold text-[14px] bg-theme-surface-dark active:scale-[0.98]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {renderScreen()}
    </div>
  );
}
