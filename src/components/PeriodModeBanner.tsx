import React, { useState } from 'react';
import { X } from 'lucide-react';
import { usePeriodMode } from '../contexts/PeriodModeContext';

interface PeriodModeBannerProps {
  message?: string;
}

const defaultMessage =
  'You are currently in Period Mode. Listening to the Quran and reading translations is permitted.';

export default function PeriodModeBanner({ message = defaultMessage }: PeriodModeBannerProps) {
  const { isPeriodMode } = usePeriodMode();
  const [isVisible, setIsVisible] = useState(true);

  if (!isPeriodMode || !isVisible) {
    return null;
  }

  return (
    <div className="px-6 mt-2">
      <div className="bg-soft-pink/60 border border-theme-border rounded-[18px] px-4 py-3 shadow-[0_6px_14px_rgba(0,0,0,0.04)] flex items-start gap-3">
        <p className="text-[12.5px] text-text-secondary leading-relaxed font-medium">
          {message}
        </p>
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="w-7 h-7 rounded-full bg-theme-surface-card flex items-center justify-center text-text-tertiary hover:bg-white transition-colors"
          aria-label="Dismiss period mode message"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
