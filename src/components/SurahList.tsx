import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DownloadCloud, CheckCircle, X } from 'lucide-react';
import chapters from '../data/chapters-en.json';
import {
  downloadAudioToCache,
  getDownloadedSurahsFromStorage,
  markSurahDownloaded,
  checkCachedSurahs,
} from '../utils/audioCache';
import { RECITER_OPTIONS, Chapter } from '../data/quranConstants';

const surahs = chapters as Chapter[];

interface SurahListProps {
  onSelect?: (id: number) => void;
  items?: Chapter[];
  emptyLabel?: string;
}

// Octagon clip-path for the surah number badge
const OCTAGON_CLIP =
  'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)';

export default function SurahList({ onSelect, items, emptyLabel }: SurahListProps) {
  const list = items ?? surahs;

  const [downloadModalSurah, setDownloadModalSurah] = useState<number | null>(null);
  const [downloadingSurahs, setDownloadingSurahs] = useState<Record<number, boolean>>({});
  const [downloadProgress, setDownloadProgress] = useState<Record<number, number>>({});
  const [downloadedSurahs, setDownloadedSurahs] = useState<Record<number, boolean>>({});
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.getElementById('mobile-frame-root'));

    const initial = getDownloadedSurahsFromStorage();
    setDownloadedSurahs(initial);

    const surahIds = list.map((s) => s.id);
    checkCachedSurahs(surahIds).then((cachedMap) => {
      if (Object.keys(cachedMap).length > 0) {
        setDownloadedSurahs(cachedMap);
      }
    });
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

      if (surahInfo && surahInfo.audio_url) {
        const interval = setInterval(() => {
          setDownloadProgress((prev) => ({
            ...prev,
            [surahId]: Math.min((prev[surahId] || 0) + 10, 90),
          }));
        }, 300);

        await downloadAudioToCache(surahInfo.audio_url);
        markSurahDownloaded(surahId);
        clearInterval(interval);

        setDownloadProgress((prev) => ({ ...prev, [surahId]: 100 }));
        setDownloadedSurahs((prev) => ({ ...prev, [surahId]: true }));
      }
    } catch (e) {
      console.error('Failed to download audio', e);
      alert('Failed to download audio. Please check your connection.');
    } finally {
      setTimeout(() => {
        setDownloadingSurahs((prev) => ({ ...prev, [surahId]: false }));
      }, 500);
    }
  };

  if (list.length === 0) {
    return (
      <div className="px-6 pb-28">
        <div className="bg-white border border-[#E0E0E0] rounded-[16px] p-4 text-sm text-gray-500 text-center">
          {emptyLabel ?? 'No results found.'}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-6 pb-28 flex flex-col">
        {list.map((surah) => {
          const isDownloading = downloadingSurahs[surah.id];
          const isDownloaded = downloadedSurahs[surah.id];

          return (
            <div
              key={surah.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect?.(surah.id)}
              aria-label={`Open ${surah.transliteration}`}
              className="flex items-center justify-between py-3.5 border-b border-black/5 cursor-pointer transition-colors hover:bg-black/[0.015] text-left"
            >
              {/* Left: octagon number + info */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative w-10 h-10 flex-shrink-0">
                  {/* Outer octagon (gold/green border) */}
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: OCTAGON_CLIP,
                      background: 'linear-gradient(135deg, #C9A24B, #0B4D3C)',
                    }}
                  />
                  {/* Inner octagon (white fill) */}
                  <div
                    className="absolute inset-[2px] flex items-center justify-center"
                    style={{
                      clipPath: OCTAGON_CLIP,
                      background: '#FFFFFF',
                    }}
                  >
                    <span className="text-[14px] font-semibold text-[#0B4D3C] relative z-10">
                      {surah.id}
                    </span>
                  </div>
                </div>

                <div className="min-w-0">
                  <h4 className="text-[15px] font-semibold text-gray-800 truncate">
                    {surah.transliteration}
                  </h4>
                  <p className="text-[12px] text-gray-400 mt-0.5">
                    {surah.total_verses} Verses • {surah.type === 'meccan' ? 'Meccan' : 'Medinan'}
                  </p>
                </div>
              </div>

              {/* Right: Arabic + download */}
              <div className="flex flex-col items-end justify-center shrink-0">
                <p
                  className="text-[22px] leading-none text-[#0B4D3C] font-bold text-right"
                  style={{ fontFamily: "'Amiri', serif" }}
                >
                  {surah.name}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-[10px] text-[#C9A24B] font-medium">
                    {surah.translation}
                  </p>
                  <button
                    onClick={(e) => handleDownloadClick(e, surah.id)}
                    disabled={isDownloading || isDownloaded}
                    className="text-gray-400 hover:text-[#0B4D3C] transition-colors flex items-center justify-center"
                    aria-label="Download audio"
                  >
                    {isDownloaded ? (
                      <CheckCircle className="w-4 h-4 text-[#0B4D3C]" />
                    ) : isDownloading ? (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-200 border-t-[#0B4D3C] animate-spin" />
                    ) : (
                      <DownloadCloud className="w-[18px] h-[18px]" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {portalTarget &&
        downloadModalSurah &&
        createPortal(
          <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-[32px] w-full max-w-[320px] p-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Select Reciter</h3>
                <button
                  onClick={() => setDownloadModalSurah(null)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {RECITER_OPTIONS.map((reciter) => (
                  <button
                    key={reciter.id}
                    onClick={() => startDownload(reciter.id)}
                    className="w-full py-4 px-5 text-left bg-gray-50 rounded-[20px] font-bold text-gray-700 hover:bg-[#0B4D3C]/5 hover:text-[#0B4D3C] hover:shadow-sm transition-all flex items-center justify-between"
                  >
                    <span>{reciter.label}</span>
                    <DownloadCloud className="w-5 h-5 opacity-50" />
                  </button>
                ))}
              </div>
            </div>
          </div>,
          portalTarget
        )}
    </>
  );
}
