import React, { useState, useEffect } from 'react';
import { Headphones, Play, Pause, Volume2 } from 'lucide-react';
import chapters from '../data/chapters-en.json';
import { RECITER_OPTIONS } from '../data/quranConstants';

import { useQuranAudio } from '../contexts/QuranAudioContext';
import { useProfile } from '../contexts/ProfileContext';

interface Props {
  onClick: () => void;
}

export default function QuranAudioWidget({ onClick }: Props) {
  const { currentSurahId, selectedReciterId, isPlaying, togglePlay } = useQuranAudio();
  const { profile } = useProfile();
  const isDarkTheme = profile?.theme === 'black-gold' || profile?.theme === 'oled-vibrant';

  const chapter = chapters.find(c => c.id === currentSurahId) || chapters[17];
  const reciter = RECITER_OPTIONS.find(r => r.id === selectedReciterId) || RECITER_OPTIONS[0];

  return (
    <div className="px-6 mb-8">
      <div className="relative">
        {/* Wrapper container for the external shadow */}
        <div className="relative group z-10" onClick={onClick}>

          {/* Subtle Accent External Blurry Shadow */}
          <div className={`absolute -inset-2 rounded-[30px] blur-[20px] transition-all duration-700 -z-10 group-hover:blur-[25px] ${isDarkTheme ? 'bg-theme-accent/10 group-hover:bg-theme-accent/20' : 'bg-theme-accent/5 group-hover:bg-theme-accent/10'}`}></div>

          {/* Outer Wrapper for borders */}
          <div className={`relative rounded-[24px] p-[1px] cursor-pointer transition-transform duration-300 group-hover:scale-[1.02] ${!isDarkTheme ? 'shadow-[var(--nisa-shadow-accent)]' : ''}`}>

            {/* Border Gradient (Dark Mode) */}
            {isDarkTheme && <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/5 to-transparent rounded-[24px]"></div>}

            {/* Inner Card */}
            <div className={`relative rounded-[24px] p-5 overflow-hidden ${isDarkTheme ? 'bg-[#1c1c1e]/60 backdrop-blur-xl' : 'bg-theme-surface-card border border-theme-accent/20'}`}>

              {/* Subtle Ink Glow */}
              <div className={`absolute -right-12 -bottom-12 w-48 h-48 pointer-events-none z-0 ${!isDarkTheme ? 'opacity-30' : ''}`}>
                <div className={`absolute inset-0 bg-theme-accent rounded-[45%_55%_65%_35%] filter blur-[20px] transition-all duration-[3000ms] ease-in-out ${isPlaying ? 'opacity-60 scale-150 -rotate-12' : 'opacity-30 scale-100 rotate-155'}`}></div>
              </div>

              {/* Card Content */}
              <div className="relative z-10">
                {/* Header & Equalizer */}
                <div className="flex justify-between items-start mb-5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkTheme ? 'bg-white/10 border border-white/10 backdrop-blur-md text-white' : 'bg-theme-accent/10 border border-theme-accent/20 text-theme-accent'}`}>
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div className="flex items-end gap-[3px] h-[14px] pt-2">
                    <div className={`w-[3px] rounded-full h-[4px] ${isPlaying ? 'animate-[sound-wave_1s_ease-in-out_infinite_alternate]' : ''} ${isDarkTheme ? 'bg-white/80' : 'bg-theme-accent/80'}`} style={{ animationDelay: '0.0s' }}></div>
                    <div className={`w-[3px] rounded-full h-[10px] ${isPlaying ? 'animate-[sound-wave_1s_ease-in-out_infinite_alternate]' : ''} ${isDarkTheme ? 'bg-white/80' : 'bg-theme-accent/80'}`} style={{ animationDelay: '0.3s' }}></div>
                    <div className={`w-[3px] rounded-full h-[6px] ${isPlaying ? 'animate-[sound-wave_1s_ease-in-out_infinite_alternate]' : ''} ${isDarkTheme ? 'bg-white/80' : 'bg-theme-accent/80'}`} style={{ animationDelay: '0.6s' }}></div>
                    <div className={`w-[3px] rounded-full h-[4px] ${isPlaying ? 'animate-[sound-wave_1s_ease-in-out_infinite_alternate]' : ''} ${isDarkTheme ? 'bg-white/80' : 'bg-theme-accent/80'}`} style={{ animationDelay: '0.1s' }}></div>
                  </div>
                </div>

                {/* Texts */}
                <div className="mb-5">
                  <h2 className={`text-2xl font-bold tracking-tight mb-1 ${isDarkTheme ? 'text-white drop-shadow-md' : 'text-text-primary'}`}>Surah {chapter.transliteration}</h2>
                  <p className={`text-[12px] font-medium ${isDarkTheme ? 'text-gray-300' : 'text-text-secondary'}`}>{reciter.label}</p>
                </div>

                {/* Controls */}
                <div className={`flex items-center justify-between border-t pt-4 ${isDarkTheme ? 'border-white/10' : 'border-theme-accent/10'}`}>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95 ${isDarkTheme ? 'bg-white hover:bg-gray-200 text-black' : 'bg-theme-accent hover:bg-theme-accent-strong text-white'}`}
                    >
                      {isPlaying ? (
                        <Pause className="w-[18px] h-[18px] fill-current" />
                      ) : (
                        <Play className="w-[18px] h-[18px] ml-0.5 fill-current" />
                      )}
                    </button>
                    <div className="flex flex-col">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkTheme ? 'text-gray-400' : 'text-text-muted'}`}>{isPlaying ? 'Playing' : 'Ready'}</span>
                      <span className={`text-[12px] font-bold font-mono mt-0.5 ${isDarkTheme ? 'text-white' : 'text-theme-accent'}`}>Live</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isDarkTheme ? 'bg-white/5 hover:bg-white/15 border border-white/10 text-white' : 'bg-theme-accent/10 hover:bg-theme-accent/20 border border-theme-accent/10 text-theme-accent'}`}>
                      <Volume2 className="w-[14px] h-[14px]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
