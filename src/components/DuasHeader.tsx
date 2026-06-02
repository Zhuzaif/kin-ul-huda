import React from 'react';

interface DuasHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function DuasHeader({ activeTab, onTabChange }: DuasHeaderProps) {
  return (
    <div className="pt-8 pb-4 px-6">
      <h1 className="text-3xl font-bold text-gray-800 tracking-tight mb-6">
        Duas & Dhikr
      </h1>
      
      <div className="bg-white/50 backdrop-blur-sm p-1.5 rounded-full flex items-center shadow-inner border border-white/60">
        <button
          onClick={() => onTabChange('All Duas')}
          className={`flex-1 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
            activeTab === 'All Duas' 
              ? 'bg-white text-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.04)]' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          All Duas
        </button>
        <button
          onClick={() => onTabChange('My Prayers')}
          className={`flex-1 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
            activeTab === 'My Prayers' 
              ? 'bg-white text-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.04)]' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          My Prayers
        </button>
      </div>
    </div>
  );
}
