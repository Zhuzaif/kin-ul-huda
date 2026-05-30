import React from 'react';

export type QuranFilterId = 'quran' | 'mushaf' | 'friday' | 'saved';

const filters: { id: QuranFilterId; label: string }[] = [
  { id: 'quran', label: 'Quran' },
  { id: 'mushaf', label: 'Mushaf' },
  { id: 'friday', label: 'Friday Surahs (Al-Kahf)' },
  { id: 'saved', label: 'Saved Verses' },
];

interface QuranFiltersProps {
  activeFilter: QuranFilterId;
  onChange: (filterId: QuranFilterId) => void;
}

export default function QuranFilters({ activeFilter, onChange }: QuranFiltersProps) {
  return (
    <div className="pl-6 mb-6">
      <div className="flex gap-2.5 overflow-x-auto pr-6 pb-2 scroll-smooth hide-scrollbar">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <button 
              key={filter.id}
              onClick={() => onChange(filter.id)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-[20px] text-xs font-semibold transition-all shadow-sm border border-white/40 ${
                isActive 
                  ? 'bg-[#2B604A] text-white' 
                  : 'bg-white/80 text-gray-600 hover:bg-white'
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
