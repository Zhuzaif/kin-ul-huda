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
      
      <div className="bg-theme-surface-card p-1.5 rounded-full flex items-center shadow-inner border border-theme-border liquid-glass-nav relative z-10">
        <button
          onClick={() => onTabChange('All Duas')}
          className={`flex-1 py-3 rounded-[24px] text-sm font-bold transition-all duration-300 relative overflow-hidden ${
            activeTab === 'All Duas' 
              ? 'text-theme-accent-strong nav-item-active-bg bg-theme-surface-dark/60'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          All Duas
        </button>
        <button
          id="my-prayers-tab"
          onClick={() => onTabChange('My Prayers')}
          className={`flex-1 py-3 rounded-[24px] text-sm font-bold transition-all duration-300 relative overflow-hidden ${
            activeTab === 'My Prayers' 
              ? 'text-theme-accent-strong nav-item-active-bg bg-theme-surface-dark/60'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          My Prayers
        </button>
      </div>
    </div>
  );
}
