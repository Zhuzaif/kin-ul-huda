import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Pause, Play, SkipBack, SkipForward } from 'lucide-react';

type ReciterOption = {
  id: string;
  label: string;
};

interface FloatingAudioPlayerProps {
  isPlaying: boolean;
  progress: number;
  reciterOptions: ReciterOption[];
  selectedReciterId: string;
  onReciterChange: (reciterId: string) => void;
  isLoading?: boolean;
  isReady?: boolean;
  currentLabel?: string;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  isNextDisabled?: boolean;
  isPreviousDisabled?: boolean;
  className?: string;
}

export default function FloatingAudioPlayer({
  isPlaying,
  progress,
  reciterOptions,
  selectedReciterId,
  onReciterChange,
  isLoading = false,
  isReady = true,
  currentLabel,
  onPlayPause,
  onNext,
  onPrevious,
  isNextDisabled = false,
  isPreviousDisabled = false,
  className,
}: FloatingAudioPlayerProps) {
  const safeProgress = Math.max(0, Math.min(progress, 1));
  const progressPercent = Math.round(safeProgress * 100);
  const [isReciterOpen, setIsReciterOpen] = useState(false);
  const reciterMenuRef = useRef<HTMLDivElement | null>(null);
  const selectedReciter = reciterOptions.find((item) => item.id === selectedReciterId);
  const reciterLabel = selectedReciter?.label ?? 'Reciter';
  const label = currentLabel ? `${currentLabel}` : 'Verse';
  const isDisabled = isLoading || !isReady;

  useEffect(() => {
    if (!isReciterOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (reciterMenuRef.current && !reciterMenuRef.current.contains(target)) {
        setIsReciterOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isReciterOpen]);

  useEffect(() => {
    if (!isReciterOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsReciterOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isReciterOpen]);

  const handleReciterSelect = (reciterId: string) => {
    if (reciterId !== selectedReciterId) {
      onReciterChange(reciterId);
    }
    setIsReciterOpen(false);
  };

  return (
    <div
      className={`relative bg-gradient-to-r from-[#173B2D] via-[#1C4433] to-[#1F4535] text-white rounded-[26px] px-4 py-4 shadow-[0_16px_34px_rgba(20,45,34,0.35)] ${
        className ?? ''
      }`}
    >
      {/* Background layer for decorative circles, with overflow-hidden and matching rounded corners */}
      <div className="absolute inset-0 overflow-hidden rounded-[26px] pointer-events-none">
        <div className="absolute -top-10 -right-12 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-12 h-24 w-24 rounded-full bg-emerald-200/10 blur-2xl" />
      </div>

      <div className="relative flex flex-col gap-3">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex justify-start">
            <span className="text-[11px] font-semibold tracking-wide text-white/90 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 whitespace-nowrap">
              {label}
            </span>
          </div>

          <div className="flex items-center justify-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={onPrevious}
              disabled={isPreviousDisabled || isDisabled}
              aria-label="Previous verse"
              className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onPlayPause}
              disabled={isDisabled}
              aria-label={isPlaying ? 'Pause recitation' : 'Play recitation'}
              className="w-10 h-10 rounded-full bg-white/20 border border-white/25 flex items-center justify-center shadow-[0_8px_16px_rgba(0,0,0,0.18)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative w-5 h-5">
                <Play
                  className={`absolute inset-0 transition-all duration-200 ${
                    isPlaying ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
                  }`}
                />
                <Pause
                  className={`absolute inset-0 transition-all duration-200 ${
                    isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                  }`}
                />
              </span>
            </button>

            <button
              type="button"
              onClick={onNext}
              disabled={isNextDisabled || isDisabled}
              aria-label="Next verse"
              className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <div className="flex justify-end">
            <div ref={reciterMenuRef} className="relative flex flex-col items-center gap-1">
              <span className="text-[9px] uppercase tracking-[0.2em] text-white/60">Reciter</span>
              <button
                type="button"
                onClick={() => setIsReciterOpen((prev) => !prev)}
                disabled={isLoading}
                aria-label="Select reciter"
                aria-expanded={isReciterOpen}
                aria-haspopup="listbox"
                className="flex items-center gap-2 bg-white/10 border border-white/20 text-white text-[11px] font-semibold rounded-full px-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-50"
              >
                <span className="min-w-[64px] text-center">{reciterLabel}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-white/70 transition-transform ${
                    isReciterOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isReciterOpen ? (
                <div
                  role="listbox"
                  aria-label="Reciter options"
                  className="absolute right-0 bottom-full mb-2 w-40 rounded-[18px] border border-white/80 bg-[#FAF8F5] p-1 shadow-[0_10px_26px_rgba(0,0,0,0.12)] z-50"
                >
                  {reciterOptions.map((item) => {
                    const isSelected = item.id === selectedReciterId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleReciterSelect(item.id)}
                        className={`w-full text-left text-[11px] font-semibold px-3 py-2 rounded-[14px] transition-colors ${
                          isSelected
                            ? 'bg-soft-mint/80 text-[#1F4535]'
                            : 'text-gray-700 hover:bg-soft-mint/50'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-[220px]">
            <div className="h-1.5 rounded-full bg-white/15 overflow-hidden">
              <div
                className="h-full rounded-full bg-white transition-[width] duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
