import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { modalVariants } from '../lib/motion';
import chapters from '../data/chapters-en.json';
import quran from '../data/quran.json';
import translationEn from '../data/editions-en.json';
import { RECITER_OPTIONS, Chapter, QuranMap } from '../data/quranConstants';
import { getCachedAudioUrl } from '../utils/audioCache';

const chapterList = chapters as Chapter[];
const quranByChapter = quran as QuranMap;
const translationByChapter = translationEn as QuranMap;
import { useQuranAudio } from '../contexts/QuranAudioContext';
import { useProfile } from '../contexts/ProfileContext';
import { ArrowLeft, ChevronDown, Repeat, SkipBack, Pause, Play, SkipForward, Moon, X, CheckCircle, Timer } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function QuranAudioScreen({ onBack }: Props) {
  const {
    currentSurahId, setCurrentSurahId,
    selectedReciterId, setSelectedReciterId,
    isPlaying, togglePlay,
    progress, duration,
    isLooping, setIsLooping,
    isShuffle, setIsShuffle,
    playNext, playPrev,
    handleSeek: contextHandleSeek, segments,
    sleepTimerEnd, setSleepTimer, clearSleepTimer
  } = useQuranAudio();
  const { profile } = useProfile();
  const isDarkTheme = profile?.theme === 'black-gold' || profile?.theme === 'oled-vibrant';

  // Modals state
  const [showSurahModal, setShowSurahModal] = useState(false);
  const [showReciterModal, setShowReciterModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration > 0) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percent = Math.max(0, Math.min(1, x / bounds.width));
      const seekTime = percent * duration;
      contextHandleSeek(seekTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;
  const remainingTime = duration > progress ? duration - progress : 0;

  const currentChapter = chapterList.find(c => c.id === currentSurahId);
  const currentReciter = RECITER_OPTIONS.find(r => r.id === selectedReciterId);

  return (
    <motion.div
      variants={modalVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 z-[100] bg-[#121214] text-white flex justify-center overflow-hidden font-sans"
      style={{
        paddingTop: 'max(env(safe-area-inset-top), 12px)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 32px)'
      }}
    >
      {/* Background Ambience */}
      <div className="ambient-bg"></div>

      <div className="w-full max-w-[414px] h-full relative flex flex-col">
        
        {/* Top Navigation Bar */}
        <header className="glass-header flex justify-between items-center px-6 pt-2 pb-4 relative z-20 shrink-0">
            {/* Back Button */}
            <button onClick={onBack} className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-colors backdrop-blur-md bg-white/5 border border-white/10 text-white hover:bg-white/10">
                <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="text-center">
                <span className="text-xs font-bold tracking-widest uppercase text-gray-400">Now Playing</span>
            </div>

            {/* Empty div to balance flex layout since heart button is removed */}
            <div className="w-10 h-10 shrink-0"></div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col items-center justify-start px-6 relative z-10 w-full">
            
            {/* Center Area for Artwork and Titles */}
            <div className="flex-1 w-full flex flex-col justify-center items-center mt-[-40px]">
                {/* Hero Artwork (Circular) */}
                <div className="relative w-64 h-64 shrink-0 mb-10 mt-4">
                    {/* Live Gradient Background */}
                    <div className="absolute -inset-6 bg-gradient-to-tr from-theme-accent via-theme-accent-strong to-theme-accent rounded-[40%_60%_70%_30%] filter blur-[35px] transition-all duration-1000 opacity-5 data-[playing=true]:opacity-20 data-[playing=true]:animate-[spin_8s_linear_infinite]" data-playing={isPlaying}></div>
                    <div className="absolute -inset-6 bg-gradient-to-bl from-theme-accent-strong via-theme-accent to-theme-accent-strong rounded-[60%_40%_30%_70%] filter blur-[35px] transition-all duration-1000 opacity-5 data-[playing=true]:opacity-20 data-[playing=true]:animate-[spin_12s_linear_infinite_reverse]" data-playing={isPlaying}></div>
                </div>

                {/* Titles and Selectors */}
                <div className="text-center w-full shrink-0">
                    {/* Surah Selector */}
                    <button onClick={() => setShowSurahModal(true)} className="group flex items-center justify-center gap-2 mx-auto mb-1 px-4 py-1.5 rounded-2xl transition-colors hover:bg-white/5">
                        <h1 className="text-2xl font-bold tracking-tight drop-shadow-md text-white">Surah {currentChapter?.transliteration}</h1>
                        <ChevronDown className="w-5 h-5 transition-colors text-gray-400 group-hover:text-white" />
                    </button>
                    
                    {/* Qari Selector */}
                    <button onClick={() => setShowReciterModal(true)} className="group flex items-center justify-center gap-1.5 mx-auto px-3 py-1 rounded-xl transition-colors hover:bg-white/5">
                        <p className="text-sm font-medium transition-colors text-gray-400 group-hover:text-theme-accent">{currentReciter?.label}</p>
                        <ChevronDown className="w-3.5 h-3.5 transition-colors text-gray-500 group-hover:text-theme-accent" />
                    </button>
                </div>
            </div>

            {/* Bottom Controls Section */}
            <div className="w-full pb-2 mt-auto shrink-0">
                {/* Progress Bar */}
                <div className="mb-6 px-2">
                    <div className="relative w-full h-4 group flex items-center">
                        {/* Native Range Input (Invisible, captures events) */}
                        <input
                           type="range"
                           min="0"
                           max={duration || 100}
                           step="0.1"
                           value={progress || 0}
                           onChange={(e) => {
                             const newTime = parseFloat(e.target.value);
                             contextHandleSeek(newTime);
                           }}
                           className="absolute w-full h-full opacity-0 cursor-pointer z-10 touch-none"
                        />
                        {/* Custom Track Background */}
                        <div className="w-full h-1.5 rounded-full overflow-hidden absolute pointer-events-none bg-white/10">
                           {/* Filled Track */}
                           <div className="h-full bg-gradient-to-r from-theme-accent to-theme-accent-strong rounded-full" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                        {/* Custom Thumb */}
                        <div 
                           className="h-3.5 w-3.5 rounded-full absolute pointer-events-none" 
                           style={{ 
                             left: `calc(${progressPercent}% - 7px)`,
                             backgroundColor: 'var(--color-theme-accent-strong, #f5b041)',
                             boxShadow: '0 0 12px var(--color-theme-accent, #f5b041)'
                           }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-medium mt-2 tracking-widest font-mono text-gray-400">
                        <span>{formatTime(progress)}</span>
                        <span>-{formatTime(remainingTime)}</span>
                    </div>
                </div>

                {/* Player Buttons */}
                <div className="flex items-center justify-between px-4">
                    {/* Loop */}
                    <button onClick={() => setIsLooping(!isLooping)} className={`p-2 relative transition-colors ${isLooping ? 'text-theme-accent' : 'text-gray-400 hover:text-white'}`}>
                        <Repeat className="w-6 h-6" />
                        {isLooping && <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-theme-accent rounded-full"></div>}
                    </button>
                    
                    {/* Previous */}
                    <button onClick={playPrev} className="transition-colors p-2 text-white hover:text-theme-accent">
                        <SkipBack className="w-8 h-8" fill="currentColor" />
                    </button>
                    
                    {/* Play/Pause */}
                    <button onClick={togglePlay} className="w-[72px] h-[72px] shrink-0 rounded-full bg-theme-accent flex items-center justify-center transition-all shadow-[0_10px_30px_var(--color-theme-accent)] hover:scale-105 active:scale-95 text-black">
                        {isPlaying ? <Pause className="w-8 h-8" fill="currentColor" /> : <Play className="w-8 h-8 ml-1" fill="currentColor" />}
                    </button>
                    
                    {/* Next */}
                    <button onClick={playNext} className="transition-colors p-2 text-white hover:text-theme-accent">
                        <SkipForward className="w-8 h-8" fill="currentColor" />
                    </button>
                    
                    {/* Settings / Sleep Timer */}
                    <button onClick={() => setShowSettingsModal(true)} className={`p-2 relative transition-colors ${sleepTimerEnd ? 'text-theme-accent' : 'text-gray-400 hover:text-white'}`}>
                        <Moon className="w-6 h-6" />
                        {sleepTimerEnd && <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-theme-accent rounded-full"></div>}
                    </button>
                </div>
            </div>
        </main>

        <AnimatePresence>
          {showSurahModal && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="absolute inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowSurahModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-[340px] max-h-[70vh] backdrop-blur-2xl rounded-[32px] shadow-2xl flex flex-col overflow-hidden bg-white/10 border-white/20"
              >
                {/* Sleek Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b shrink-0 border-white/10 bg-black/20">
                   <h3 className="text-lg font-bold tracking-wide text-white">Select Surah</h3>
                   <button onClick={() => setShowSurahModal(false)} className="w-8 h-8 flex items-center justify-center transition-colors rounded-full bg-white/10 hover:bg-white/20 text-white"><X className="w-4 h-4" /></button>
                </div>
                <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5 no-scrollbar">
                   {chapterList.map(c => (
                     <button 
                       key={c.id} 
                       onClick={() => { setCurrentSurahId(c.id); setShowSurahModal(false); }}
                       className={`w-full flex items-center justify-between px-4 py-3 rounded-[20px] transition-all duration-200 ${c.id === currentSurahId ? 'bg-theme-accent/20 border border-theme-accent/30' : 'hover:bg-white/5 border border-transparent'}`}
                     >
                        <div className="flex items-center gap-3.5">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[13px] shadow-sm ${c.id === currentSurahId ? 'bg-theme-accent text-white' : 'bg-black/30 text-gray-300'}`}>{c.id}</div>
                          <div className="text-left">
                             <div className={`font-semibold text-[15px] ${c.id === currentSurahId ? 'text-theme-accent' : 'text-gray-100'}`}>{c.transliteration}</div>
                             <div className="text-[11px] mt-0.5 text-gray-400">{c.translation}</div>
                          </div>
                        </div>
                        <div className={`font-['Amiri'] text-2xl ${c.id === currentSurahId ? 'text-theme-accent' : 'text-gray-300'}`}>{c.name}</div>
                     </button>
                   ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {showReciterModal && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="absolute inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowReciterModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-[340px] backdrop-blur-2xl rounded-[32px] shadow-2xl flex flex-col overflow-hidden bg-white/10 border border-white/20"
              >
                <div className="flex justify-between items-center px-6 py-5 border-b shrink-0 border-white/10 bg-black/20">
                   <h3 className="text-lg font-bold tracking-wide text-white">Select Qari</h3>
                   <button onClick={() => setShowReciterModal(false)} className="w-8 h-8 flex items-center justify-center transition-colors rounded-full bg-white/10 hover:bg-white/20 text-white"><X className="w-4 h-4" /></button>
                </div>
                <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5 no-scrollbar">
                   {RECITER_OPTIONS.map(r => (
                     <button 
                       key={r.id} 
                       onClick={() => { setSelectedReciterId(r.id); setShowReciterModal(false); }}
                       className={`w-full flex items-center justify-between px-5 py-4 rounded-[20px] font-medium transition-all duration-200 ${r.id === selectedReciterId ? 'bg-theme-accent/20 border border-theme-accent/30 text-theme-accent' : 'hover:bg-white/5 border border-transparent text-gray-200'}`}
                     >
                       <span className="text-[15px]">{r.label}</span>
                       {r.id === selectedReciterId && <CheckCircle className="w-5 h-5 text-theme-accent" fill="currentColor" />}
                     </button>
                   ))}
                </div>
              </motion.div>
            </motion.div>
          )}
          {showSettingsModal && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="absolute inset-0 z-[200] bg-black/60 backdrop-blur-sm"
              onClick={() => setShowSettingsModal(false)}
            >
              <motion.div
                initial={{ y: 20, scale: 0.95, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 20, scale: 0.95, opacity: 0 }} transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-24 right-4 w-[280px] backdrop-blur-2xl rounded-[28px] shadow-2xl flex flex-col overflow-hidden origin-bottom-right bg-white/10 border border-white/20"
              >
                <div className="flex justify-between items-center px-6 py-5 border-b shrink-0 border-white/10 bg-black/20">
                   <div>
                     <h3 className="text-lg font-bold tracking-wide text-white">Sleep Timer</h3>
                     <p className="text-xs mt-0.5 text-gray-400">Stop audio automatically</p>
                   </div>
                   <button onClick={() => setShowSettingsModal(false)} className="w-8 h-8 flex items-center justify-center transition-colors rounded-full bg-white/10 hover:bg-white/20 text-white"><X className="w-4 h-4" /></button>
                </div>
                <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5 no-scrollbar max-h-[50vh]">
                   <button 
                     onClick={() => { clearSleepTimer(); setShowSettingsModal(false); }}
                     className={`w-full flex items-center justify-between px-5 py-4 rounded-[20px] font-medium transition-all duration-200 ${!sleepTimerEnd ? 'bg-theme-accent/20 border border-theme-accent/30 text-theme-accent' : 'hover:bg-white/5 border border-transparent text-gray-200'}`}
                   >
                     <span className="text-[15px]">Off</span>
                     {!sleepTimerEnd && <CheckCircle className="w-5 h-5 text-theme-accent" fill="currentColor" />}
                   </button>
                   
                   {[5, 10, 15, 30, 45, 60, 120].map(mins => {
                     // Check if this option is currently active based on remaining time
                     const isActive = sleepTimerEnd !== null && Math.abs((sleepTimerEnd - Date.now()) / 60000 - mins) < 2; // rough match
                     return (
                       <button 
                         key={mins}
                         onClick={() => { setSleepTimer(mins); setShowSettingsModal(false); }}
                         className="w-full flex items-center justify-between px-5 py-4 rounded-[20px] font-medium transition-all duration-200 border border-transparent hover:bg-white/5 text-gray-200"
                       >
                         <span className="text-[15px]">
                           {mins < 60 ? `${mins} Minutes` : mins === 60 ? '1 Hour' : '2 Hours'}
                         </span>
                       </button>
                     );
                   })}
                </div>
                {sleepTimerEnd && (
                  <div className="px-6 py-4 border-t flex items-center gap-3 bg-black/30 border-white/10">
                    <Timer className="w-5 h-5 text-theme-accent" />
                    <div className="text-sm text-gray-300">
                      Timer ends at {new Date(sleepTimerEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
