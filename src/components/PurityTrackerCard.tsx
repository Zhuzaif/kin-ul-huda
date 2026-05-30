import React from 'react';
import { Heart } from 'lucide-react';

export default function PurityTrackerCard() {
  return (
    <div className="px-6 mb-8 mt-4">
      <div className="bg-white rounded-[32px] p-6 shadow-[0_6px_30px_rgba(0,0,0,0.04)] border border-white/60 relative overflow-hidden">
        
        <h2 className="text-center text-lg font-bold text-gray-800 tracking-tight mb-8">My Cycle & Purity</h2>
        
        {/* Tracker Ring */}
        <div className="flex justify-center mb-8 relative">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* Background Ring */}
            <svg className="w-full h-full transform -rotate-90 drop-shadow-sm absolute inset-0" viewBox="0 0 36 36">
              <path
                className="text-gray-50"
                strokeWidth="2.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#EBB6BA]"
                strokeWidth="2.5"
                strokeDasharray="28, 100"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pt-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Cycle</span>
              <span className="text-3xl font-bold text-gray-800 tracking-tight">Day 4</span>
              <span className="text-[11px] font-bold text-soft-pink-dark uppercase tracking-wider mt-2 bg-soft-pink-dark/10 px-3.5 py-1.5 rounded-full border border-soft-pink-dark/20">
                Haiz
              </span>
            </div>
            
            {/* Soft decorative glow */}
            <div className="absolute inset-0 bg-soft-pink-dark/10 rounded-full blur-2xl z-0 scale-90" />
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100/50">
            <div className="w-2.5 h-2.5 rounded-full bg-[#EBB6BA]" />
            <span className="text-[10px] font-bold text-gray-600">Haiz (Period)</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100/50">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
            <span className="text-[10px] font-bold text-gray-600">Istihada (Irregular)</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100/50">
            <div className="w-2.5 h-2.5 rounded-full bg-soft-mint-dark" />
            <span className="text-[10px] font-bold text-gray-600">Taharah (Pure)</span>
          </div>
        </div>

        {/* Reminder */}
        <div className="bg-[#FAF8F5] rounded-[20px] p-4 flex items-start gap-3.5 border border-white/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
            <Heart className="w-5 h-5 text-soft-pink-dark fill-current" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800 mb-1">Salah is paused.</p>
            <p className="text-[13px] font-medium text-gray-500 leading-relaxed">Enhance your day with Dhikr and reflecting on the Quran.</p>
          </div>
        </div>
        
      </div>
    </div>
  );
}
