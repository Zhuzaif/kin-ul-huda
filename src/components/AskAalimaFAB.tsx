import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function AskAalimaFAB() {
  return (
    <div className="absolute left-6 bottom-[100px] z-40">
      <button 
        className="flex items-center gap-2.5 bg-white/95 backdrop-blur-sm pl-2.5 pr-5 py-2.5 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.08)] border border-white/60 active:scale-95 transition-transform group"
        aria-label="Ask an Aalima"
      >
        <div className="w-10 h-10 rounded-full bg-soft-pink-dark flex items-center justify-center shadow-inner">
          <HelpCircle className="w-6 h-6 text-white stroke-[2.5]" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Quick Q&A</span>
          <span className="text-[13px] font-bold text-gray-800 leading-tight">Ask Aalima</span>
        </div>
      </button>
    </div>
  );
}
