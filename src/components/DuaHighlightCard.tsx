import React from 'react';
import { Heart, HandHeart } from 'lucide-react';

interface DuaHighlightCardProps {
  onAddDua?: () => void;
}

export default function DuaHighlightCard({ onAddDua }: DuaHighlightCardProps) {
  return (
    <div className="px-6 mb-8">
      <div className="bg-gradient-to-br from-light-peach to-[#FCE7D8] rounded-[32px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden group">
        {/* Subtle Background Illustration / Element */}
        <div className="absolute -right-6 -bottom-6 text-light-peach-dark opacity-40 transform rotate-12 transition-transform group-hover:rotate-6">
          <HandHeart className="w-48 h-48 stroke-1" />
        </div>
        
        <div className="relative z-10">
          <h3 className="text-[10px] font-bold text-[#D98A5B] uppercase tracking-widest mb-1.5">Personal Space</h3>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight mb-2">Your Dua Collection</h2>
          <p className="text-sm font-medium text-gray-600 mb-6 max-w-[210px] leading-relaxed">
            Create and save your personal prayers for moments of need and reflection.
          </p>
          
          <button 
            onClick={onAddDua}
            className="flex items-center gap-2 bg-white/90 hover:bg-white transition-colors text-[#D98A5B] text-[13px] font-bold px-6 py-3 rounded-full shadow-sm"
          >
            <Heart className="w-4 h-4 fill-current transition-transform group-hover:scale-110" />
            Add your own dua
          </button>
        </div>
      </div>
    </div>
  );
}
