import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Heart, Share2, BookOpen } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { buttonTap } from '../lib/motion';
import AyatShareCards from './AyatShareCards';
import { usePeriodMode } from '../contexts/PeriodModeContext';
import { useProfile } from '../contexts/ProfileContext';
import dailyAyat from '../data/daily-ayat.json';
import quran from '../data/quran.json';
import translationEn from '../data/editions-en.json';
import chapters from '../data/chapters-en.json';
import duasDataRaw from '../data/duas.json';
import { Dua } from '../types';

const duas: Dua[] = duasDataRaw as Dua[];

export default function DailyVerse() {
  const [isSaved, setIsSaved] = useState(false);
  const [showShareCards, setShowShareCards] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isPeriodMode } = usePeriodMode();
  const { profile } = useProfile();
  const isDarkTheme = profile?.theme === 'black-gold' || profile?.theme === 'oled-vibrant';
  const [periodDuaIndex, setPeriodDuaIndex] = useState(0);

  useEffect(() => {
    if (isPeriodMode) {
      const today = new Date().toDateString();
      let index = parseInt(localStorage.getItem('dailyDuaIndex') || '0', 10);
      let lastUpdate = localStorage.getItem('dailyDuaLastUpdate');

      if (!lastUpdate) {
        // First time initialization
        localStorage.setItem('dailyDuaLastUpdate', today);
        localStorage.setItem('dailyDuaIndex', index.toString());
      } else if (lastUpdate !== today) {
        // A new day has passed since last update, increment index
        index = (index + 1) % duas.length;
        localStorage.setItem('dailyDuaIndex', index.toString());
        localStorage.setItem('dailyDuaLastUpdate', today);
      }
      
      setPeriodDuaIndex(index);
    }
  }, [isPeriodMode]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  const [dayIndex] = useState(() => {
    try {
      const startDateStr = localStorage.getItem('appStartDate');
      let startDate: Date;
      if (!startDateStr) {
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        localStorage.setItem('appStartDate', startDate.toISOString());
      } else {
        startDate = new Date(startDateStr);
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - startDate.getTime();
      const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

      return diffDays % dailyAyat.length;
    } catch (e) {
      return 0;
    }
  });

  const ayatEntry = dailyAyat[dayIndex] || dailyAyat[0];
  const [chapterStr, verseStr] = ayatEntry.verseKey.split(':');

  const chapterNum = parseInt(chapterStr, 10);
  const verseNum = parseInt(verseStr, 10);

  const arabicText = (quran as any)[chapterStr]?.[verseNum - 1]?.text || '';
  const engText = (translationEn as any)[chapterStr]?.[verseNum - 1]?.text || '';
  const chapterInfo = chapters.find(c => c.id === chapterNum);
  const surahName = chapterInfo?.transliteration || '';
  const ayatReference = `${surahName} ${ayatEntry.verseKey}`;

  const currentDua = duas[periodDuaIndex] || duas[0];

  const content = isPeriodMode ? {
    title: "Dua of the Day",
    icon: <Sparkles className="w-4 h-4 text-theme-gold" />,
    arabic: currentDua.arabic,
    english: currentDua.translation || "",
    reference: currentDua.tags && currentDua.tags.length > 0 ? currentDua.tags[0].toUpperCase() : "DUA"
  } : {
    title: "Ayat of the Day",
    icon: <BookOpen className="w-4 h-4 text-theme-gold" />,
    arabic: arabicText,
    english: engText,
    reference: ayatReference
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: content.title,
          text: `${content.english} (${content.reference})`,
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <>
    <div className="px-5 mb-8" ref={containerRef}>
      {isDarkTheme ? (
        <div
          className="relative overflow-hidden rounded-[32px] p-7 cursor-pointer group shadow-2xl transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(201,166,107,0.25)]"
          style={{
            background: 'linear-gradient(160deg, #1c1c1e 0%, #292205 100%)',
          }}
          onClick={() => setShowShareCards(true)}
        >
          {/* Inner glow border */}
          <div className="absolute inset-0 rounded-[32px] border border-theme-gold/20 group-hover:border-theme-gold/40 transition-colors duration-500" />
          
          {/* Top-right gold glow */}
          <div className="absolute -top-24 -right-24 w-56 h-56 bg-theme-gold/15 rounded-full blur-[70px] pointer-events-none group-hover:bg-theme-gold/25 transition-colors duration-700" />
          
          {/* Bottom-left white glow */}
          <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-white/5 rounded-full blur-[60px] pointer-events-none" />

          {/* Parallax Geometric Pattern Overlay (optional/subtle) */}
          <motion.div
            style={{ y: backgroundY }}
            className="absolute inset-0 -inset-y-20 opacity-[0.02] pointer-events-none mix-blend-overlay"
          >
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`
              }}
            />
          </motion.div>

          <div className="relative z-10 flex flex-col h-full">
            {/* Header Row */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-2.5 mt-1 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-theme-gold/10">
                {content.icon}
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-theme-gold/90">{content.title}</span>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={buttonTap}
                  onClick={(e) => { e.stopPropagation(); handleShare(); }}
                  className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-theme-gold/10 flex items-center justify-center text-theme-gold/80 hover:text-theme-gold hover:bg-black/60 transition-all shadow-sm"
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileTap={buttonTap}
                  onClick={(e) => { e.stopPropagation(); setIsSaved(!isSaved); }}
                  className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-theme-gold/10 flex items-center justify-center text-theme-gold/80 hover:text-theme-gold hover:bg-black/60 transition-all shadow-sm relative"
                >
                  <AnimatePresence>
                    {isSaved && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Heart className="w-4 h-4 text-theme-gold fill-theme-gold" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <motion.div
                    animate={{ scale: isSaved ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Heart className="w-4 h-4" />
                  </motion.div>
                </motion.button>
              </div>
            </div>

            {/* Arabic Text with Yellow to White Gradient */}
            <div className="text-center mb-8 mt-2 relative px-2">
              <p
                className="text-[30px] leading-[2.1] py-2 font-normal bg-clip-text text-transparent bg-gradient-to-b from-[#ffffff] via-[#fff5d6] to-[#d4af37]"
                style={{ 
                  fontFamily: '"Al Majeed Quranic", serif',
                  filter: 'drop-shadow(0px 4px 12px rgba(212, 175, 55, 0.15))'
                }}
                dir="rtl"
              >
                {content.arabic}
              </p>
            </div>

            {/* English Translation */}
            <div className="flex-1 flex flex-col justify-end">
              <div className="relative px-4">
                <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-gradient-to-b from-theme-gold/60 via-theme-gold/20 to-transparent rounded-full" />
                <p className="text-[13.5px] text-white/80 text-left leading-[1.8] font-medium drop-shadow-sm">
                  {content.english}
                </p>
              </div>
              
              {/* Reference */}
              <div className="flex items-center justify-start mt-6 pl-4">
                <span className="w-6 h-[1px] bg-theme-gold/50" />
                <p className="text-[9.5px] text-theme-gold px-2.5 uppercase tracking-[0.15em] font-bold">
                  {content.reference}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="bg-theme-gold/10 rounded-[32px] p-6 shadow-[var(--nisa-shadow-gold)] relative overflow-hidden group cursor-pointer border border-theme-gold/20 hover:border-theme-gold/40"
          onClick={() => setShowShareCards(true)}
        >
          {/* Subtle geometric pattern with parallax */}
          <motion.div
            style={{ y: backgroundY }}
            className="absolute inset-0 -inset-y-20 opacity-[0.03] pointer-events-none transition-opacity group-hover:opacity-[0.06]"
          >
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z' fill='%23C9A66B' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`
              }}
            />
          </motion.div>

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 mt-1">
                {content.icon}
                <span className="text-xs font-bold uppercase tracking-widest text-theme-gold">{content.title}</span>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={buttonTap}
                  onClick={(e) => { e.stopPropagation(); handleShare(); }}
                  className="w-9 h-9 rounded-full bg-theme-surface-card/60 flex items-center justify-center text-theme-gold hover:bg-theme-surface-card/80 transition-colors shadow-sm"
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileTap={buttonTap}
                  onClick={(e) => { e.stopPropagation(); setIsSaved(!isSaved); }}
                  className="w-9 h-9 rounded-full bg-theme-surface-card/60 flex items-center justify-center text-theme-gold hover:bg-theme-surface-card/80 transition-colors shadow-sm relative"
                >
                  <AnimatePresence>
                    {isSaved && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Heart className="w-4 h-4 text-theme-rose fill-current" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <motion.div
                    animate={{ scale: isSaved ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Heart className="w-4 h-4" />
                  </motion.div>
                </motion.button>
              </div>
            </div>

            <div className="text-center mb-6">
              <p
                className="text-[26px] leading-[2] text-text-primary/90 py-2 font-normal"
                style={{ fontFamily: '"Al Majeed Quranic", serif' }}
                dir="rtl"
              >
                {content.arabic}
              </p>
            </div>

            <p className="text-sm text-text-secondary text-center leading-relaxed font-medium">
              {content.english}
            </p>
            <p className="text-[10px] text-text-muted text-center mt-3 uppercase tracking-wider font-semibold">
              {content.reference}
            </p>
          </div>
        </div>
      )}
    </div>

      {showShareCards && (
        <AyatShareCards
          arabicText={content.arabic}
          englishText={content.english}
          reference={content.reference}
          onClose={() => setShowShareCards(false)}
        />
      )}
    </>
  );
}
