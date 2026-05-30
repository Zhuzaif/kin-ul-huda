import React from 'react';
import { Check, Lock, BookOpen } from 'lucide-react';

const nodes = [
  { id: 1, type: 'completed', label: 'Types of Blood', offset: '-translate-x-12' },
  { id: 2, type: 'active', label: 'Rules of Ghusl', offset: 'translate-x-10' },
  { id: 3, type: 'locked', label: 'Salah in Haiz', offset: '-translate-x-8' },
  { id: 4, type: 'locked', label: 'Fasting Rules', offset: 'translate-x-12' },
];

export default function FiqhLearningPath() {
  return (
    <div className="px-6 pb-36 relative">
      <h3 className="text-[17px] font-bold text-gray-800 tracking-tight mb-8">Learn Fiqh (Women's Issues)</h3>
      
      <div className="relative py-6 flex flex-col items-center">
        {/* Winding Track SVG Background */}
        <svg className="absolute top-0 bottom-0 w-56 h-full text-gray-300/60" style={{ zIndex: 0 }} viewBox="0 0 100 400" preserveAspectRatio="none">
          {/* Smooth bezier curves for a winding path */}
          <path 
            d="M 50,0 C -10,80 110,180 50,260 C -10,340 110,400 50,400" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="5" 
            strokeDasharray="0 14" 
            strokeLinecap="round" 
          />
        </svg>

        <div className="flex flex-col gap-12 relative z-10 w-full items-center mt-2">
          {nodes.map((node) => {
            const isCompleted = node.type === 'completed';
            const isActive = node.type === 'active';
            const isLocked = node.type === 'locked';

            return (
              <div key={node.id} className={`flex flex-col items-center gap-3 w-40 relative ${node.offset}`}>
                <button 
                  className={`
                    relative rounded-full flex items-center justify-center transition-all
                    ${isCompleted ? 'w-16 h-16 bg-soft-mint-dark shadow-[0_6px_0_#98C4AE] active:translate-y-[6px] active:shadow-none ring-2 ring-white' : ''}
                    ${isActive ? 'w-[88px] h-[88px] bg-gradient-to-b from-soft-pink-dark to-[#D98A5B] shadow-[0_8px_0_#A85E5E] active:translate-y-[8px] active:shadow-none ring-[6px] ring-white/60' : ''}
                    ${isLocked ? 'w-16 h-16 bg-white shadow-[0_6px_0_#E5E7EB] active:translate-y-[6px] active:shadow-none border-[3px] border-gray-100' : ''}
                  `}
                >
                  {isCompleted && <Check className="w-8 h-8 text-[#1F4535] stroke-[4]" />}
                  {isActive && <BookOpen className="w-9 h-9 text-white fill-current opacity-95" />}
                  {isLocked && <Lock className="w-6 h-6 text-gray-300 fill-current" />}
                  
                  {isActive && (
                    <div className="absolute -inset-4 bg-soft-pink-dark/20 rounded-full blur-xl -z-10 animate-pulse" />
                  )}
                </button>

                {isActive ? (
                  <div className="bg-white/95 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.06)] border border-gray-100 whitespace-nowrap z-20 mt-1">
                    <span className="text-[10px] font-bold text-soft-pink-dark uppercase tracking-widest block text-center mb-1">Level {node.id}</span>
                    <span className="text-[15px] font-bold text-gray-800 block text-center">{node.label}</span>
                  </div>
                ) : (
                  <span className={`text-[13px] font-bold text-center mt-1 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full ${isLocked ? 'text-gray-400' : 'text-gray-700'}`}>
                    {node.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
