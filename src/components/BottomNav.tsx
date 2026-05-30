import React from 'react';
import { Home, Book, Heart, Flower2, User2 } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'quran', label: 'Quran', icon: Book },
    { id: 'duas', label: 'Duas', icon: Heart },
    { id: 'nisa', label: 'Al-Nisa', icon: Flower2 },
    { id: 'profile', label: 'Profile', icon: User2 },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 z-30 pointer-events-auto">
      <div className="bg-[#FAF8F5] rounded-[32px] px-6 py-4 flex items-center justify-between shadow-[0_-8px_30px_rgba(0,0,0,0.04)] border border-white/40 backdrop-blur-xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          let activeColorClass = 'text-muted-gold';
          if (item.id === 'nisa') activeColorClass = 'text-soft-pink-dark';
          else if (item.id === 'quran') activeColorClass = 'text-[#2B604A]';

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="flex flex-col items-center gap-1.5 relative group"
            >
              <div className="relative">
                {isActive && (
                  <div className="absolute -inset-2 bg-warm-beige-dark rounded-full -z-10" />
                )}
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive
                      ? `${activeColorClass} stroke-[2.5]`
                      : 'text-gray-400 stroke-2 group-hover:text-gray-600'
                  }`}
                />
              </div>
              <span
                className={`text-[9.5px] tracking-wide font-medium ${
                  isActive ? activeColorClass : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
