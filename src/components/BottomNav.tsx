import React from 'react';
import { Home, Book, Heart, Flower2, User2 } from 'lucide-react';
import { motion } from 'motion/react';
import { buttonTap, EASING } from '../lib/motion';

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
      <div className="bg-theme-surface-card rounded-[32px] px-2 py-1.5 flex items-center justify-between shadow-[var(--nisa-shadow-card)] border border-theme-border liquid-glass-nav relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          let activeColorClass = 'text-theme-gold';
          if (item.id === 'nisa') activeColorClass = 'text-theme-rose';
          else if (item.id === 'quran') activeColorClass = 'text-theme-accent';

          return (
              <motion.button
                whileTap={buttonTap}
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center gap-1 relative group w-[64px] py-[10px] transition-colors duration-300 ${
                  isActive ? 'nav-item-active' : ''
                }`}
              >
                <div className="relative z-10 flex items-center justify-center">
                  <Icon
                    className={`w-[22px] h-[22px] transition-colors duration-300 ${
                      isActive
                        ? `${activeColorClass} stroke-[2.5]`
                        : 'text-text-muted stroke-2 group-hover:text-text-tertiary'
                    }`}
                  />
                </div>
                <span
                  className={`text-[9px] tracking-wide font-medium relative z-10 transition-colors duration-300 ${
                    isActive ? activeColorClass : 'text-text-muted'
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                    className="absolute inset-0 bg-theme-surface-dark/60 rounded-[26px] -z-0 nav-item-active-bg" 
                  />
                )}
              </motion.button>
          );
        })}
      </div>
    </div>
  );
}
