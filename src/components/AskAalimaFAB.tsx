import React from 'react';
import { Bot } from 'lucide-react';

interface AskAalimaFABProps {
  onOpen?: () => void;
}

export default function AskAalimaFAB({ onOpen }: AskAalimaFABProps) {
  return (
    <div className="fixed right-5 bottom-[100px] z-40">
      <button
        type="button"
        onClick={onOpen}
        className="nisa-fab-pulse flex items-center gap-2 bg-gradient-to-br from-theme-accent to-theme-accent-strong pl-2.5 pr-4 py-2 rounded-full shadow-lg shadow-theme-accent/30 active:scale-95 transition-all"
        aria-label="Open Ask Aalima AI chat"
      >
        <div className="w-9 h-9 rounded-full bg-theme-surface-card backdrop-blur-sm flex items-center justify-center">
          <Bot className="w-4 h-4 text-theme-accent" />
        </div>
        <span className="text-[12px] font-semibold text-white/95 pr-0.5">Ask Aalima</span>
      </button>
    </div>
  );
}
