import React from 'react';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';

interface FloatingAudioPlayerProps {
  isPlaying: boolean;
  progress: number;
  reciterName: string;
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
  reciterName,
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
  const label = currentLabel ? `${currentLabel} • ${reciterName}` : `Reciter • ${reciterName}`;

  return (
    <div
      className={`bg-[#1F4535] text-white rounded-full px-4 py-3 shadow-[0_14px_30px_rgba(31,69,53,0.35)] flex items-center gap-3 ${
        className ?? ''
      }`}
    >
      <button
        type="button"
        onClick={onPrevious}
        disabled={isPreviousDisabled}
        aria-label="Previous verse"
        className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center transition-opacity disabled:opacity-40"
      >
        <SkipBack className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={onPlayPause}
        aria-label={isPlaying ? 'Pause recitation' : 'Play recitation'}
        className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center"
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
        disabled={isNextDisabled}
        aria-label="Next verse"
        className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center transition-opacity disabled:opacity-40"
      >
        <SkipForward className="w-4 h-4" />
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold tracking-wide truncate">{label}</p>
        <div className="mt-1.5 h-1.5 rounded-full bg-white/25 overflow-hidden">
          <div
            className="h-full rounded-full bg-white transition-[width] duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
