import React from 'react';

interface DuasHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function DuasHeader({ activeTab, onTabChange }: DuasHeaderProps) {
  return (
    <div className="pt-3 pb-4 px-6">
      <h1 className="text-3xl font-bold text-text-primary tracking-tight mb-6">
        Duas & Dhikr
      </h1>
      
      <div className="bg-theme-surface-card backdrop-blur-sm p-1.5 rounded-full flex items-center shadow-inner border border-theme-border">
        <button
          onClick={() => onTabChange('All Duas')}
          className={`flex-1 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
            activeTab === 'All Duas' 
              ? 'bg-theme-surface-card text-text-primary shadow-[0_2px_10px_rgba(0,0,0,0.04)]'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          All Duas
        </button>
        <button
          onClick={() => onTabChange('My Prayers')}
          className={`flex-1 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
            activeTab === 'My Prayers' 
              ? 'bg-theme-surface-card text-text-primary shadow-[0_2px_10px_rgba(0,0,0,0.04)]'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          My Prayers
        </button>
      </div>
    </div>
  );
}
