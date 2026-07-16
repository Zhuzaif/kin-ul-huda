import React, { useEffect, useState } from 'react';
import { CloudDownload, Trash2, Loader2 } from 'lucide-react';
import ProfileSubScreen from './ProfileSubScreen';
import {
  clearAudioCache,
  downloadAudioToCache,
  getAudioCacheStats,
} from '../../utils/audioCache';

interface DownloadsScreenProps {
  onBack: () => void;
}

export default function DownloadsScreen({ onBack }: DownloadsScreenProps) {
  const [cachedCount, setCachedCount] = useState(0);
  const [supported, setSupported] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const refreshStats = async () => {
    const stats = await getAudioCacheStats();
    setCachedCount(stats.count);
    setSupported(stats.supported);
  };

  useEffect(() => {
    refreshStats();
  }, []);

  const handleDownloadAll = async () => {
    if (downloading) return;
    const ok = window.confirm(
      'Download Quran recitation audio for offline listening? This may use significant storage (~600MB).'
    );
    if (!ok) return;

    setDownloading(true);
    setProgress(0);

    try {
      const res = await fetch('/recitations/yasser/surah.json');
      if (!res.ok) throw new Error('Failed to load surah list');
      const surahData = await res.json();
      const urls = Object.values(surahData)
        .map((s: { audio_url?: string }) => s.audio_url)
        .filter(Boolean) as string[];

      let done = 0;
      for (const url of urls) {
        await downloadAudioToCache(url);
        done += 1;
        setProgress(Math.round((done / urls.length) * 100));
      }
      await refreshStats();
    } catch (e) {
      console.error(e);
      alert('Download failed. Check your connection and try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Remove all downloaded audio from this device?')) return;
    await clearAudioCache();
    await refreshStats();
  };

  return (
    <ProfileSubScreen
      title="Downloads"
      subtitle="Offline Quran recitation"
      onBack={onBack}
    >
      <div className="flex flex-col gap-5">
        <section className="bg-white/70 rounded-[24px] p-5 border border-white/60 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <CloudDownload className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800 tabular-nums">{cachedCount}</p>
          <p className="text-[13px] font-medium text-gray-500 mt-1">audio files cached</p>
          {!supported && (
            <p className="text-[12px] text-[#D98A5B] mt-3">
              Your browser does not support offline cache storage.
            </p>
          )}
        </section>

        {downloading && (
          <div className="bg-soft-mint/50 rounded-[20px] p-4 border border-soft-mint-dark/20">
            <div className="flex items-center gap-2 mb-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#2B604A]" />
              <span className="text-[13px] font-bold text-[#2B604A]">Downloading… {progress}%</span>
            </div>
            <div className="h-2 bg-white/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2B604A] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleDownloadAll}
          disabled={downloading || !supported}
          className="w-full py-4 rounded-[20px] bg-[#1F4535] text-white font-bold text-[14px] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <CloudDownload className="w-5 h-5" />
          Download all surahs
        </button>

        <button
          type="button"
          onClick={handleClear}
          disabled={cachedCount === 0 || downloading}
          className="w-full py-4 rounded-[20px] bg-white/80 border border-gray-200 text-gray-700 font-bold text-[14px] active:scale-[0.98] transition-all disabled:opacity-40 flex items-center justify-center gap-2"
        >
          <Trash2 className="w-5 h-5" />
          Clear offline audio
        </button>

        <p className="text-[12px] text-gray-400 text-center leading-relaxed px-2">
          Saved verses and reading progress are stored separately on this device. Downloads use
          Yasser Al-Dosari recitation where available.
        </p>
      </div>
    </ProfileSubScreen>
  );
}
