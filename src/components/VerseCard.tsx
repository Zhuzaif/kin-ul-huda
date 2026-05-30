import React, { useEffect, useRef, useState } from 'react';
import { Play, Share2, Heart } from 'lucide-react';

interface VerseCardProps {
  verseNumber: number;
  arabicText: string;
  translationText: string;
  isActive?: boolean;
  isSaved?: boolean;
  onSaveToggle?: (isSaved: boolean) => void;
  onPlay?: () => void;
  onShare?: () => void;
  onSelect?: () => void;
  id?: string;
  key?: string | number;
}

export default function VerseCard({
  verseNumber,
  arabicText,
  translationText,
  isActive = false,
  isSaved,
  onSaveToggle,
  onPlay,
  onShare,
  onSelect,
  id,
}: VerseCardProps) {
  const [localSaved, setLocalSaved] = useState(isSaved ?? false);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof isSaved === 'boolean') {
      setLocalSaved(isSaved);
    }
  }, [isSaved]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const currentSaved = typeof isSaved === 'boolean' ? isSaved : localSaved;

  const handleSave = () => {
    const next = !currentSaved;
    if (typeof isSaved !== 'boolean') {
      setLocalSaved(next);
    }

    if (next) {
      setIsAnimating(true);
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        setIsAnimating(false);
      }, 260);
    }

    onSaveToggle?.(next);
  };

  const cardClasses = `rounded-[24px] p-5 shadow-[0_8px_20px_rgba(0,0,0,0.04)] border transition-colors ${
    isActive
      ? 'bg-soft-mint/60 border-soft-mint-dark/40'
      : 'bg-white/80 border-white/70'
  }`;

  return (
    <div className={cardClasses} onClick={onSelect} role={onSelect ? 'button' : undefined} id={id}>
      <div className="flex items-start gap-4">
        <div className="w-9 h-9 rounded-full bg-soft-mint text-[#2B604A] flex items-center justify-center text-[12px] font-bold shadow-inner">
          {verseNumber}
        </div>
        <div className="flex-1">
          <p className="font-arabic text-[26px] leading-[2.1] text-gray-800 text-right" dir="rtl">
            {arabicText}
          </p>
          <p className="text-[13.5px] text-gray-600 leading-relaxed mt-3">
            {translationText}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-100/80 mt-4 pt-3 flex items-center gap-3 text-gray-500">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onPlay?.();
          }}
          className="w-9 h-9 rounded-full bg-white/70 border border-white/70 flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Play verse audio"
        >
          <Play className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onShare?.();
          }}
          className="w-9 h-9 rounded-full bg-white/70 border border-white/70 flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Share verse"
        >
          <Share2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleSave();
          }}
          className={`w-9 h-9 rounded-full bg-white/70 border border-white/70 flex items-center justify-center hover:bg-white transition-colors ${
            isAnimating ? 'save-pop' : ''
          }`}
          aria-label={currentSaved ? 'Remove from favorites' : 'Save to favorites'}
          aria-pressed={currentSaved}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              currentSaved
                ? 'fill-soft-pink-dark text-soft-pink-dark'
                : 'text-gray-400'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
