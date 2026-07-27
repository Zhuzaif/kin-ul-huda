import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ResumeReadingProps {
  chapterName: string;
  chapterArabic?: string;
  verseNumber: number;
  progressPercent: number;
  onContinue?: () => void;
  isAvailable?: boolean;
}

export default function ResumeReading({
  chapterName,
  chapterArabic,
  verseNumber,
  progressPercent,
  onContinue,
  isAvailable = true,
}: ResumeReadingProps) {
  const safePercent = Math.max(0, Math.min(progressPercent, 100));
  const tag = isAvailable ? 'CONTINUE' : 'START';
  const btnLabel = isAvailable ? 'Continue' : 'Start';
  const verseLabel = isAvailable ? `Verse ${verseNumber}` : 'Begin at verse 1';

  return (
    <div className="px-6 mb-4">
      <div
        className="relative rounded-[20px] px-5 py-4 overflow-hidden shadow-[0_10px_20px_rgba(11,77,60,0.25)]"
        style={{
          background: 'linear-gradient(135deg, #0B4D3C 0%, #135E4A 100%)',
        }}
      >
        {/* Decorative radial glows */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 90% 10%, rgba(201,162,75,0.22) 0%, transparent 42%), radial-gradient(circle at 10% 90%, rgba(255,255,255,0.10) 0%, transparent 32%)",
          }}
        />

        {/* Calligraphy Watermark */}
        {chapterArabic && (
          <div
            className="absolute right-6 top-1/2 -translate-y-[45%] select-none pointer-events-none opacity-[0.09]"
            style={{
              fontFamily: "'Amiri', serif",
              fontSize: '85px',
              color: '#F0A500',
              lineHeight: 1,
              direction: 'rtl',
            }}
          >
            {chapterArabic}
          </div>
        )}

        <div className="relative z-10 flex items-center justify-between gap-3">
          {/* Left */}
          <div className="flex-1 min-w-0">
            <span
              className="inline-block text-[10px] font-semibold tracking-[1px] px-2.5 py-1 rounded-full mb-2"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff' }}
            >
              {tag}
            </span>
            <h3
              className="text-[19px] font-bold text-white leading-tight truncate"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {chapterName}
            </h3>
            <p className="text-[12px] text-white/70 mt-1">{verseLabel}</p>
          </div>

          {/* Right */}
          <div className="flex flex-col items-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onContinue}
              className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[12px] font-semibold transition-transform active:scale-95"
              style={{ background: '#C9A24B', color: '#0B4D3C' }}
            >
              {btnLabel}
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </button>

            {/* Progress bar */}
            <div className="flex flex-col items-end gap-1">
              <div
                className="w-[90px] h-[5px] rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.2)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${safePercent}%`, background: '#C9A24B' }}
                />
              </div>
              <span className="text-[9px] font-medium text-white/60">{safePercent}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
