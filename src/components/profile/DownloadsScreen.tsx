import React, { useEffect, useState, useRef } from 'react';
import { CloudDownload, Trash2, Loader2, Play, Pause, BookOpen, AlertCircle } from 'lucide-react';
import ProfileSubScreen from './ProfileSubScreen';
import {
  clearAudioCache,
  downloadAudioToCache,
  getAudioCacheStats,
  getDownloadedSurahsFromStorage,
  markSurahDownloaded,
  replaceDownloadedSurahs,
  findCachedReciterForSurah,
  getCachedAudioUrl,
  checkCachedSurahs,
  getSurahIdFromAudioUrl,
  subscribeToDownloadedSurahs,
} from '../../utils/audioCache';
import chapters from '../../data/chapters-en.json';
import { Chapter } from '../../data/quranConstants';

const chapterList = chapters as Chapter[];

// Octagon clip-path for number badges
const OCTAGON_CLIP =
  'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)';

interface DownloadsScreenProps {
  onBack: () => void;
  onOpenSurah?: (surahId: number) => void;
}

export default function DownloadsScreen({ onBack, onOpenSurah }: DownloadsScreenProps) {
  const [cachedCount, setCachedCount] = useState(0);
  const [supported, setSupported] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadedSurahs, setDownloadedSurahs] = useState<Record<number, boolean>>({});
  const [playingSurahId, setPlayingSurahId] = useState<number | null>(null);
  const [loadingSurahId, setLoadingSurahId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const refreshStats = async () => {
    const stats = await getAudioCacheStats();
    setCachedCount(stats.count);
    setSupported(stats.supported);

    // Show the optimistic localStorage state immediately so the list is not empty on load
    const before = getDownloadedSurahsFromStorage();
    setDownloadedSurahs(before);

    // Then replace it with what CacheStorage actually holds. An empty verified result
    // is meaningful — it means nothing is cached — so stale entries must be dropped,
    // in state and in localStorage.
    const surahIds = chapterList.map((ch) => ch.id);
    const { downloaded, verified } = await checkCachedSurahs(surahIds);
    if (!verified) return;

    // A download that landed while the cache was being read is missing from `downloaded`,
    // so pruning now would drop a surah that really is cached. Leave the list alone
    // in that case — the download's own refresh will reconcile it.
    const grew = Object.keys(getDownloadedSurahsFromStorage()).some((key) => !before[Number(key)]);
    if (grew) return;

    setDownloadedSurahs(downloaded);
    replaceDownloadedSurahs(Object.keys(downloaded).map(Number));
  };

  useEffect(() => {
    // Live updates while a download is still running, so the list grows surah by surah
    // instead of staying empty until the whole batch finishes.
    const unsubscribe = subscribeToDownloadedSurahs(setDownloadedSurahs);
    refreshStats();
    return unsubscribe;
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        const src = audioRef.current.src;
        if (src.startsWith('blob:')) window.URL.revokeObjectURL(src);
        audioRef.current = null;
      }
    };
  }, []);

  const downloadedList = chapterList.filter((ch) => downloadedSurahs[ch.id]);

  const handleDownloadAll = async () => {
    if (downloading) return;
    const ok = window.confirm(
      'Download Quran recitation audio for offline listening? This may use significant storage (~600MB).'
    );
    if (!ok) return;

    setDownloading(true);
    setProgress(0);
    setError(null);

    try {
      const res = await fetch('/recitations/yasser/surah.json');
      if (!res.ok) throw new Error('Failed to load surah list');
      const surahData = await res.json();
      const urls = Object.values(surahData)
        .map((s: { audio_url?: string }) => s.audio_url)
        .filter((url): url is string => typeof url === 'string' && url.length > 0);

      if (urls.length === 0) throw new Error('No audio available for this reciter');

      let done = 0;
      let failed = 0;
      // Mark each surah only after its own download actually succeeded, so a mid-way
      // network failure can never report surahs as available offline.
      for (const url of urls) {
        const ok = await downloadAudioToCache(url);
        const surahId = getSurahIdFromAudioUrl(url);
        if (ok && surahId !== null) {
          markSurahDownloaded(surahId);
        } else if (!ok) {
          failed += 1;
        }
        done += 1;
        setProgress(Math.round((done / urls.length) * 100));

        // The cached-files counter is not part of the downloaded-surah store, so it needs
        // its own refresh to move during the batch. Counting keys is cheap next to a download.
        if (ok) {
          const stats = await getAudioCacheStats();
          setCachedCount(stats.count);
        }
      }

      await refreshStats();
      if (failed > 0) {
        setError(
          `${failed} of ${urls.length} surahs could not be downloaded. Check your connection and try again — the ones that succeeded are kept.`
        );
      }
    } catch (e) {
      console.error(e);
      await refreshStats();
      setError('Download failed. Check your connection and try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Remove all downloaded audio from this device?')) return;
    setError(null);
    // Stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      const src = audioRef.current.src;
      if (src.startsWith('blob:')) window.URL.revokeObjectURL(src);
      audioRef.current = null;
      setPlayingSurahId(null);
    }
    await clearAudioCache();
    await refreshStats();
  };

  const handlePlayPause = async (surahId: number) => {
    // If already playing this surah, pause/stop
    if (playingSurahId === surahId) {
      if (audioRef.current) {
        audioRef.current.pause();
        const src = audioRef.current.src;
        if (src.startsWith('blob:')) window.URL.revokeObjectURL(src);
        audioRef.current = null;
      }
      setPlayingSurahId(null);
      return;
    }

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      const src = audioRef.current.src;
      if (src.startsWith('blob:')) window.URL.revokeObjectURL(src);
      audioRef.current = null;
    }

    setLoadingSurahId(surahId);
    setError(null);
    const surahName =
      chapterList.find((ch) => ch.id === surahId)?.transliteration ?? `Surah ${surahId}`;

    let blobUrl: string | null = null;
    try {
      const cached = await findCachedReciterForSurah(surahId);
      if (!cached) {
        // The row was showing as downloaded but the audio is gone from the cache.
        // Tell the user instead of failing silently, and re-sync the list.
        setError(`${surahName} is not available offline anymore. Please download it again.`);
        await refreshStats();
        return;
      }

      blobUrl = await getCachedAudioUrl(cached.cachedUrl);
      const audio = new Audio(blobUrl ?? cached.cachedUrl);
      audioRef.current = audio;

      const releaseBlob = () => {
        if (blobUrl) {
          window.URL.revokeObjectURL(blobUrl);
          blobUrl = null;
        }
      };

      audio.onended = () => {
        setPlayingSurahId(null);
        if (audioRef.current === audio) audioRef.current = null;
        releaseBlob();
      };
      audio.onerror = () => {
        setPlayingSurahId(null);
        setLoadingSurahId(null);
        if (audioRef.current === audio) audioRef.current = null;
        releaseBlob();
        setError(`Could not play ${surahName}. The downloaded audio may be corrupted.`);
      };

      await audio.play();
      // A newer press may have replaced this audio while play() was pending
      if (audioRef.current !== audio) {
        audio.pause();
        releaseBlob();
        return;
      }
      setPlayingSurahId(surahId);
      blobUrl = null; // ownership moves to the handlers above
    } catch (err) {
      console.error('Failed to play surah audio', err);
      if (blobUrl) window.URL.revokeObjectURL(blobUrl);
      audioRef.current = null;
      setPlayingSurahId(null);
      setError(`Could not play ${surahName}. Please try again.`);
    } finally {
      setLoadingSurahId(null);
    }
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

        {error && (
          <div
            role="alert"
            className="bg-[#FBEDE4] rounded-[20px] p-4 border border-[#D98A5B]/30 flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 text-[#B4643A] shrink-0 mt-0.5" />
            <p className="text-[12px] font-medium text-[#8A4A28] leading-relaxed">{error}</p>
          </div>
        )}

        {downloading && (
          <div className="bg-theme-accent-soft/50 rounded-[20px] p-4 border border-theme-accent-soft-dark/20">
            <div className="flex items-center gap-2 mb-2">
              <Loader2 className="w-4 h-4 animate-spin text-theme-accent" />
              <span className="text-[13px] font-bold text-theme-accent">Downloading… {progress}%</span>
            </div>
            <div className="h-2 bg-white/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-theme-accent transition-all duration-300"
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

        {/* Downloaded Surahs List */}
        {downloadedList.length > 0 && (
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <BookOpen className="w-4 h-4 text-[#0B4D3C]" />
              <h3 className="text-[14px] font-bold text-gray-800">
                Downloaded Surahs ({downloadedList.length})
              </h3>
            </div>

            <div className="flex flex-col bg-white/70 rounded-[20px] border border-white/60 overflow-hidden">
              {downloadedList.map((ch) => {
                const isPlaying = playingSurahId === ch.id;
                const isLoading = loadingSurahId === ch.id;
                return (
                  <div
                    key={ch.id}
                    className="flex items-center justify-between py-3 px-4 border-b border-black/5 last:border-b-0"
                  >
                    {/* Left: octagon number + info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-9 h-9 flex-shrink-0">
                        <div
                          className="absolute inset-0"
                          style={{
                            clipPath: OCTAGON_CLIP,
                            background: 'linear-gradient(135deg, #C9A24B, #0B4D3C)',
                          }}
                        />
                        <div
                          className="absolute inset-[2px] flex items-center justify-center"
                          style={{
                            clipPath: OCTAGON_CLIP,
                            background: '#FFFFFF',
                          }}
                        >
                          <span className="text-[12px] font-semibold text-[#0B4D3C] relative z-10">
                            {ch.id}
                          </span>
                        </div>
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-[14px] font-semibold text-text-primary truncate">
                          {ch.transliteration}
                        </h4>
                        <p className="text-[11px] text-text-muted mt-0.5">
                          {ch.total_verses} Verses • {ch.type === 'meccan' ? 'Meccan' : 'Medinan'}
                        </p>
                      </div>
                    </div>

                    {/* Right: Arabic in green box + play button */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div
                        className="rounded-[8px] px-2.5 py-1 flex items-center justify-center"
                        style={{ background: '#0B4D3C' }}
                      >
                        <span
                          className="text-[18px] leading-none text-white"
                          style={{ fontFamily: "'Amiri', serif" }}
                        >
                          {ch.name}
                        </span>
                      </div>

                      <button
                        onClick={() => handlePlayPause(ch.id)}
                        disabled={isLoading}
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                        style={{ background: isPlaying ? '#C9A24B' : 'rgba(11,77,60,0.1)' }}
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 text-[#0B4D3C] animate-spin" />
                        ) : isPlaying ? (
                          <Pause className="w-4 h-4 text-[#0B4D3C]" fill="currentColor" />
                        ) : (
                          <Play className="w-4 h-4 text-[#0B4D3C]" fill="currentColor" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <button
          type="button"
          onClick={handleClear}
          disabled={cachedCount === 0 || downloading}
          className="w-full py-4 rounded-[20px] bg-theme-surface-card/80 border border-theme-border text-text-secondary font-bold text-[14px] active:scale-[0.98] transition-all disabled:opacity-40 flex items-center justify-center gap-2"
        >
          <Trash2 className="w-5 h-5" />
          Clear offline audio
        </button>

        <p className="text-[12px] text-text-muted text-center leading-relaxed px-2">
          Saved verses and reading progress are stored separately on this device. Downloads use
          Yasser Al-Dosari recitation where available.
        </p>
      </div>
    </ProfileSubScreen>
  );
}
