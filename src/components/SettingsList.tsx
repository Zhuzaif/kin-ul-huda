import React from 'react';
import { User2, Flower2, Moon, Globe, CloudDownload, ChevronRight, Heart } from 'lucide-react';

const settingsItems = [
  {
    id: 'preferences',
    title: 'My Preferences',
    icon: User2,
    secondary: '',
    color: 'text-gray-600',
    bg: 'bg-gray-100',
  },
  {
    id: 'period',
    title: 'Period Tracker Settings',
    icon: Flower2,
    secondary: 'Cycle: 28 Days, Period: 8 Days',
    color: 'text-soft-pink-dark',
    bg: 'bg-soft-pink',
  },
  {
    id: 'theme',
    title: 'Theme',
    icon: Moon,
    secondary: 'Serenity (Warm & Bright)',
    color: 'text-muted-gold',
    bg: 'bg-muted-gold-light',
  },
  {
    id: 'language',
    title: 'Language',
    icon: Globe,
    secondary: 'English',
    color: 'text-[#2B604A]',
    bg: 'bg-soft-mint',
  },
  {
    id: 'downloads',
    title: 'Downloads',
    icon: CloudDownload,
    secondary: 'Manage offline surahs',
    color: 'text-gray-600',
    bg: 'bg-gray-100',
  },
];

export default function SettingsList() {
  return (
    <div className="px-6 pb-32">
      <div className="flex flex-col gap-3 mb-8">
        {settingsItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className="w-full flex items-center justify-between bg-white/70 hover:bg-white backdrop-blur-sm p-4 rounded-[20px] shadow-sm border border-white/60 transition-all active:scale-[0.98] group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${item.color} stroke-[2]`} />
                </div>
                <div className="flex flex-col items-start">
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

      <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-soft-pink-dark to-[#D98A5B] text-white py-4 rounded-[24px] shadow-[0_4px_15px_rgba(235,182,186,0.3)] active:translate-y-1 transition-all">
        <Heart className="w-5 h-5 fill-current" />
        <span className="text-[15px] font-bold">Support Us</span>
      </button>
    </div>
  );
}
