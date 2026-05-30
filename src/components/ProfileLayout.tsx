import React from 'react';
import ProfileHeader from './ProfileHeader';
import SpiritualGoalCard from './SpiritualGoalCard';
import SettingsList from './SettingsList';

export default function ProfileLayout() {
  return (
    <div className="flex w-full flex-col h-full animate-in fade-in duration-300 relative">
      <div className="flex-1 overflow-y-auto scroll-smooth hide-scrollbar">
        <ProfileHeader />
        <SpiritualGoalCard />
        <SettingsList />
      </div>
    </div>
  );
}
