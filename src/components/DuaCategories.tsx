import React from 'react';
import { Sun, Moon, BookOpen, Clock } from 'lucide-react';

const categories = [
  { label: 'AM & PM Adhkar', icon: Clock, color: 'text-soft-pink-dark', bg: 'bg-soft-pink' },
  { label: 'Quran', icon: BookOpen, color: 'text-[#2B604A]', bg: 'bg-soft-mint' },
];

interface DuaCategoriesProps {
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export default function DuaCategories({ activeCategory, onCategoryChange }: DuaCategoriesProps) {
  return (
    <div className="mb-6">
      <h3 className="text-[17px] font-bold text-gray-800 tracking-tight mb-4 px-6">Moments & Feelings</h3>
      <div className="flex gap-3 overflow-x-auto px-6 pb-4 scroll-smooth hide-scrollbar">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.label;
          
          return (
            <button 
              key={i} 
              onClick={() => onCategoryChange(isActive ? null : cat.label)}
              className={`flex items-center gap-3 pl-2 pr-5 py-2 rounded-full border shadow-sm whitespace-nowrap transition-all active:scale-95 ${
                isActive 
                  ? 'bg-white border-gray-200' 
                  : 'bg-white/60 hover:bg-white border-white/50'
              }`}
            >
              <div className={`w-9 h-9 rounded-full ${cat.bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${cat.color} stroke-[2.5]`} />
              </div>
              <span className={`text-[13px] font-bold tracking-tight ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
