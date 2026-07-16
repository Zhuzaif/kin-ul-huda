import React from 'react';
import { Flower2, Sparkles } from 'lucide-react';

export default function NisaHeader() {
  return (
    <div className="px-6 pt-8 pb-2">
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-soft-pink via-[#FCE7D8] to-light-peach p-6 shadow-[0_4px_24px_rgba(217,138,91,0.12)] border border-white/60">
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-4 bottom-0 w-28 h-28 bg-soft-pink-dark/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D98A5B]">
                Purity & Fiqh
              </span>
              <Sparkles className="w-3.5 h-3.5 text-muted-gold" />
            </div>
            <h1 className="text-[26px] font-bold text-gray-800 tracking-tight leading-tight mb-1">
              Al-Nisa
            </h1>
            <p className="text-[13px] font-medium text-gray-600/90 leading-relaxed">
              Women&apos;s fiqh, cycle tracking & guided learning
            </p>
          </div>

          <div className="relative flex-shrink-0">
            <div className="absolute -inset-2 bg-soft-pink-dark/40 rounded-full blur-xl opacity-70" />
            <div className="relative w-14 h-14 rounded-full bg-white/80 backdrop-blur-sm border-2 border-white shadow-[0_4px_16px_rgba(235,182,186,0.35)] flex items-center justify-center">
              <Flower2 className="w-7 h-7 text-soft-pink-dark fill-soft-pink/50 stroke-[1.5]" />
            </div>
          </div>
        </div>

        <p
          className="relative z-10 mt-4 font-arabic text-lg text-[#D98A5B]/90 text-right leading-relaxed"
          dir="rtl"
        >
          وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ
        </p>
      </div>
    </div>
  );
}
