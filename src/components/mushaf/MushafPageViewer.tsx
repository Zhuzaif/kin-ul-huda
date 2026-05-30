import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import chapters from '../../data/chapters-en.json';
import quran from '../../data/quran.json';
import mushafPages from '../../data/mushaf-pages.json';

type Chapter = {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: 'meccan' | 'medinan';
  total_verses: number;
};

type Verse = { chapter: number; verse: number; text: string };
type QuranMap = Record<string, Verse[]>;
type MushafPagesData = {
  totalPages: number;
  surahStartPages: Record<string, number>;
  surahPageRanges: Record<string, { start: number; end: number; count: number }>;
};

const chapterList = chapters as Chapter[];
const quranByChapter = quran as QuranMap;
const pagesData = mushafPages as MushafPagesData;

const FONT_URL =
  'https://verses.quran.foundation/fonts/quran/hafs/nastaleeq/indopak/indopak-nastaleeq-waqf-lazim-v4.2.1.woff2';

interface MushafPageViewerProps {
  initialPage?: number;
  onBack?: () => void;
}

/**
 * Build a mapping of page number -> verses that belong on that page.
 * We distribute verses across pages proportionally based on text length.
 */
function buildPageVerses(): Record<number, { surahId: number; verse: number; text: string }[]> {
  const result: Record<number, { surahId: number; verse: number; text: string }[]> = {};

  for (let surahId = 1; surahId <= 114; surahId++) {
    const range = pagesData.surahPageRanges[String(surahId)];
    if (!range) continue;

    const verses = quranByChapter[String(surahId)] ?? [];
    if (verses.length === 0) continue;

    const totalPageCount = range.count;
    const versesPerPage = Math.ceil(verses.length / totalPageCount);

    for (let i = 0; i < verses.length; i++) {
      const pageOffset = Math.floor(i / versesPerPage);
      const pageNum = Math.min(range.start + pageOffset, range.end);

      if (!result[pageNum]) result[pageNum] = [];
      result[pageNum].push({
        surahId,
        verse: verses[i].verse,
        text: verses[i].text,
      });
    }
  }

  return result;
}

// Pre-compute once
const allPageVerses = buildPageVerses();

export default function MushafPageViewer({ initialPage = 1, onBack }: MushafPageViewerProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [fontLoaded, setFontLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = pagesData.totalPages;

  // Load indopak font
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

  // Verses on current page
  const pageVerses = useMemo(() => {
    return allPageVerses[currentPage] ?? [];
  }, [currentPage]);

  // Which surahs appear on this page
  const pageSurahIds = useMemo(() => {
    const ids = new Set<number>();
    pageVerses.forEach((v) => ids.add(v.surahId));
    return Array.from(ids).sort((a, b) => a - b);
  }, [pageVerses]);

  // Title
  const pageTitle = useMemo(() => {
    return pageSurahIds
      .map((id) => chapterList.find((c) => c.id === id)?.transliteration ?? `Surah ${id}`)
      .join(' / ');
  }, [pageSurahIds]);

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

  // Group verses by surah for rendering with headers
  const surahGroups = useMemo(() => {
    const groups: { surahId: number; chapter: Chapter | undefined; verses: typeof pageVerses }[] = [];
    let currentSurahId = -1;

    for (const v of pageVerses) {
      if (v.surahId !== currentSurahId) {
        currentSurahId = v.surahId;
        groups.push({
          surahId: v.surahId,
          chapter: chapterList.find((c) => c.id === v.surahId),
          verses: [],
        });
      }
      groups[groups.length - 1].verses.push(v);
    }
    return groups;
  }, [pageVerses]);

  // Check if this page is the start of a surah
  const isSurahStart = (surahId: number) => {
    const startPage = pagesData.surahStartPages[String(surahId)];
    return startPage === currentPage;
  };

  return (
    <div ref={containerRef} className="flex w-full flex-col h-full animate-in fade-in duration-300">
      {/* Header */}
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
              aria-label="Previous page"
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
              aria-label="Next page"
              className="w-9 h-9 rounded-full bg-white/70 border border-white/70 shadow-sm flex items-center justify-center text-gray-700 hover:bg-white transition-colors disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mushaf Page */}
      <div className="flex-1 overflow-y-auto px-3 pb-28">
        <div
          className="bg-[#FFFDF8] border border-amber-100/60 rounded-[20px] shadow-[0_8px_28px_rgba(0,0,0,0.06)] px-5 py-6 min-h-[460px]"
          dir="rtl"
        >
          {!fontLoaded ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-gray-400">Loading Mushaf font…</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {surahGroups.map((group) => (
                <div key={`${currentPage}-${group.surahId}`}>
                  {/* Surah header if this page starts the surah */}
                  {isSurahStart(group.surahId) && (
                    <>
                      <div className="flex items-center justify-center py-3 mb-1">
                        <div className="bg-gradient-to-r from-[#2B604A]/10 via-[#2B604A]/20 to-[#2B604A]/10 rounded-full px-8 py-2.5 border border-[#2B604A]/15">
                          <span className="font-arabic text-[20px] text-[#2B604A] font-bold">
                            {group.chapter?.name ?? `سورة`}
                          </span>
                        </div>
                      </div>
                      {/* Bismillah (except for Surah At-Tawbah #9 and Al-Fatihah #1) */}
                      {group.surahId !== 9 && group.surahId !== 1 && (
                        <div className="text-center py-2 mb-1">
                          <span
                            className="text-[20px] text-[#2B604A]/70 leading-[2.4]"
                            style={{ fontFamily: 'IndopakNastaleeq, serif' }}
                          >
                            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Verses */}
                  <div
                    className="text-justify leading-[2.8]"
                    style={{
                      fontFamily: 'IndopakNastaleeq, serif',
                      fontSize: '22px',
                      color: '#1a1a1a',
                      textAlignLast: 'center',
                    }}
                  >
                    {group.verses.map((v, i) => (
                      <span key={`${v.surahId}-${v.verse}`}>
                        {v.text}
                        {' '}
                        <span
                          className="text-[#2B604A]/60 text-[16px]"
                          style={{ fontFamily: "'Scheherazade New', serif" }}
                        >
                          ﴿{v.verse.toLocaleString('ar-EG')}﴾
                        </span>
                        {' '}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {pageVerses.length === 0 && (
                <div className="flex items-center justify-center min-h-[300px]">
                  <p className="text-sm text-gray-400">No content on this page</p>
                </div>
              )}
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
