import React, { useState, useRef, useEffect } from 'react';
import { Sunrise, Pencil, X, BookMarked, Sparkles, BookOpenCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useProfile } from '../contexts/ProfileContext';

export default function DailyGoalWidget() {
  const { profile, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasGoal = profile.spiritualGoal.trim().length > 0;
  const isUrdu = profile.language === 'ur';

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [isEditing]);

  const handleChange = (value: string) => {
    updateProfile({ spiritualGoal: value.slice(0, 200) });
  };

  const fillQuickGoal = (text: string) => {
    updateProfile({ spiritualGoal: text });
  };

  const label = isUrdu ? 'آج کی نیّت' : "Today's Niyyah";
  const emptyPrompt = isUrdu
    ? 'آج کے لیے ایک نیک نیّت رکھیں'
    : 'Set a mindful intention for your day';
  const placeholder = isUrdu
    ? 'آج آپ کون سا روحانی مقصد حاصل کرنا چاہتی ہیں؟'
    : 'What spiritual goal would you like to achieve today?';
  const setGoalLabel = isUrdu ? 'نیّت لکھیں' : 'Set Goal';

  return (
    <div className="px-6 mb-4">
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-theme-surface-card backdrop-blur-sm rounded-[24px] p-4 shadow-[var(--nisa-shadow-card)] border border-theme-border"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-theme-accent-soft text-theme-accent border border-theme-accent/10">
                  <Sunrise className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-text-primary">{label}</span>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="w-7 h-7 rounded-full bg-theme-surface-dark flex items-center justify-center active:scale-95 transition-all"
              >
                <X className="w-3.5 h-3.5 text-text-tertiary" />
              </button>
            </div>

            <textarea
              ref={textareaRef}
              rows={2}
              maxLength={200}
              value={profile.spiritualGoal}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={placeholder}
              className="w-full text-[12px] bg-theme-surface-dark rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-theme-accent/20 transition resize-none leading-relaxed border border-transparent text-text-secondary placeholder:text-text-muted"
              dir={isUrdu ? 'rtl' : 'ltr'}
            />

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-[75%]">
                <button
                  onClick={() => fillQuickGoal('Recite Surah Al-Kahf')}
                  className="px-2 py-0.5 rounded-xl text-[10px] font-medium whitespace-nowrap transition opacity-90 hover:opacity-100 flex items-center gap-1 bg-theme-accent-soft text-theme-accent"
                >
                  <BookMarked className="w-3 h-3" /> Read Kahf
                </button>
                <button
                  onClick={() => fillQuickGoal('100x Astaghfirullah after Asr')}
                  className="px-2 py-0.5 rounded-xl text-[10px] font-medium whitespace-nowrap transition opacity-90 hover:opacity-100 flex items-center gap-1 bg-theme-accent-soft text-theme-accent"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" /> Istighfar
                </button>
                <button
                  onClick={() => fillQuickGoal('Learn 1 new Ayah of Quran')}
                  className="px-2 py-0.5 rounded-xl text-[10px] font-medium whitespace-nowrap transition opacity-90 hover:opacity-100 flex items-center gap-1 bg-theme-accent-soft text-theme-accent"
                >
                  <BookOpenCheck className="w-3 h-3" /> Learn Ayah
                </button>
              </div>
              <span className="font-mono text-[10px] text-text-muted">
                {profile.spiritualGoal.length}/200
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="display"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsEditing(true)}
            className="w-full text-left bg-theme-surface-card backdrop-blur-sm rounded-[24px] p-4 shadow-[var(--nisa-shadow-card)] border border-theme-border active:scale-[0.99] transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-theme-accent-soft text-theme-accent border border-theme-accent/10 shrink-0">
                <Sunrise className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-theme-accent/70">
                  {label}
                </span>
                {hasGoal ? (
                  <p
                    className="text-[13px] text-text-secondary leading-snug mt-0.5 line-clamp-2"
                    dir={isUrdu ? 'rtl' : 'ltr'}
                  >
                    {profile.spiritualGoal}
                  </p>
                ) : (
                  <p className="text-[12px] text-text-muted italic mt-0.5">
                    {emptyPrompt}
                  </p>
                )}
              </div>
              <div className="shrink-0">
                {hasGoal ? (
                  <Pencil className="w-3.5 h-3.5 text-text-muted group-hover:text-theme-accent transition-colors" />
                ) : (
                  <span className="text-[11px] font-semibold text-theme-accent whitespace-nowrap">
                    {setGoalLabel}
                  </span>
                )}
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
