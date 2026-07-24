import React, { useState, useEffect } from 'react';
import { Heart, ChevronRight, Trash2 } from 'lucide-react';
import duasDataRaw from '../data/duas.json';
import { Dua } from '../types';

const defaultDuas: Dua[] = duasDataRaw as Dua[];

interface DuaListProps {
  onSelectDua?: (dua: Dua, index: number, duaList: Dua[]) => void;
  onDeleteDua?: (duaId: Dua['id']) => void;
  activeTab: string;
  activeCategory: string | null;
  refreshTrigger?: number;
}

export default function DuaList({ onSelectDua, onDeleteDua, activeTab, activeCategory, refreshTrigger }: DuaListProps) {
  const [customDuas, setCustomDuas] = useState<Dua[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('customDuas') || '[]');
      setCustomDuas(stored);
    } catch (e) {
      console.error('Failed to load custom duas', e);
    }
  }, [refreshTrigger, activeTab]);

  // Filter logic
  let filteredDuas = defaultDuas;

  if (activeTab === 'My Prayers') {
    filteredDuas = customDuas;
  }

  if (activeCategory) {
    if (activeCategory === 'AM & PM Adhkar') {
      filteredDuas = filteredDuas.filter(dua => {
        const idNum = Number(dua.id);
        return idNum >= 73 && idNum <= 93;
      });
    } else {
      let filterString = activeCategory.toLowerCase();
      filteredDuas = filteredDuas.filter(dua => {
        return dua.tags?.some(tag => tag.toLowerCase().includes(filterString));
      });
    }
  }

  // Mapping tags to specific colors
  const getTagStyle = (tag: string) => {
    const normalizedTag = tag.toLowerCase();
    if (normalizedTag.includes('quran')) {
      return { bg: 'bg-muted-gold-light', text: 'text-muted-gold' };
    }
    if (normalizedTag.includes('morning')) {
      return { bg: 'bg-soft-mint', text: 'text-[#2B604A]' };
    }
    return { bg: 'bg-gray-100', text: 'text-gray-500' };
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <div className="px-6 pb-36 flex flex-col gap-4">
      {filteredDuas.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          <p>No duas found.</p>
        </div>
      )}
      {filteredDuas.map((dua, index) => (
        <div key={dua.id} className="bg-white/50 rounded-[32px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-white/60 flex flex-col relative group">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex gap-2 flex-wrap">
                {dua.tags?.map((tag, tagIndex) => {
                  const style = getTagStyle(tag);
                  return (
                    <span 
                      key={tagIndex} 
                      className={`text-[9.5px] uppercase font-bold tracking-wider ${style.text} ${style.bg} px-2.5 py-1 rounded-full shadow-sm`}
                    >
                      {tag}
                    </span>
                  );
                })}
                {dua.repetition && (
                    <span className="text-[9.5px] uppercase font-bold tracking-wider text-soft-pink-dark bg-soft-pink/30 px-2.5 py-1 rounded-full shadow-sm">
                      {dua.repetition}
                    </span>
                )}
              </div>
            </div>
              <div className="flex items-center gap-2">
                {activeTab === 'My Prayers' && dua.isCustom && onDeleteDua && (
                  <button
                    onClick={() => {
                      if (!window.confirm('Delete this dua from My Prayers?')) return;
                      onDeleteDua(dua.id);
                    }}
                    className="h-10 px-4 rounded-full bg-white flex items-center justify-center gap-2 shadow-sm border border-gray-100/50 hover:bg-red-50 transition-colors"
                    aria-label="Delete dua"
                  >
                    <Trash2 className="w-4 h-4 text-gray-300 hover:text-red-500 transition-colors" />
                    <span className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors">Delete</span>
                  </button>
                )}
                <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100/50 hover:bg-gray-50 transition-colors">
                  <Heart className="w-4 h-4 text-gray-300 hover:text-soft-pink-dark transition-colors" />
                </button>
              </div>
          </div>
          
          <div className="mb-4">
            <p className="font-arabic text-[26px] leading-[2] text-gray-800 py-2 text-right" dir="rtl">
              {dua.arabic}
            </p>
          </div>

          <div className="border-t border-gray-200/40 pt-4 flex justify-center">
            <button 
              onClick={() => onSelectDua && onSelectDua(dua, index, filteredDuas)}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-400 group-hover:text-[#D98A5B] transition-colors"
            >
              Read more
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
