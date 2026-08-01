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
      return { bg: 'bg-theme-accent-soft', text: 'text-theme-gold' };
    }
    if (normalizedTag.includes('morning')) {
      return { bg: 'bg-theme-accent-soft', text: 'text-theme-accent' };
    }
    return { bg: 'bg-theme-surface-input', text: 'text-text-tertiary' };
  };

  return (
    <div 
      className="absolute inset-0 bg-theme-surface z-50 flex flex-col animate-in fade-in slide-in-from-right-4 duration-300"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-theme-surface/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-theme-border">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-theme-surface-card shadow-sm border border-theme-border hover:bg-theme-surface-input active:scale-95 transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-text-secondary" />
        </button>
        <div className="flex gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-theme-surface-card shadow-sm border border-theme-border hover:bg-theme-surface-input active:scale-95 transition-all">
            <Share2 className="w-4 h-4 text-text-muted" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-theme-surface-card shadow-sm border border-theme-border hover:bg-theme-surface-input active:scale-95 transition-all">
            <Heart className="w-4 h-4 text-text-muted hover:text-theme-rose transition-colors" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-6 py-6 pb-32">
        <div className="bg-theme-surface-card backdrop-blur-sm rounded-[32px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-theme-border flex flex-col">
          {/* Title and Tags */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-primary tracking-tight mb-3">{dua.title}</h2>
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
          <div className="mb-10 bg-theme-surface-card p-6 rounded-[24px] border border-theme-border">
            <p className="font-arabic text-[28px] sm:text-[32px] leading-[2.2] text-text-primary text-right" dir="rtl">
              {dua.arabic}
            </p>
          </div>

          {/* Translation */}
          {dua.translation && (
            <div className="pt-2">
              <h3 className="text-sm font-bold text-text-muted mb-3 uppercase tracking-wider">Translation</h3>
              <p className="text-[15px] sm:text-base text-text-secondary leading-relaxed font-medium mb-6">
                "{dua.translation}"
              </p>
            </div>
          )}

          {/* Repetition */}
          {dua.repetition && (
            <div className="pt-4 border-t border-theme-border flex items-center justify-between">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Read</span>
              <span className="text-sm font-bold text-theme-rose bg-theme-surface-input px-3 py-1.5 rounded-full">
                {dua.repetition}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Swipe Navigation Bar */}
      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between bg-theme-surface-card backdrop-blur-md px-6 py-4 rounded-full shadow-lg border border-theme-border">
        <button 
          onClick={onPrev}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-theme-surface-alt text-text-tertiary hover:bg-theme-surface-input hover:text-text-primary transition-colors active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <span className="text-xs font-bold text-text-muted uppercase tracking-widest text-center px-4">
          Swipe to navigate
        </span>
        
        <button 
          onClick={onNext}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-theme-surface-alt text-text-tertiary hover:bg-theme-surface-input hover:text-text-primary transition-colors active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
