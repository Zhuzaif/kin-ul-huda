import React from 'react';
import { Flower2, Sparkles } from 'lucide-react';

export default function NisaHeader() {
  return (
    <div className="px-6 pt-3 pb-2">
      <div className="relative overflow-hidden rounded-[32px] bg-theme-surface-card p-6 shadow-[var(--nisa-shadow-card)] border border-theme-border">
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-theme-accent-soft rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-4 bottom-0 w-28 h-28 bg-theme-accent-soft rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-theme-orange">
                Purity & Fiqh
              </span>
              <Sparkles className="w-3.5 h-3.5 text-theme-gold" />
            </div>
            <h1 className="text-[26px] font-bold text-text-primary tracking-tight leading-tight mb-1">
              Al-Nisa
            </h1>
            <p className="text-[13px] font-medium text-text-secondary leading-relaxed">
              Women&apos;s fiqh, cycle tracking & guided learning
            </p>
          </div>

          <div className="relative flex-shrink-0">
            <div className="absolute -inset-2 bg-theme-accent-soft-dark rounded-full blur-xl opacity-70" />
            <div className="relative w-14 h-14 rounded-full bg-theme-surface-elevated backdrop-blur-sm border border-theme-border-strong shadow-[var(--nisa-shadow-card)] flex items-center justify-center">
              <Flower2 className="w-7 h-7 text-theme-rose stroke-[1.5]" />
            </div>
          </div>
        </div>

        <p
          className="relative z-10 mt-4 font-arabic text-lg text-theme-accent text-right leading-relaxed"
          dir="rtl"
        >
          وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ
        </p>
      </div>
    </div>
  );
}
