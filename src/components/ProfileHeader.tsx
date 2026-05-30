import React from 'react';
import { User2 } from 'lucide-react';

export default function ProfileHeader() {
  return (
    <div className="pt-10 pb-6 px-6 flex items-center gap-5">
      <div className="relative">
        {/* Soft glowing effect */}
        <div className="absolute -inset-2 bg-soft-mint-dark/40 rounded-full blur-xl opacity-70" />
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white to-[#E2F0EA] flex items-center justify-center relative shadow-[0_4px_15px_rgba(43,96,74,0.1)] border-2 border-white">
          <User2 className="w-8 h-8 text-[#2B604A] stroke-[2]" />
        </div>
      </div>
      
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight leading-tight mb-1.5">
          Hello, Sarah.
        </h1>
        <p className="text-[13px] font-medium text-gray-500 leading-relaxed max-w-[200px]">
          It's beautiful to be on this journey with you.
        </p>
      </div>
    </div>
  );
}
