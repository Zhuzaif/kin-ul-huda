import React from 'react';
import { Sun, Moon, Waves, Leaf } from 'lucide-react';

const categories = [
  { label: 'Morning', icon: Sun, color: 'text-muted-gold', bg: 'bg-muted-gold-light' },
  { label: 'Evening', icon: Moon, color: 'text-gray-500', bg: 'bg-gray-100' },
  { label: 'Anxiety', icon: Waves, color: 'text-[#2B604A]', bg: 'bg-soft-mint' },
  { label: 'Gratitude', icon: Leaf, color: 'text-soft-pink-dark', bg: 'bg-soft-pink' },
];

export default function DuaCategories() {
  return (
    <div className="mb-6">
      <h3 className="text-[17px] font-bold text-gray-800 tracking-tight mb-4 px-6">Moments & Feelings</h3>
      <div className="flex gap-3 overflow-x-auto px-6 pb-4 scroll-smooth hide-scrollbar">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <button 
              key={i} 
              className="flex items-center gap-3 bg-white/60 hover:bg-white pl-2 pr-5 py-2 rounded-full border border-white/50 shadow-sm whitespace-nowrap transition-all active:scale-95"
            >
              <div className={`w-9 h-9 rounded-full ${cat.bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${cat.color} stroke-[2.5]`} />
              </div>
              <span className="text-[13px] font-bold text-gray-700 tracking-tight">{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
