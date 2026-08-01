import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ReciterOption } from '../data/quranConstants';

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
  const progressPercent = safeProgress * 100;
  const [isReciterOpen, setIsReciterOpen] = useState(false);
  const reciterMenuRef = useRef<HTMLDivElement | null>(null);
  const selectedReciter = reciterOptions.find((item) => item.id === selectedReciterId);
  const reciterLabel = selectedReciter?.label ?? 'Reciter';
  const label = currentLabel ? `${currentLabel}` : 'V1';
  const isDisabled = isLoading || !isReady;

  useEffect(() => {
    if (!isReciterOpen) return;

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
    if (!isReciterOpen) return;

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

  const fillRef = useRef<HTMLDivElement | null>(null);
  const thumbRef = useRef<HTMLDivElement | null>(null);
  const lastProgressRef = useRef(safeProgress);
  const lastTimeRef = useRef(performance.now());
  const speedRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const now = performance.now();
    const dt = now - lastTimeRef.current;
    if (dt > 30 && safeProgress >= lastProgressRef.current) {
      const calculatedSpeed = (safeProgress - lastProgressRef.current) / dt;
      if (calculatedSpeed > 0 && calculatedSpeed < 0.01) {
        speedRef.current = calculatedSpeed;
      }
    } else if (safeProgress < lastProgressRef.current) {
      speedRef.current = 0;
    }
    lastProgressRef.current = safeProgress;
    lastTimeRef.current = now;
  }, [safeProgress]);

  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      const pct = `${progressPercent}%`;
      if (fillRef.current) fillRef.current.style.width = pct;
      if (thumbRef.current) thumbRef.current.style.left = pct;
      return;
    }

    const animate = () => {
      const now = performance.now();
      const elapsed = now - lastTimeRef.current;
      const currentVal = lastProgressRef.current + speedRef.current * elapsed;
      const pct = `${Math.max(0, Math.min(100, currentVal * 100))}%`;

      if (fillRef.current) fillRef.current.style.width = pct;
      if (thumbRef.current) thumbRef.current.style.left = pct;

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isPlaying, progressPercent]);

  return (
    <div
      className={`w-full flex flex-col gap-2.5 px-4 py-3 ${className ?? ''}`}
      style={{
        background: 'var(--color-theme-surface-card)',
        borderRadius: '2rem',
        boxShadow: 'var(--nisa-shadow-card), 0 4px 20px rgba(0,0,0,0.15)',
        fontFamily: "'Inter', sans-serif",
        border: '1px solid var(--color-theme-border)',
      }}
    >
      {/* Main row */}
      <div className="flex items-center justify-between gap-1.5 min-w-0">
        {/* V-badge */}
        <div
          className="h-8 px-2.5 rounded-full flex items-center justify-center font-semibold text-[11px] shrink-0 select-none whitespace-nowrap"
          style={{
            background: 'var(--color-theme-surface-alt)',
            border: '1px solid var(--color-theme-border)',
            color: 'var(--color-theme-accent)',
          }}
        >
          {label}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <NeoBtn
            size="sm"
            onClick={onPrevious}
            disabled={isPreviousDisabled || isDisabled}
            aria-label="Previous verse"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </NeoBtn>

          <NeoBtn
            size="md"
            onClick={onPlayPause}
            disabled={isDisabled}
            aria-label={isPlaying ? 'Pause recitation' : 'Play recitation'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </NeoBtn>

          <NeoBtn
            size="sm"
            onClick={onNext}
            disabled={isNextDisabled || isDisabled}
            aria-label="Next verse"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </NeoBtn>
        </div>

        {/* Divider */}
        <div className="w-px h-4 shrink-0 bg-theme-border/70" />

        {/* Reciter dropdown */}
        <div ref={reciterMenuRef} className="relative shrink-0 flex justify-end min-w-0">
          <button
            type="button"
            onClick={() => setIsReciterOpen((o) => !o)}
            disabled={isLoading}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full transition-all hover:opacity-80 disabled:opacity-50 min-w-0"
            style={{
              color: 'var(--color-text-primary)',
              fontSize: 12,
              fontWeight: 600,
              background: 'var(--color-theme-surface-alt)',
              border: '1px solid var(--color-theme-border)',
            }}
          >
            <span className="truncate max-w-[75px] sm:max-w-[110px]" style={{ fontWeight: 600, fontSize: 12 }}>
              {reciterLabel}
            </span>
            <ChevronDown
              size={13}
              strokeWidth={2.5}
              className="shrink-0"
              style={{
                color: 'currentColor',
                transform: isReciterOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>

          {isReciterOpen && (
            <div
              role="listbox"
              aria-label="Reciter options"
              className="absolute right-0 bottom-full mb-2 z-50 overflow-hidden"
              style={{
                background: 'var(--color-theme-surface-elevated)',
                borderRadius: '1rem',
                boxShadow: 'var(--nisa-shadow-elevated)',
                minWidth: 140,
                border: '1px solid var(--color-theme-border)',
              }}
            >
              {reciterOptions.map((r) => {
                const isSelected = r.id === selectedReciterId;
                return (
                  <button
                    key={r.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleReciterSelect(r.id)}
                    className="w-full text-left px-4 py-2.5 transition-opacity hover:opacity-70"
                    style={{
                      fontSize: 12,
                      fontWeight: isSelected ? 600 : 400,
                      color: isSelected ? 'var(--color-theme-accent)' : 'var(--color-text-primary)',
                      background: 'transparent',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="relative cursor-pointer select-none mx-1"
        style={{
          background: 'var(--color-theme-surface-input)',
          borderRadius: 10,
          height: 4,
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
        }}
      >
        <div
          ref={fillRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${progressPercent}%`,
              background: 'var(--color-theme-accent)',
              borderRadius: 10,
              pointerEvents: 'none',
              willChange: 'width',
            }}
        />
        <div
          ref={thumbRef}
            style={{
              position: 'absolute',
              top: '50%',
              left: `${progressPercent}%`,
              transform: 'translate(-50%, -50%)',
              color: 'var(--color-theme-accent)',
              filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))',
              pointerEvents: 'none',
              willChange: 'left',
            }}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function NeoBtn({
  children,
  size,
  onClick,
  disabled,
  'aria-label': ariaLabel,
}: {
  children: React.ReactNode;
  size: 'sm' | 'md';
  onClick?: () => void;
  disabled?: boolean;
  'aria-label'?: string;
}) {
  const dim = size === 'md' ? 'w-11 h-11' : 'w-8 h-8';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${dim} rounded-full flex items-center justify-center transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed bg-theme-surface-alt border border-theme-border/50 text-text-primary hover:bg-theme-surface-input shadow-[var(--nisa-shadow-sm)]`}
    >
      {children}
    </button>
  );
}


