import React from 'react';
import { Moon, Flower2 } from 'lucide-react';
import { motion } from 'motion/react';
import { usePeriodMode } from '../contexts/PeriodModeContext';
import { useProfile } from '../contexts/ProfileContext';

export default function Header() {
  const { isPeriodMode, togglePeriodMode } = usePeriodMode();
  const { profile } = useProfile();

  const salam = profile.language === 'ur' ? 'السلام علیکم،' : 'Assalamu Alaikum,';

  return (
    <header className="flex items-center justify-between pt-8 pb-6 px-6">
      <div>
        <h1
          className={`text-2xl font-semibold text-gray-800 tracking-tight ${
            profile.language === 'ur' ? 'font-arabic' : ''
          }`}
          dir={profile.language === 'ur' ? 'rtl' : 'ltr'}
        >
          {salam}
        </h1>
        <h2
          className={`text-2xl font-medium text-gray-600 ${profile.language === 'ur' ? 'font-arabic' : ''}`}
          dir={profile.language === 'ur' ? 'rtl' : 'ltr'}
        >
          {profile.name}
        </h2>
      </div>

      <div className="flex flex-col items-center gap-1">
        <button
          onClick={togglePeriodMode}
          className={`relative w-14 h-8 rounded-full transition-colors duration-300 ease-in-out flex items-center px-1 ${
            isPeriodMode ? 'bg-soft-pink-dark' : 'bg-gray-200'
          }`}
          aria-label="Toggle Period Mode"
        >
          <motion.div
            animate={{ x: isPeriodMode ? 24 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center p-[4px]"
          >
            {isPeriodMode ? (
              <Flower2 className="w-full h-full text-soft-pink-dark" />
            ) : (
              <Moon className="w-full h-full text-gray-400" />
            )}
          </motion.div>
        </button>
        <span className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">
          Period Mode
        </span>
      </div>
    </header>
  );
}
