import React, { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';

interface ProfileSubScreenProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  children: ReactNode;
}

export default function ProfileSubScreen({ title, subtitle, onBack, children }: ProfileSubScreenProps) {
  return (
    <div className="absolute inset-0 bg-warm-beige z-50 flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="sticky top-0 z-10 bg-warm-beige/90 backdrop-blur-md px-6 py-4 flex items-center gap-3 border-b border-gray-200/40">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100/50 active:scale-95 transition-all"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-gray-800 tracking-tight truncate">{title}</h1>
          {subtitle && (
            <p className="text-[12px] font-medium text-gray-500 truncate">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto hide-scrollbar px-6 py-6 pb-28">{children}</div>
    </div>
  );
}
