import React, { useEffect, useState } from 'react';
import Header from './Header';
import PrayerWidget from './PrayerWidget';
import DailyVerse from './DailyVerse';
import QuickActions from './QuickActions';
import BottomNav from './BottomNav';
import QuranLayout from './QuranLayout';
import DuasLayout from './DuasLayout';
import NisaLayout from './NisaLayout';

import ProfileLayout from './ProfileLayout';
import QiblaFinder from './QiblaFinder';
import { usePeriodMode } from '../contexts/PeriodModeContext';

export default function MobileLayout() {
  const [activeTab, setActiveTab] = useState('home');
  const [isQuranReading, setIsQuranReading] = useState(false);
  const { isPeriodMode } = usePeriodMode();

  useEffect(() => {
    if (activeTab !== 'quran') {
      setIsQuranReading(false);
    }
  }, [activeTab]);

  return (
    <div className="h-screen w-full flex items-center justify-center p-0 sm:p-6 bg-gray-200">
      <div 
        className={`w-full h-screen sm:h-[850px] max-w-[400px] transition-colors duration-500 sm:rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col sm:border-[8px] border-white ${
          isPeriodMode ? 'bg-[#FCF5F5]' : 'bg-warm-beige'
        }`}
      >
        <div className="flex-1 overflow-y-auto w-full relative scroll-smooth flex flex-col">
          {activeTab === 'home' && (
            <div className="animate-in fade-in duration-300">
              <Header />
              <PrayerWidget onNavigate={setActiveTab} />
              <DailyVerse />
              <QuickActions onNavigate={setActiveTab} />
            </div>
          )}
          {activeTab === 'quran' && (
            <QuranLayout onReadingModeChange={setIsQuranReading} />
          )}
          {activeTab === 'duas' && <DuasLayout />}
          {activeTab === 'nisa' && <NisaLayout />}
          {activeTab === 'profile' && <ProfileLayout />}
          {activeTab === 'qibla' && <QiblaFinder onBack={() => setActiveTab('home')} />}
          {/* Placeholders for other tabs to prevent crashing or empty states */}
        </div>
        <div
          id="floating-audio-root"
          className="absolute left-0 right-0 bottom-4 z-40 px-6 pb-4 pointer-events-none"
        />
        {!isQuranReading && (
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        )}
      </div>
    </div>
  );
}
