import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Share2, Heart } from 'lucide-react';

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
      ? 'bg-theme-accent-soft/60 border-theme-accent-soft-dark/40'
      : 'bg-theme-surface-card border-theme-border'
  }`;

  return (
    <div className={cardClasses} onClick={onSelect} role={onSelect ? 'button' : undefined} id={id}>
      <div className="flex items-start gap-4">
        <div className="w-9 h-9 rounded-full bg-theme-accent-soft text-theme-accent flex items-center justify-center text-[12px] font-bold shadow-inner">
          {verseNumber}
        </div>
        <div className="flex-1">
          <p className="font-arabic text-[26px] leading-[2.1] text-text-primary text-right" dir="rtl">
            {arabicText}
          </p>
          <p className="text-[13.5px] text-text-secondary leading-relaxed mt-3">
            {translationText}
          </p>
        </div>
      </div>

      <div className="border-t border-theme-border mt-4 pt-3 flex items-center gap-3 text-text-tertiary">
        {onPlay && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onPlay();
            }}
            className="w-9 h-9 rounded-full bg-theme-surface-card border border-theme-border flex items-center justify-center hover:bg-theme-surface-elevated transition-colors"
            aria-label={isActive ? "Pause verse audio" : "Play verse audio"}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        )}
        {onShare && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onShare();
            }}
            className="w-9 h-9 rounded-full bg-theme-surface-card border border-theme-border flex items-center justify-center hover:bg-theme-surface-elevated transition-colors"
            aria-label="Share verse"
          >
            <Share2 className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleSave();
          }}
          className={`w-9 h-9 rounded-full bg-theme-surface-card border border-theme-border flex items-center justify-center hover:bg-theme-surface-elevated transition-colors ${
            isAnimating ? 'save-pop' : ''
          }`}
          aria-label={currentSaved ? 'Remove from favorites' : 'Save to favorites'}
          aria-pressed={currentSaved}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              currentSaved
                ? 'fill-theme-rose text-theme-rose'
                : 'text-text-muted'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
