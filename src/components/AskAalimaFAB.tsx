import React from 'react';
import { Bot } from 'lucide-react';

interface AskAalimaFABProps {
  onOpen?: () => void;
}

export default function AskAalimaFAB({ onOpen }: AskAalimaFABProps) {
  return (
    <div className="absolute left-6 bottom-[100px] z-40">
      <button
        type="button"
        onClick={onOpen}
        className="flex items-center gap-2.5 bg-white/95 backdrop-blur-md pl-2 pr-5 py-2 rounded-full shadow-[0_8px_28px_rgba(235,182,186,0.25)] border border-white/70 active:scale-95 transition-all"
        aria-label="Open Ask Aalima AI chat"
      >
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-soft-pink-dark to-[#D98A5B] flex items-center justify-center shadow-[0_4px_12px_rgba(217,138,91,0.35)]">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col items-start pr-1">
          <span className="text-[9px] uppercase font-bold text-[#D98A5B] tracking-wider">
            AI Assistant
          </span>
          <span className="text-[13px] font-bold text-gray-800 leading-tight">Ask Aalima</span>
        </div>
      </button>
    </div>
  );
}
