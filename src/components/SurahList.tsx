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

export default function SurahList({ onSelect, items, emptyLabel }: SurahListProps) {
  const list = items ?? surahs;
  
  const [downloadModalSurah, setDownloadModalSurah] = useState<number | null>(null);
  const [downloadingSurahs, setDownloadingSurahs] = useState<Record<number, boolean>>({});
  const [downloadProgress, setDownloadProgress] = useState<Record<number, number>>({});
  const [downloadedSurahs, setDownloadedSurahs] = useState<Record<number, boolean>>({});
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.getElementById('mobile-frame-root'));

    // Load initial downloaded status from localStorage & verify with CacheStorage
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

    setDownloadingSurahs(prev => ({ ...prev, [surahId]: true }));
    setDownloadProgress(prev => ({ ...prev, [surahId]: 0 }));

    try {
      const res = await fetch(`/recitations/${reciterId}/surah.json`);
      if (!res.ok) throw new Error('Failed to fetch surah data');
      const surahData = await res.json();
      const surahInfo = surahData[String(surahId)];
      
      if (surahInfo && surahInfo.audio_url) {
        // Simulate progress since we can't easily track native fetch progress without complex streams
        const interval = setInterval(() => {
          setDownloadProgress(prev => ({ 
            ...prev, 
            [surahId]: Math.min((prev[surahId] || 0) + 10, 90) 
          }));
        }, 300);

        await downloadAudioToCache(surahInfo.audio_url);
        markSurahDownloaded(surahId);
        clearInterval(interval);
        
        setDownloadProgress(prev => ({ ...prev, [surahId]: 100 }));
        setDownloadedSurahs(prev => ({ ...prev, [surahId]: true }));
      }
    } catch (e) {
      console.error("Failed to download audio", e);
      alert("Failed to download audio. Please check your connection.");
    } finally {
      setTimeout(() => {
        setDownloadingSurahs(prev => ({ ...prev, [surahId]: false }));
      }, 500);
    }
  };

  if (list.length === 0) {
    return (
      <div className="px-6 pb-28">
        <div className="bg-white/70 border border-white/70 rounded-[22px] p-4 text-sm text-gray-500 text-center">
          {emptyLabel ?? 'No results found.'}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-6 pb-28 flex flex-col gap-3">
        {list.map((surah) => {
          const isDownloading = downloadingSurahs[surah.id];
          const progress = downloadProgress[surah.id] || 0;
          const isDownloaded = downloadedSurahs[surah.id];

          return (
            <div 
              key={surah.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect?.(surah.id)}
              aria-label={`Open ${surah.transliteration}`}
              className="bg-white/50 hover:bg-white/80 transition-colors rounded-[24px] p-4 flex items-center gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-white/60 text-left relative overflow-hidden group cursor-pointer"
            >
          {/* Subtle hover effect background */}
          <div className="absolute inset-0 bg-gradient-to-r from-soft-mint/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          
          <div className="w-[42px] h-[42px] bg-soft-mint rounded-full flex flex-shrink-0 items-center justify-center text-[#2B604A] font-bold text-[13px] shadow-sm">
            {surah.id}
          </div>
          
          <div className="flex-1 z-10">
            <h4 className="text-[15px] font-bold text-gray-800 tracking-tight">{surah.transliteration}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[9.5px] font-semibold text-gray-500">
                {surah.total_verses} VERSES
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="text-[9px] uppercase font-bold tracking-wider text-muted-gold bg-muted-gold-light/60 px-2 py-0.5 rounded-full">
                {surah.type === 'meccan' ? 'Meccan' : 'Medinan'}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-end z-10 pr-1">
            <div className="text-2xl font-arabic text-gray-800/90 font-bold group-hover:text-muted-gold transition-colors">
              {surah.name}
            </div>
            
            <button
              onClick={(e) => handleDownloadClick(e, surah.id)}
              disabled={isDownloading || isDownloaded}
              className="mt-2 text-gray-400 hover:text-[#2B604A] transition-colors relative"
            >
              {isDownloaded ? (
                <CheckCircle className="w-4 h-4 text-[#2B604A]" />
              ) : isDownloading ? (
                <div className="w-4 h-4 rounded-full border-2 border-gray-200 border-t-soft-mint-dark animate-spin" />
              ) : (
                <DownloadCloud className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )})}
    </div>

    {portalTarget && downloadModalSurah && createPortal(
      <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm">
        <div className="bg-white rounded-[32px] w-full max-w-[320px] p-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Select Reciter</h3>
            <button onClick={() => setDownloadModalSurah(null)} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex flex-col gap-3">
            {RECITER_OPTIONS.map(reciter => (
              <button
                key={reciter.id}
                onClick={() => startDownload(reciter.id)}
                className="w-full py-4 px-5 text-left bg-gray-50 rounded-[20px] font-bold text-gray-700 hover:bg-soft-mint hover:text-[#1F4535] hover:shadow-sm transition-all flex items-center justify-between"
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
