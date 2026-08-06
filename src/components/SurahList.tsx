import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { listVariants, listItemVariants, modalVariants } from '../lib/motion';
import { DownloadCloud, CheckCircle, X, Bookmark } from 'lucide-react';
import chapters from '../data/chapters-en.json';
import {
  downloadAudioToCache,
  getDownloadedSurahsFromStorage,
  markSurahDownloaded,
  replaceDownloadedSurahs,
  checkCachedSurahs,
  subscribeToDownloadedSurahs,
} from '../utils/audioCache';
import { RECITER_OPTIONS, Chapter } from '../data/quranConstants';

const surahs = chapters as Chapter[];

interface SurahListProps {
  onSelect?: (id: number) => void;
  items?: Chapter[];
  emptyLabel?: string;
  bookmarkedSurahIds?: Set<number>;
  onLongPress?: (id: number) => void;
}

// Octagon clip-path for the surah number badge
const OCTAGON_CLIP =
  'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)';

export default function SurahList({ onSelect, items, emptyLabel, bookmarkedSurahIds, onLongPress }: SurahListProps) {
  const list = items ?? surahs;

  const [downloadModalSurah, setDownloadModalSurah] = useState<number | null>(null);
  const [downloadingSurahs, setDownloadingSurahs] = useState<Record<number, boolean>>({});
  const [downloadProgress, setDownloadProgress] = useState<Record<number, number>>({});
  const [downloadedSurahs, setDownloadedSurahs] = useState<Record<number, boolean>>({});
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  const pressTimer = React.useRef<NodeJS.Timeout | null>(null);
  const isLongPress = React.useRef<boolean>(false);

  const handlePressStart = (surahId: number) => {
    if (!onLongPress) return;
    isLongPress.current = false;
    if (pressTimer.current) clearTimeout(pressTimer.current);
    
    pressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
      onLongPress(surahId);
    }, 500);
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleClick = (e: React.MouseEvent, surahId: number) => {
    if (isLongPress.current) {
      e.preventDefault();
      e.stopPropagation();
      isLongPress.current = false;
      return;
    }
    onSelect?.(surahId);
  };

  useEffect(() => {
    setPortalTarget(document.getElementById('mobile-frame-root'));

    // Live updates: a download finishing anywhere (this list, the Quran header's
    // "download all", the Downloads screen) must tick here right away, without a remount.
    const unsubscribe = subscribeToDownloadedSurahs(setDownloadedSurahs);

    const before = getDownloadedSurahsFromStorage();
    setDownloadedSurahs(before);

    // Replace the optimistic state with what CacheStorage actually holds. An empty
    // verified result means nothing is cached, so stale ticks must disappear too.
    let cancelled = false;
    const surahIds = list.map((s) => s.id);
    checkCachedSurahs(surahIds).then(({ downloaded, verified }) => {
      if (cancelled || !verified) return;

      // A download that landed while the cache was being read is not in `downloaded`,
      // so pruning now would wipe a surah that is genuinely cached. Skip this round;
      // the next mount verifies again.
      const grew = Object.keys(getDownloadedSurahsFromStorage()).some(
        (key) => !before[Number(key)]
      );
      if (grew) return;

      setDownloadedSurahs(downloaded);
      replaceDownloadedSurahs(Object.keys(downloaded).map(Number));
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [list]);

  const handleDownloadClick = (e: React.MouseEvent, surahId: number) => {
    e.stopPropagation();
    setDownloadModalSurah(surahId);
  };

  const startDownload = async (reciterId: string) => {
    const surahId = downloadModalSurah;
    if (!surahId) return;
    setDownloadModalSurah(null);

    setDownloadingSurahs((prev) => ({ ...prev, [surahId]: true }));
    setDownloadProgress((prev) => ({ ...prev, [surahId]: 0 }));

    try {
      const res = await fetch(`/recitations/${reciterId}/surah.json`);
      if (!res.ok) throw new Error('Failed to fetch surah data');
      const surahData = await res.json();
      const surahInfo = surahData[String(surahId)];

      if (!surahInfo?.audio_url) {
        throw new Error('This reciter has no audio for this surah');
      }

      const interval = setInterval(() => {
        setDownloadProgress((prev) => ({
          ...prev,
          [surahId]: Math.min((prev[surahId] || 0) + 10, 90),
        }));
      }, 300);

      let ok = false;
      try {
        ok = await downloadAudioToCache(surahInfo.audio_url);
      } finally {
        clearInterval(interval);
      }

      // Only mark it downloaded once the audio is really in the cache
      if (!ok) throw new Error('Audio download failed');

      markSurahDownloaded(surahId);
      setDownloadProgress((prev) => ({ ...prev, [surahId]: 100 }));
      setDownloadedSurahs((prev) => ({ ...prev, [surahId]: true }));
    } catch (e) {
      console.error('Failed to download audio', e);
      setDownloadProgress((prev) => ({ ...prev, [surahId]: 0 }));
      alert(
        e instanceof Error && e.message === 'This reciter has no audio for this surah'
          ? 'This reciter does not have audio for this surah yet. Please pick another reciter.'
          : 'Failed to download audio. Please check your connection.'
      );
    } finally {
      setTimeout(() => {
        setDownloadingSurahs((prev) => ({ ...prev, [surahId]: false }));
      }, 500);
    }
  };

  if (list.length === 0) {
    return (
      <div className="px-6 pb-6">
        <div className="bg-theme-surface-card border border-theme-border rounded-[16px] p-4 text-sm text-text-tertiary text-center">
          {emptyLabel ?? 'No results found.'}
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div variants={listVariants} initial="initial" animate="animate" className="px-6 pb-6 flex flex-col">
        {list.map((surah) => {
          const isDownloading = downloadingSurahs[surah.id];
          const isDownloaded = downloadedSurahs[surah.id];

          return (
            <motion.div
              variants={listItemVariants}
              key={surah.id}
              role="button"
              tabIndex={0}
              onClick={(e) => handleClick(e, surah.id)}
              onTouchStart={() => handlePressStart(surah.id)}
              onTouchEnd={handlePressEnd}
              onTouchMove={handlePressEnd}
              onMouseDown={() => handlePressStart(surah.id)}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
              onContextMenu={(e) => {
                if (onLongPress) {
                  e.preventDefault();
                }
              }}
              aria-label={`Open ${surah.transliteration}`}
              className="flex items-center justify-between py-3.5 border-b border-theme-border cursor-pointer transition-colors hover:bg-black/[0.015] text-left select-none"
            >
              {/* Left: octagon number + info */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative w-10 h-10 flex-shrink-0">
                  {/* Outer octagon (gold/green border) */}
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: OCTAGON_CLIP,
                      background: 'linear-gradient(135deg, var(--color-theme-gold), var(--color-theme-accent-strong))',
                    }}
                  />
                  {/* Inner octagon (white fill) */}
                  <div
                    className="absolute inset-[2px] flex items-center justify-center"
                    style={{
                      clipPath: OCTAGON_CLIP,
                      background: 'var(--color-theme-surface-card)',
                    }}
                  >
                    <span className="text-[14px] font-semibold text-theme-accent-strong relative z-10">
                      {surah.id}
                    </span>
                  </div>
                </div>

                <div className="min-w-0">
                  <h4 className="text-[15px] font-semibold text-text-primary truncate flex items-center gap-1.5">
                    {surah.transliteration}
                    {bookmarkedSurahIds?.has(surah.id) && (
                      <Bookmark className="w-3.5 h-3.5 text-theme-gold fill-current shrink-0" />
                    )}
                  </h4>
                  <p className="text-[12px] text-text-muted mt-0.5">
                    {surah.total_verses} Verses • {surah.type === 'meccan' ? 'Meccan' : 'Medinan'}
                  </p>
                </div>
              </div>

              {/* Right: Arabic + download */}
              <div className="flex flex-col items-end justify-center shrink-0">
                <p
                  className="text-[22px] leading-none text-theme-accent font-bold text-right"
                  style={{ fontFamily: "'Amiri', serif" }}
                >
                  {surah.name}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-[10px] text-theme-gold font-medium">
                    {surah.translation}
                  </p>
                  <button
                    onClick={(e) => handleDownloadClick(e, surah.id)}
                    disabled={isDownloading || isDownloaded}
                    className="text-text-muted hover:text-theme-accent transition-colors flex items-center justify-center"
                    aria-label="Download audio"
                  >
                    {isDownloaded ? (
                      <CheckCircle className="w-4 h-4 text-theme-accent-strong" />
                    ) : isDownloading ? (
                      <div className="w-4 h-4 rounded-full border-2 border-theme-border border-t-theme-accent-strong animate-spin" />
                    ) : (
                      <DownloadCloud className="w-[18px] h-[18px]" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {portalTarget &&
        createPortal(
          <AnimatePresence>
            {downloadModalSurah && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                  onClick={() => setDownloadModalSurah(null)}
                />
                <motion.div 
                  variants={modalVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="bg-theme-surface-card rounded-[32px] w-full max-w-[320px] p-6 shadow-2xl relative overflow-hidden z-10"
                >
                  <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-text-primary">Select Reciter</h3>
                <button
                  onClick={() => setDownloadModalSurah(null)}
                  className="w-8 h-8 flex items-center justify-center bg-theme-surface-dark rounded-full text-text-tertiary hover:bg-theme-surface-dark/80 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {RECITER_OPTIONS.map((reciter) => (
                  <button
                    key={reciter.id}
                    onClick={() => startDownload(reciter.id)}
                    className="w-full py-4 px-5 text-left bg-theme-surface-dark/50 rounded-[20px] font-bold text-text-secondary hover:bg-theme-accent/5 hover:text-theme-accent hover:shadow-sm transition-all flex items-center justify-between"
                  >
                    <span>{reciter.label}</span>
                    <DownloadCloud className="w-5 h-5 opacity-50" />
                  </button>
                ))}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          portalTarget
        )}
    </>
  );
}
