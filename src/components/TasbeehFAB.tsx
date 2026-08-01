import React from 'react';
import { CircleDashed } from 'lucide-react';

interface TasbeehFABProps {
  onOpen?: () => void;
}

export default function TasbeehFAB({ onOpen }: TasbeehFABProps) {
  return (
    <div className="absolute right-6 bottom-[100px] z-40">
      <button
        type="button"
        onClick={onOpen}
        className="w-16 h-16 bg-gradient-to-b from-[#35755A] to-[#1F4535] rounded-full flex items-center justify-center shadow-[0_6px_0_#0F241B,0_15px_25px_rgba(43,96,74,0.3)] active:shadow-[0_0px_0_#0F241B,0_5px_10px_rgba(43,96,74,0.4)] active:translate-y-[6px] transition-all group relative border border-[#408568]"
        aria-label="Open Tasbeeh Counter"
      >
        {/* Subtle Glowing Aura Effect */}
        <div className="absolute -inset-2 bg-theme-accent-soft-dark/30 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
        <CircleDashed className="w-7 h-7 text-theme-accent-soft relative z-10 opacity-90 stroke-[2.5]" />
      </button>
    </div>
  );
}
