import React from 'react';

export type QuranFilterId = 'surah' | 'juz' | 'mushaf' | 'bookmarks' | 'sajda';

const filters: { id: QuranFilterId; label: string }[] = [
  { id: 'surah', label: 'Surah' },
  { id: 'juz', label: 'Juz' },
  { id: 'mushaf', label: 'Mushaf' },
  { id: 'bookmarks', label: 'Bookmarks' },
  { id: 'sajda', label: 'Sajda' },
];

interface QuranFiltersProps {
  activeFilter: QuranFilterId;
  onChange: (filterId: QuranFilterId) => void;
}

export default function QuranFilters({ activeFilter, onChange }: QuranFiltersProps) {
  return (
    <div className="px-6 mb-4">
      <div className="flex gap-2.5 overflow-x-auto pb-1 hide-scrollbar">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => onChange(filter.id)}
              className={`whitespace-nowrap px-[18px] py-2 rounded-[12px] text-[13px] font-medium transition-all border ${isActive
                ? 'bg-[#0B4D3C] text-white border-[#0B4D3C]'
                : 'bg-white text-gray-700 border-[#E0E0E0] hover:bg-gray-50'
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
