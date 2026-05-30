import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import chapters from '../../data/chapters-en.json';
import mushaf16Lines from '../../data/mushaf-16-lines.json';

type LineData = {
  line: number;
  type: 'surah_name' | 'basmallah' | 'ayah';
  centered: boolean;
  surah?: number;
  text?: string;
};

const FONT_URL =
  'https://verses.quran.foundation/fonts/quran/hafs/nastaleeq/indopak/indopak-nastaleeq-waqf-lazim-v4.2.1.woff2';

interface MushafPageViewerProps {
  initialPage?: number;
  onBack?: () => void;
}

export default function MushafPageViewer({ initialPage = 1, onBack }: MushafPageViewerProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [fontLoaded, setFontLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = 548;

  useEffect(() => {
    const savedPage = localStorage.getItem('lastMushafPage');
    if (savedPage) {
      setCurrentPage(parseInt(savedPage, 10));
    }
  }, []);

  useEffect(() => {
    if (initialPage > 1) {
      setCurrentPage(initialPage);
    }
  }, [initialPage]);

  useEffect(() => {
    localStorage.setItem('lastMushafPage', String(currentPage));
  }, [currentPage]);

  useEffect(() => {
    const fontFace = new FontFace('IndopakNastaleeq', `url(${FONT_URL})`, {
      display: 'swap',
    });
    fontFace
      .load()
      .then((loaded) => {
        document.fonts.add(loaded);
        setFontLoaded(true);
      })
      .catch((err) => console.error('Font load failed:', err));
  }, []);

  const pageLines = useMemo(() => {
    return (mushaf16Lines as Record<string, LineData[]>)[String(currentPage)] || [];
  }, [currentPage]);

  const pageTitle = useMemo(() => {
    const surahsOnPage = new Set<number>();
    pageLines.forEach(l => {
      if (l.type === 'surah_name' && l.surah) surahsOnPage.add(l.surah);
    });
    
    if (surahsOnPage.size === 0) {
      for (let p = currentPage - 1; p >= 1; p--) {
        const lines = (mushaf16Lines as Record<string, LineData[]>)[String(p)] || [];
        for (let i = lines.length - 1; i >= 0; i--) {
          if (lines[i].type === 'surah_name' && lines[i].surah) {
            surahsOnPage.add(lines[i].surah as number);
            break;
          }
        }
        if (surahsOnPage.size > 0) break;
      }
    }

    const ids = Array.from(surahsOnPage);
    if (ids.length === 0) return 'Quran';
    return ids.map(id => (chapters as any)[id - 1]?.transliteration || `Surah ${id}`).join(' / ');
  }, [pageLines, currentPage]);

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const goToPage = useCallback(
    (p: number) => {
      const clamped = Math.max(1, Math.min(totalPages, p));
      setCurrentPage(clamped);
      containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [totalPages]
  );

  return (
    <div ref={containerRef} className="flex w-full flex-col h-full bg-warm-beige animate-in fade-in duration-300">
      <div className="px-4 pt-6 pb-3 shrink-0">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            disabled={!onBack}
            aria-label="Back"
            className="w-10 h-10 rounded-full bg-white/70 border border-white/70 shadow-sm flex items-center justify-center text-gray-700 hover:bg-white transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center flex-1 mx-2">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-muted-gold uppercase">
              Mushaf • Page {currentPage}
            </p>
            <h1 className="text-[15px] font-bold text-gray-800 tracking-tight truncate">
              {pageTitle}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={!canPrev}
              className="w-9 h-9 rounded-full bg-white/70 border border-white/70 shadow-sm flex items-center justify-center text-gray-700 hover:bg-white transition-colors disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-bold text-gray-600 min-w-[44px] text-center">
              {currentPage}/{totalPages}
            </span>
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={!canNext}
              className="w-9 h-9 rounded-full bg-white/70 border border-white/70 shadow-sm flex items-center justify-center text-gray-700 hover:bg-white transition-colors disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-28 flex flex-col">
        <div
          className="bg-[#FFFDF8] border border-amber-100/60 rounded-[10px] shadow-[0_8px_28px_rgba(0,0,0,0.06)] px-2 py-4 flex-1 flex flex-col justify-between"
          dir="rtl"
        >
          {!fontLoaded ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-gray-400">Loading Mushaf font…</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1">
              {pageLines.map((line, index) => {
                if (line.type === 'surah_name') {
                const surahNameStr = line.text?.replace('سورة', '').trim() || `سورة ${line.surah}`;
                return (
                  <div key={`line-${index}`} className="w-full flex justify-center my-5 px-2">
                    <div className="relative w-[95%] max-w-[480px] overflow-hidden rounded-[16px] bg-gradient-to-r from-[#112E20] via-[#1C4433] to-[#112E20] shadow-[0_10px_25px_rgba(28,68,51,0.3)] border border-[#D4AF37]/50 flex items-center justify-between py-4 px-6 group transition-all hover:shadow-[0_12px_30px_rgba(212,175,55,0.2)]">
                      
                      {/* Left Ornate Element */}
                      <div className="hidden sm:flex items-center opacity-80 group-hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 rounded-full border-[1.5px] border-[#D4AF37]/70 flex items-center justify-center bg-[#D4AF37]/10 relative before:absolute before:inset-1 before:border before:border-[#D4AF37]/40 before:rounded-full">
                          <div className="w-2.5 h-2.5 rotate-45 bg-[#D4AF37]"></div>
                        </div>
                        <div className="w-8 h-[1.5px] bg-gradient-to-r from-[#D4AF37]/70 to-transparent ml-3"></div>
                      </div>
                      
                      {/* Center Text */}
                      <div className="text-center z-10 flex-1 flex flex-col items-center">
                        <div className="flex items-center justify-center gap-3" dir="rtl">
                          <span className="font-arabic text-[26px] sm:text-[30px] text-[#D4AF37] font-bold leading-none drop-shadow-md">
                            سورة
                          </span>
                          <span className="font-arabic text-[36px] sm:text-[42px] font-bold text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.6)] leading-none" style={{ fontFamily: 'IndopakNastaleeq, serif' }}>
                            {surahNameStr}
                          </span>
                        </div>
                      </div>

                      {/* Right Ornate Element */}
                      <div className="hidden sm:flex items-center opacity-80 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-[1.5px] bg-gradient-to-l from-[#D4AF37]/70 to-transparent mr-3"></div>
                        <div className="w-10 h-10 rounded-full border-[1.5px] border-[#D4AF37]/70 flex items-center justify-center bg-[#D4AF37]/10 relative before:absolute before:inset-1 before:border before:border-[#D4AF37]/40 before:rounded-full">
                          <div className="w-2.5 h-2.5 rotate-45 bg-[#D4AF37]"></div>
                        </div>
                      </div>

                      {/* Subtle Overlay Pattern */}
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.15] pointer-events-none mix-blend-overlay"></div>
                      {/* Top/Bottom Golden Glow */}
                      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"></div>
                      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"></div>
                    </div>
                  </div>
                );
              }
                if (line.type === 'basmallah') {
                  return (
                    <div key={`line-${index}`} className="text-center py-1 flex-1 flex items-center justify-center">
                      <span
                        className="text-[22px] text-[#2B604A]/90"
                        style={{ fontFamily: 'IndopakNastaleeq, serif' }}
                      >
                        {line.text}
                      </span>
                    </div>
                  );
                }
                return (
                  <div
                    key={`line-${index}`}
                    className="w-full"
                    style={{
                      fontFamily: 'IndopakNastaleeq, serif',
                      fontSize: 'clamp(14px, 4.8vw, 26px)',
                      lineHeight: '1.8',
                      color: '#1a1a1a',
                      textAlign: line.centered ? 'center' : 'justify',
                      textAlignLast: line.centered ? 'center' : 'justify',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      direction: 'rtl'
                    }}
                  >
                    {line.text}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Page ornament */}
        <div className="flex items-center justify-center mt-3 mb-2">
          <div className="h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent w-24" />
          <span className="mx-3 text-[10px] text-amber-300/80 font-bold tracking-wider">
            — {currentPage} —
          </span>
          <div className="h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent w-24" />
        </div>
      </div>
    </div>
  );
}
