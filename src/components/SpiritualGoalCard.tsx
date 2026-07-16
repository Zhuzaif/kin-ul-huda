import React from 'react';
import { useProfile } from '../contexts/ProfileContext';

export default function SpiritualGoalCard() {
  const { profile, updateProfile } = useProfile();

  const handleChange = (value: string) => {
    updateProfile({ spiritualGoal: value.slice(0, 200) });
  };

  const label =
    profile.language === 'ur' ? 'میرا روحانی مقصد' : 'My Spiritual Goal';

  const placeholder =
    profile.language === 'ur'
      ? 'آپ کا روحانی مقصد کیا ہے؟'
      : 'What is your spiritual goal?';

  return (
    <div className="px-6 mb-8">
      <div className="bg-white/60 backdrop-blur-sm rounded-[24px] p-5 shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-white/60">
        <h3 className="text-sm font-bold text-gray-800 tracking-tight mb-3">{label}</h3>
        <div className="relative">
          <textarea
            value={profile.spiritualGoal}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-[#FAF8F5] rounded-2xl p-4 text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-muted-gold/30 border border-transparent focus:border-muted-gold/20 resize-none h-24 transition-all"
            dir={profile.language === 'ur' ? 'rtl' : 'ltr'}
          />
          <span className="absolute bottom-3 right-4 text-[10px] font-semibold text-gray-400">
            {profile.spiritualGoal.length}/200
          </span>
        </div>
      </div>
    </div>
  );
}
