import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Share2 } from 'lucide-react';
import { Dua } from '../types';

interface DuaDetailScreenProps {
  dua: Dua;
  onBack: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function DuaDetailScreen({ dua, onBack, onNext, onPrev }: DuaDetailScreenProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && onNext) {
      onNext();
    }
    if (isRightSwipe && onPrev) {
      onPrev();
    }
  };

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

  return (
    <div 
      className="absolute inset-0 bg-warm-beige z-50 flex flex-col animate-in fade-in slide-in-from-right-4 duration-300"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-warm-beige/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-gray-200/40">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100/50 hover:bg-gray-50 active:scale-95 transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100/50 hover:bg-gray-50 active:scale-95 transition-all">
            <Share2 className="w-4 h-4 text-gray-400" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100/50 hover:bg-gray-50 active:scale-95 transition-all">
            <Heart className="w-4 h-4 text-gray-300 hover:text-soft-pink-dark transition-colors" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-6 py-6 pb-32">
        <div className="bg-white/50 backdrop-blur-sm rounded-[32px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white/60 flex flex-col">
          {/* Title and Tags */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight mb-3">{dua.title}</h2>
            <div className="flex flex-wrap gap-2">
              {dua.tags?.map((tag, index) => {
                const style = getTagStyle(tag);
                return (
                  <span 
                    key={index} 
                    className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full shadow-sm ${style.bg} ${style.text}`}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Arabic Text */}
          <div className="mb-10 bg-white/40 p-6 rounded-[24px] border border-gray-100/30">
            <p className="font-arabic text-[28px] sm:text-[32px] leading-[2.2] text-gray-800 text-right" dir="rtl">
              {dua.arabic}
            </p>
          </div>

          {/* Translation */}
          {dua.translation && (
            <div className="pt-2">
              <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Translation</h3>
              <p className="text-[15px] sm:text-base text-gray-600 leading-relaxed font-medium mb-6">
                "{dua.translation}"
              </p>
            </div>
          )}

          {/* Repetition */}
          {dua.repetition && (
            <div className="pt-4 border-t border-gray-100/50 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Read</span>
              <span className="text-sm font-bold text-soft-pink-dark bg-soft-pink/30 px-3 py-1.5 rounded-full">
                {dua.repetition}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Swipe Navigation Bar */}
      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between bg-white/80 backdrop-blur-md px-6 py-4 rounded-full shadow-lg border border-gray-100/50">
        <button 
          onClick={onPrev}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center px-4">
          Swipe to navigate
        </span>
        
        <button 
          onClick={onNext}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
