import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { App as CapacitorApp } from '@capacitor/app';
import { pageVariants } from '../lib/motion';
import { runBackHandlers, BACK_PRIORITY } from '../lib/backButton';
import { useBackHandler } from '../hooks/useBackHandler';
import Header from './Header';
import PrayerWidget from './PrayerWidget';
import DailyVerse from './DailyVerse';
import QuranAudioWidget from './QuranAudioWidget';
import DailyGoalWidget from './DailyGoalWidget';
import QuickActions from './QuickActions';
import BottomNav from './BottomNav';
import QuranLayout from './QuranLayout';
import DuasLayout from './DuasLayout';
import NisaLayout from './NisaLayout';

import ProfileLayout from './ProfileLayout';
import QiblaFinder from './QiblaFinder';
import TasbeehCounterScreen from './TasbeehCounterScreen';
import QuranAudioScreen from './QuranAudioScreen';
import { usePeriodMode } from '../contexts/PeriodModeContext';
import { useProfile } from '../contexts/ProfileContext';
import { useActivityTracker } from '../hooks/useActivityTracker';

export default function MobileLayout() {
  const [activeTab, setActiveTab] = useState('home');
  const [tabHistory, setTabHistory] = useState<string[]>(['home']);
  const [isQuranReading, setIsQuranReading] = useState(false);
  const [showTasbeeh, setShowTasbeeh] = useState(false);
  const [showQuranAudio, setShowQuranAudio] = useState(false);
  const [profileOverlay, setProfileOverlay] = useState(false);
  const { isPeriodMode } = usePeriodMode();
  const { profile } = useProfile();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset scroll position to top when switching tabs
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [activeTab]);

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
  useActivityTracker(activeTab, isQuranReading, showTasbeeh || showQuranAudio, profileOverlay);

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
    tabHistory.length > 1 && !isQuranReading && !showTasbeeh && !showQuranAudio && !profileOverlay,
    goBackInHistory,
    BACK_PRIORITY.tab
  );

  // Tasbeeh and Quran Audio full-screen overlays close on back.
  useBackHandler(showTasbeeh, () => setShowTasbeeh(false), BACK_PRIORITY.modal);
  useBackHandler(showQuranAudio, () => setShowQuranAudio(false), BACK_PRIORITY.modal);

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
      id="mobile-frame-root"
      data-theme={profile.theme}
      data-period={isPeriodMode ? 'on' : 'off'}
      className="fixed top-0 left-0 w-full h-[100dvh] bg-theme-surface transition-colors duration-500"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div
        className="w-full h-full relative flex flex-col"
      >
        {/* Universal Top Radiant Gradient */}
        <div 
          className="fixed top-0 left-0 w-full h-[45vh] pointer-events-none z-0 transition-opacity duration-1000 opacity-[0.18]" 
          style={{
            background: 'radial-gradient(120% 100% at 50% 0%, var(--color-theme-accent) 0%, transparent 100%)'
          }}
        />
        
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto w-full relative z-10 scroll-smooth flex flex-col pb-28"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex-1 flex flex-col w-full"
            >
              {activeTab === 'home' && (
                <div>
                  <Header />
                  <PrayerWidget onNavigate={handleTabChange} />
                  {/* <DailyGoalWidget /> */}
                  <DailyVerse />
                  <QuranAudioWidget onClick={() => setShowQuranAudio(true)} />
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
            </motion.div>
          </AnimatePresence>
        </div>
        <div
          id="floating-audio-root"
          className="absolute left-0 right-0 bottom-4 z-40 px-6 pb-4 pointer-events-none"
        />
        {!isQuranReading && !showTasbeeh && !showQuranAudio && !profileOverlay && (
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        )}

        <AnimatePresence>
          {showTasbeeh && (
            <TasbeehCounterScreen onBack={() => setShowTasbeeh(false)} />
          )}
          {showQuranAudio && (
            <QuranAudioScreen onBack={() => setShowQuranAudio(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
