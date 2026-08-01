import React, { useEffect, useState } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { runBackHandlers, BACK_PRIORITY } from '../lib/backButton';
import { useBackHandler } from '../hooks/useBackHandler';
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

export default function MobileLayout() {
  const [activeTab, setActiveTab] = useState('home');
  const [tabHistory, setTabHistory] = useState<string[]>(['home']);
  const [isQuranReading, setIsQuranReading] = useState(false);
  const [showTasbeeh, setShowTasbeeh] = useState(false);
  const [profileOverlay, setProfileOverlay] = useState(false);
  const { isPeriodMode } = usePeriodMode();
  const { profile } = useProfile();

  const handleTabChange = (newTab: string) => {
    if (newTab === activeTab) return;
    setActiveTab(newTab);
    setTabHistory((prev) => {
      if (prev[prev.length - 1] === newTab) return prev;
      return [...prev, newTab];
    });
  };

  const goBackInHistory = () => {
    if (tabHistory.length > 1) {
      const newHistory = [...tabHistory];
      newHistory.pop();
      const previousTab = newHistory[newHistory.length - 1];
      setTabHistory(newHistory);
      setActiveTab(previousTab);
    }
  };

  // Track global activity across tabs and overlays
  useActivityTracker(activeTab, isQuranReading, showTasbeeh, profileOverlay);

  // Android hardware back button: route it through the back-handler stack so it
  // closes the top-most open screen instead of exiting the app. Only when
  // nothing is left to close (home screen, no overlays) do we exit — and even
  // then we require a second press within 2s to avoid accidental quits.
  useEffect(() => {
    let lastBackPress = 0;
    const sub = CapacitorApp.addListener('backButton', () => {
      const handled = runBackHandlers();
      if (handled) return;

      const now = Date.now();
      if (now - lastBackPress < 2000) {
        CapacitorApp.exitApp();
      } else {
        lastBackPress = now;
        // Lightweight hint; native toast isn't available without an extra plugin.
        try {
          window.dispatchEvent(new CustomEvent('nisa:back-exit-hint'));
        } catch (_) {
          /* noop */
        }
      }
    });

    return () => {
      sub.then((handle) => handle.remove());
    };
  }, []);

  // Back returns to the previous tab in history before the app can exit.
  useBackHandler(
    tabHistory.length > 1 && !isQuranReading && !showTasbeeh && !profileOverlay,
    goBackInHistory,
    BACK_PRIORITY.tab
  );

  // Tasbeeh full-screen overlay closes on back.
  useBackHandler(showTasbeeh, () => setShowTasbeeh(false), BACK_PRIORITY.modal);

  useEffect(() => {
    if (activeTab !== 'quran') {
      setIsQuranReading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'NAVIGATE' && event.data.screen) {
        handleTabChange(event.data.screen);
      }
    };
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleMessage);
    }

    // Also check URL on load for ?screen=xxx
    const params = new URLSearchParams(window.location.search);
    const screenParam = params.get('screen');
    if (screenParam) {
      handleTabChange(screenParam);
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      }
    };
  }, [activeTab, tabHistory]);

  return (
    <div
      className="fixed inset-0 bg-theme-surface"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div
        id="mobile-frame-root"
        data-theme={profile.theme}
        data-period={isPeriodMode ? 'on' : 'off'}
        className="w-full h-full transition-colors duration-500 relative overflow-hidden flex flex-col bg-theme-surface"
      >
        <div className="flex-1 overflow-y-auto w-full relative scroll-smooth flex flex-col">
          {activeTab === 'home' && (
            <div className="animate-in fade-in duration-300">
              <Header />
              <PrayerWidget onNavigate={handleTabChange} />
              {/* <DailyGoalWidget /> */}
              <DailyVerse />
              <QuickActions onNavigate={handleTabChange} onOpenTasbeeh={() => setShowTasbeeh(true)} />
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
          {activeTab === 'qibla' && <QiblaFinder onBack={goBackInHistory} />}
          {/* Placeholders for other tabs to prevent crashing or empty states */}
        </div>
        <div
          id="floating-audio-root"
          className="absolute left-0 right-0 bottom-4 z-40 px-6 pb-4 pointer-events-none"
        />
        {!isQuranReading && !showTasbeeh && !profileOverlay && (
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        )}

        {showTasbeeh && (
          <TasbeehCounterScreen onBack={() => setShowTasbeeh(false)} />
        )}
      </div>
    </div>
  );
}
