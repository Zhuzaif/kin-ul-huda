import React from 'react';

interface ResumeReadingProps {
  chapterName: string;
  verseNumber: number;
  progressPercent: number;
  onContinue?: () => void;
  isAvailable?: boolean;
}

export default function ResumeReading({
  chapterName,
  verseNumber,
  progressPercent,
  onContinue,
  isAvailable = true,
}: ResumeReadingProps) {
  const safePercent = Math.max(0, Math.min(progressPercent, 100));
  const label = isAvailable ? 'Resume Reading' : 'Start Reading';
  const verseLabel = isAvailable ? `Verse ${verseNumber}` : 'Begin at verse 1';

  return (
    <div className="px-6 mb-6">
      <div className="bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white/60 flex items-center gap-5 relative overflow-hidden">
        {/* GAMIFIED PROGRESS RING */}
        <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 36 36">
            <path
              className="text-gray-100"
              strokeWidth="4"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-soft-mint-dark"
              strokeWidth="4"
              strokeDasharray={`${safePercent}, 100`}
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col pt-0.5">
            <span className="text-[11px] font-bold text-[#2B604A]">{safePercent}%</span>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{label}</h3>
          <p className="text-[15px] font-bold text-gray-800 mb-2.5 tracking-tight flex items-center">
            {chapterName}
            <span className="text-xs font-semibold text-gray-300 mx-2">•</span> 
            <span className="text-gray-500 font-medium text-sm">{verseLabel}</span>
          </p>
          
          <button
            type="button"
            onClick={onContinue}
            className="bg-[#1F4535] text-white text-[11px] font-semibold px-5 py-2 rounded-full shadow-[0_4px_0_#0F241B] active:shadow-[0_0px_0_#0F241B] active:translate-y-1 transition-all"
          >
            {isAvailable ? 'Continue' : 'Start'}
          </button>
        </div>
      </div>
    </div>
  );
}
