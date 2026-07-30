import React, { useEffect, useState } from 'react';
import Header from './Header';
import PrayerWidget from './PrayerWidget';
import DailyVerse from './DailyVerse';
import DailyGoalWidget from './DailyGoalWidget';
import QuickActions from './QuickActions';
import BottomNav from './BottomNav';
import QuranLayout from './QuranLayout';
import DuasLayout from './DuasLayout';
import NisaLayout from './NisaLayout';

import ProfileLayout from './ProfileLayout';
import QiblaFinder from './QiblaFinder';
import TasbeehCounterScreen from './TasbeehCounterScreen';
import { usePeriodMode } from '../contexts/PeriodModeContext';
import { useProfile } from '../contexts/ProfileContext';
import { useActivityTracker } from '../hooks/useActivityTracker';

const THEME_BG: Record<string, string> = {
  serenity: 'bg-warm-beige',
  bloom: 'bg-[#FCF5F5]',
  meadow: 'bg-[#F5FAF7]',
};

export default function MobileLayout() {
  const [activeTab, setActiveTab] = useState('home');
  const [isQuranReading, setIsQuranReading] = useState(false);
  const [showTasbeeh, setShowTasbeeh] = useState(false);
  const [profileOverlay, setProfileOverlay] = useState(false);
  const { isPeriodMode } = usePeriodMode();
  const { profile } = useProfile();
  
  // Track global activity across tabs and overlays
  useActivityTracker(activeTab, isQuranReading, showTasbeeh, profileOverlay);

  const frameBg =
    isPeriodMode && profile.theme === 'serenity'
      ? 'bg-[#FCF5F5]'
      : THEME_BG[profile.theme] ?? 'bg-warm-beige';

  useEffect(() => {
    if (activeTab !== 'quran') {
      setIsQuranReading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'NAVIGATE' && event.data.screen) {
        setActiveTab(event.data.screen);
      }
    };
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleMessage);
    }
    
    // Also check URL on load for ?screen=xxx
    const params = new URLSearchParams(window.location.search);
    const screenParam = params.get('screen');
    if (screenParam) {
      setActiveTab(screenParam);
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      }
    };
  }, []);

  return (
    <div className="h-screen w-full flex items-center justify-center p-0 sm:p-6 bg-gray-200">
      <div
        id="mobile-frame-root"
        className={`w-full h-screen sm:h-[850px] max-w-[400px] transition-colors duration-500 sm:rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col sm:border-[8px] border-white ${frameBg}`}
      >
        <div className="flex-1 overflow-y-auto w-full relative scroll-smooth flex flex-col">
          {activeTab === 'home' && (
            <div className="animate-in fade-in duration-300">
              <Header />
              <PrayerWidget onNavigate={setActiveTab} />
              {/* <DailyGoalWidget /> */}
              <DailyVerse />
              <QuickActions onNavigate={setActiveTab} onOpenTasbeeh={() => setShowTasbeeh(true)} />
            </div>
          )}
          {activeTab === 'quran' && (
            <QuranLayout onReadingModeChange={setIsQuranReading} />
          )}
          {activeTab === 'duas' && <DuasLayout />}
          {activeTab === 'nisa' && <NisaLayout />}
          {activeTab === 'profile' && (
            <ProfileLayout onOverlayChange={setProfileOverlay} />
          )}
          {activeTab === 'qibla' && <QiblaFinder onBack={() => setActiveTab('home')} />}
          {/* Placeholders for other tabs to prevent crashing or empty states */}
        </div>
        <div
          id="floating-audio-root"
          className="absolute left-0 right-0 bottom-4 z-40 px-6 pb-4 pointer-events-none"
        />
        {!isQuranReading && !showTasbeeh && !profileOverlay && (
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        )}

        {showTasbeeh && (
          <TasbeehCounterScreen onBack={() => setShowTasbeeh(false)} />
        )}
      </div>
    </div>
  );
}
