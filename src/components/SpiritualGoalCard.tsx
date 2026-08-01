import React from 'react';
import {
  Sunrise,
  ShieldCheck,
  Check,
  BookMarked,
  Sparkles,
  BookOpenCheck,
} from 'lucide-react';
import { useProfile } from '../contexts/ProfileContext';

export default function SpiritualGoalCard() {
  const { profile, updateProfile } = useProfile();

  const handleChange = (value: string) => {
    updateProfile({ spiritualGoal: value.slice(0, 200) });
  };

  const fillQuickGoal = (text: string) => {
    updateProfile({ spiritualGoal: text });
  };

  const label =
    profile.language === 'ur' ? 'میری روزانہ نیّت اور مقصد' : 'My Daily Niyyah & Goal';
  const sublabel =
    profile.language === 'ur' ? 'آج کے لیے ایک نیک نیّت رکھیں' : 'Set a mindful intention for today';
  const placeholder =
    profile.language === 'ur'
      ? 'آج آپ کون سا روحانی مقصد حاصل کرنا چاہتی ہیں؟'
      : 'What intention or spiritual goal would you like to achieve today? (e.g. Recite Surah Kahf, 100x Istighfar...)';

  return (
    <div className="px-6 mb-4">
      <div className="bg-theme-surface-card backdrop-blur-sm rounded-[24px] p-5 shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-theme-border">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm">
              <Sunrise className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-text-primary">{label}</h2>
              <p className="text-[11px] text-text-muted">{sublabel}</p>
            </div>
          </div>


        </div>

        {/* Textarea */}
        <div className="relative mb-3">
          <textarea
            rows={3}
            maxLength={200}
            value={profile.spiritualGoal}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            className="w-full text-[12px] bg-theme-surface rounded-2xl p-3.5 focus:outline-none focus:ring-2 focus:ring-theme-accent/20 transition resize-none leading-relaxed border border-transparent text-text-secondary placeholder:text-text-muted"
            dir={profile.language === 'ur' ? 'rtl' : 'ltr'}
          />

          <div className="flex items-center justify-between mt-2 text-[11px]">
            {/* Quick Suggestion Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-[70%]">
              <button
                onClick={() => fillQuickGoal('Recite Surah Al-Kahf')}
                className="px-2.5 py-1 rounded-xl text-[10px] font-medium whitespace-nowrap transition opacity-90 hover:opacity-100 flex items-center gap-1 bg-theme-accent-soft text-theme-accent"
              >
                <BookMarked className="w-3 h-3" /> Read Kahf
              </button>
              <button
                onClick={() => fillQuickGoal('100x Astaghfirullah after Asr')}
                className="px-2.5 py-1 rounded-xl text-[10px] font-medium whitespace-nowrap transition opacity-90 hover:opacity-100 flex items-center gap-1 bg-theme-accent-soft text-theme-accent"
              >
                <Sparkles className="w-3 h-3 text-amber-500" /> 100x Istighfar
              </button>
              <button
                onClick={() => fillQuickGoal('Learn 1 new Ayah of Quran')}
                className="px-2.5 py-1 rounded-xl text-[10px] font-medium whitespace-nowrap transition opacity-90 hover:opacity-100 flex items-center gap-1 bg-theme-accent-soft text-theme-accent"
              >
                <BookOpenCheck className="w-3 h-3" /> Learn 1 Ayah
              </button>
            </div>

            <span className="font-mono text-[10px] text-text-muted">
              {profile.spiritualGoal.length}/200
            </span>
          </div>
        </div>

        {/* Save row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-[11px] text-text-tertiary">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Private to you</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600">
            <Check className="w-3.5 h-3.5" />
            <span className="font-medium">Auto-saved</span>
          </div>
        </div>
      </div>
    </div>
  );
}
