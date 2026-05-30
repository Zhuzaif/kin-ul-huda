import React from 'react';
import chapters from '../data/chapters-en.json';

type Chapter = {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: 'meccan' | 'medinan';
  total_verses: number;
};

const surahs = chapters as Chapter[];

interface SurahListProps {
  onSelect?: (id: number) => void;
  items?: Chapter[];
  emptyLabel?: string;
}

export default function SurahList({ onSelect, items, emptyLabel }: SurahListProps) {
  const list = items ?? surahs;

  if (list.length === 0) {
    return (
      <div className="px-6 pb-28">
        <div className="bg-white/70 border border-white/70 rounded-[22px] p-4 text-sm text-gray-500 text-center">
          {emptyLabel ?? 'No results found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pb-28 flex flex-col gap-3">
      {list.map((surah) => (
        <button 
          key={surah.id}
          onClick={() => onSelect?.(surah.id)}
          aria-label={`Open ${surah.transliteration}`}
          className="bg-white/50 hover:bg-white/80 transition-colors rounded-[24px] p-4 flex items-center gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-white/60 text-left relative overflow-hidden group"
        >
          {/* Subtle hover effect background */}
          <div className="absolute inset-0 bg-gradient-to-r from-soft-mint/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          
          <div className="w-[42px] h-[42px] bg-soft-mint rounded-full flex flex-shrink-0 items-center justify-center text-[#2B604A] font-bold text-[13px] shadow-sm">
            {surah.id}
          </div>
          
          <div className="flex-1 z-10">
            <h4 className="text-[15px] font-bold text-gray-800 tracking-tight">{surah.transliteration}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[9.5px] font-semibold text-gray-500">
                {surah.total_verses} VERSES
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="text-[9px] uppercase font-bold tracking-wider text-muted-gold bg-muted-gold-light/60 px-2 py-0.5 rounded-full">
                {surah.type === 'meccan' ? 'Meccan' : 'Medinan'}
              </span>
            </div>
          </div>
          
          <div className="text-2xl font-arabic text-gray-800/90 font-bold z-10 pr-1 group-hover:text-muted-gold transition-colors">
            {surah.name}
          </div>
        </button>
      ))}
    </div>
  );
}
