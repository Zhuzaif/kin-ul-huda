import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, Type } from 'lucide-react';
import chapters from '../data/chapters-en.json';
import quran from '../data/quran.json';
import translationEn from '../data/editions-en.json';
import FloatingAudioPlayer from './FloatingAudioPlayer';
import PeriodModeBanner from './PeriodModeBanner';
import VerseCard from './VerseCard';

type Chapter = {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: 'meccan' | 'medinan';
  total_verses: number;
};

type Verse = {
  chapter: number;
  verse: number;
  text: string;
};

type QuranMap = Record<string, Verse[]>;

interface QuranReadingScreenProps {
  chapterId: number;
  onBack?: () => void;
  initialVerseNumber?: number;
  savedVerses?: { chapterId: number; verse: number }[];
  onLastReadChange?: (data: { chapterId: number; verse: number }) => void;
  onSaveToggle?: (data: { chapterId: number; verse: number; isSaved: boolean }) => void;
}

const chapterList = chapters as Chapter[];
const quranByChapter = quran as QuranMap;
const translationByChapter = translationEn as QuranMap;
const RECITER_STORAGE_KEY = 'nisa.quran.reciter';
const RECITER_OPTIONS = [
  { id: 'mishary', label: 'Mishary' },
  { id: 'abdul-basit', label: 'Abdul Basit' },
  { id: 'maher', label: 'Maher' },
  { id: 'yasser', label: 'Yasser' },
  { id: 'shuraim', label: 'Shuraim' },
];

export default function QuranReadingScreen({
  chapterId,
  onBack,
  initialVerseNumber,
  savedVerses = [],
  onLastReadChange,
  onSaveToggle,
}: QuranReadingScreenProps) {
  const chapter = chapterList.find((item) => item.id === chapterId);
  const verses = quranByChapter[String(chapterId)] ?? [];
  const translations = translationByChapter[String(chapterId)] ?? [];
  const translationMap = useMemo(
    () => new Map(translations.map((item) => [item.verse, item.text])),
    [translations]
  );

  const [activeVerseIndex, setActiveVerseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedReciterId, setSelectedReciterId] = useState(() => {
    if (typeof window === 'undefined') {
      return 'mishary';
    }
    const stored = window.localStorage.getItem(RECITER_STORAGE_KEY);
    if (stored && RECITER_OPTIONS.some((item) => item.id === stored)) {
      return stored;
    }
    return 'mishary';
  });
  const [isRecitationLoading, setIsRecitationLoading] = useState(false);
  const initialScrollDone = useRef(false);
  const lastReportedVerse = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeVerseIndexRef = useRef(activeVerseIndex);
  const isPlayingRef = useRef(isPlaying);
  const [floatingRoot, setFloatingRoot] = useState<HTMLElement | null>(null);
  const [recitationData, setRecitationData] = useState<{
    surahUrl: string;
    segments: Record<string, any>;
    isAyahLevel?: boolean;
  } | null>(null);

  const savedSet = useMemo(
    () => new Set(savedVerses.map((item) => `${item.chapterId}:${item.verse}`)),
    [savedVerses]
  );

  useEffect(() => {
    activeVerseIndexRef.current = activeVerseIndex;
  }, [activeVerseIndex]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(RECITER_STORAGE_KEY, selectedReciterId);
  }, [selectedReciterId]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    setFloatingRoot(document.getElementById('floating-audio-root'));
  }, []);

  useEffect(() => {
    let isActive = true;
    const fetchRecitation = async () => {
      setIsRecitationLoading(true);
      setRecitationData(null);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      try {
        const [surahRes, segmentsRes] = await Promise.all([
          fetch(`/recitations/${selectedReciterId}/surah.json`),
          fetch(`/recitations/${selectedReciterId}/segments.json`),
        ]);

        if (!surahRes.ok || !segmentsRes.ok) {
          throw new Error('Recitation response not ok');
        }

        const surahData = await surahRes.json();
        const segmentsData = await segmentsRes.json();

        if (!isActive) {
          return;
        }

        const surahInfo = surahData[String(chapterId)];
        if (surahInfo?.audio_url) {
          setRecitationData({
            surahUrl: surahInfo.audio_url,
            segments: segmentsData,
            isAyahLevel: false,
          });
        } else if (segmentsData && Object.keys(segmentsData).length > 0) {
          const hasChapterSegments = Object.keys(segmentsData).some((key) => key.startsWith(`${chapterId}:`));
          if (hasChapterSegments) {
            setRecitationData({
              surahUrl: '',
              segments: segmentsData,
              isAyahLevel: true,
            });
          } else {
            setRecitationData(null);
          }
        } else {
          setRecitationData(null);
        }
      } catch (err) {
        console.error('Failed to load recitation data', err);
        if (isActive) {
          setRecitationData(null);
        }
      } finally {
        if (isActive) {
          setIsRecitationLoading(false);
        }
      }
    };

    fetchRecitation();
    return () => {
      isActive = false;
    };
  }, [chapterId, selectedReciterId]);

  useEffect(() => {
    setActiveVerseIndex(0);
    setIsPlaying(false);
    setProgress(0);
    initialScrollDone.current = false;
  }, [chapterId]);

  useEffect(() => {
    setProgress(0);
  }, [selectedReciterId]);

  useEffect(() => {
    if (!initialVerseNumber || verses.length === 0) {
      return;
    }
    const targetIndex = verses.findIndex((item) => item.verse === initialVerseNumber);
    if (targetIndex >= 0) {
      setActiveVerseIndex(targetIndex);
    }
  }, [initialVerseNumber, verses]);

  useEffect(() => {
    if (!initialVerseNumber || verses.length === 0) {
      return;
    }
    if (initialScrollDone.current) {
      return;
    }
    const targetId = `verse-${chapterId}-${initialVerseNumber}`;
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      initialScrollDone.current = true;
    }
  }, [chapterId, initialVerseNumber, verses.length]);

  useEffect(() => {
    if (!recitationData) return;
    if (!recitationData.surahUrl && !recitationData.isAyahLevel) return;

    let initialUrl = recitationData.surahUrl;
    if (recitationData.isAyahLevel) {
      const verse = verses[activeVerseIndexRef.current];
      if (verse) {
        const key = `${chapterId}:${verse.verse}`;
        initialUrl = recitationData.segments[key]?.audio_url ?? '';
      }
    }

    if (!initialUrl) return;

    const audio = new Audio(initialUrl);
    audioRef.current = audio;

    const seekToActiveVerse = () => {
      if (recitationData.isAyahLevel) {
        setProgress(0);
        return;
      }
      const verse = verses[activeVerseIndexRef.current];
      if (!verse) return;
      const key = `${chapterId}:${verse.verse}`;
      const segment = recitationData.segments[key];
      if (segment) {
        audio.currentTime = segment.timestamp_from / 1000;
        setProgress(0);
      }
    };

    const handleTimeUpdate = () => {
      const currentTimeMs = audio.currentTime * 1000;
      
      if (recitationData.isAyahLevel) {
        if (audio.duration) {
          setProgress(Math.max(0, Math.min(audio.currentTime / audio.duration, 1)));
        }
        return;
      }

      const currentSegments = recitationData.segments;
      let newActiveIndex = -1;
      let activeSegment: any | null = null;

      for (let i = 0; i < verses.length; i++) {
        const verse = verses[i];
        const key = `${chapterId}:${verse.verse}`;
        const segment = currentSegments[key];
        if (segment && currentTimeMs >= segment.timestamp_from && currentTimeMs <= segment.timestamp_to) {
          newActiveIndex = i;
          activeSegment = segment;
          break;
        }
      }

      if (newActiveIndex !== -1 && newActiveIndex !== activeVerseIndexRef.current) {
        setActiveVerseIndex(newActiveIndex);
      }

      if (activeSegment) {
        const segmentDuration = activeSegment.timestamp_to - activeSegment.timestamp_from;
        const segmentProgress = segmentDuration > 0
          ? (currentTimeMs - activeSegment.timestamp_from) / segmentDuration
          : 0;
        setProgress(Math.max(0, Math.min(segmentProgress, 1)));
      } else if (audio.duration) {
        setProgress(Math.max(0, Math.min(audio.currentTime / audio.duration, 1)));
      }
    };

    const handleLoadedMetadata = () => {
      seekToActiveVerse();
      if (isPlayingRef.current) {
        audio.play().catch(console.error);
      }
    };

    const handleEnded = () => {
      if (recitationData.isAyahLevel) {
        const nextIndex = activeVerseIndexRef.current + 1;
        if (nextIndex < verses.length) {
          setActiveVerseIndex(nextIndex);
          setProgress(0);
          const nextVerse = verses[nextIndex];
          if (nextVerse && audioRef.current) {
            const key = `${chapterId}:${nextVerse.verse}`;
            const targetSrc = recitationData.segments[key]?.audio_url;
            if (targetSrc) {
              audioRef.current.src = targetSrc;
              audioRef.current.load();
              if (isPlayingRef.current) {
                audioRef.current.play().catch(console.error);
              }
            }
          }
        } else {
          setIsPlaying(false);
          setProgress(0);
        }
      } else {
        setIsPlaying(false);
        setProgress(0);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      if (audioRef.current === audio) audioRef.current = null;
    };
  }, [recitationData, chapterId, verses]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(console.error);
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const activeVerseNumber = verses[activeVerseIndex]?.verse ?? null;
  const canGoPrevious = activeVerseIndex > 0;
  const canGoNext = activeVerseIndex < verses.length - 1;

  const handlePlayPause = () => {
    if (verses.length === 0 || !recitationData || isRecitationLoading) {
      return;
    }
    setIsPlaying((prev) => !prev);
  };

  const seekToVerse = (index: number) => {
    setActiveVerseIndex(index);
    setProgress(0);
    
    if (audioRef.current && recitationData) {
      const verse = verses[index];
      const key = `${chapterId}:${verse.verse}`;
      const segment = recitationData.segments[key];
      if (segment) {
        audioRef.current.currentTime = segment.timestamp_from / 1000;
      } else {
        audioRef.current.currentTime = 0;
      }
      if (isPlayingRef.current) {
        audioRef.current.play().catch(console.error);
      }
    }
  };

  const handleNext = () => {
    if (!canGoNext) return;
    seekToVerse(Math.min(activeVerseIndex + 1, verses.length - 1));
  };

  const handlePrevious = () => {
    if (!canGoPrevious) return;
    seekToVerse(Math.max(activeVerseIndex - 1, 0));
  };

  const handlePlayVerse = (index: number) => {
    if (index === activeVerseIndex) {
      setIsPlaying((prev) => !prev);
    } else {
      setIsPlaying(true);
      seekToVerse(index);
    }
  };

  const handleShareVerse = async (verse: Verse) => {
    const translation = translationMap.get(verse.verse) ?? '';
    const shareText = `${verse.text}\n${translation}\n(Surah ${title} ${chapterId}:${verse.verse})`;

    try {
      if (navigator.share) {
        await navigator.share({ title: `Surah ${title}`, text: shareText });
        return;
      }
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveToggle = (verseNumber: number, isSaved: boolean) => {
    onSaveToggle?.({ chapterId, verse: verseNumber, isSaved });
  };

  useEffect(() => {
    if (!onLastReadChange || verses.length === 0) {
      return;
    }

    const elements = Array.from(
      document.querySelectorAll(`[id^="verse-${chapterId}-"]`)
    ) as HTMLElement[];

    if (elements.length === 0) {
      return;
    }

    const visibilityMap = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibilityMap.set(entry.target, entry.intersectionRatio);
        });

        let bestEntry: { element: HTMLElement; ratio: number } | null = null;
        visibilityMap.forEach((ratio, element) => {
          if (!bestEntry || ratio > bestEntry.ratio) {
            bestEntry = { element: element as HTMLElement, ratio };
          }
        });

        if (!bestEntry || bestEntry.ratio < 0.35) {
          return;
        }

        const id = bestEntry.element.id;
        const parts = id.split('-');
        const verseNumber = Number(parts[2]);
        if (!Number.isFinite(verseNumber)) {
          return;
        }
        const key = `${chapterId}:${verseNumber}`;
        if (lastReportedVerse.current === key) {
          return;
        }
        lastReportedVerse.current = key;
        onLastReadChange({ chapterId, verse: verseNumber });
      },
      { threshold: [0.35, 0.55, 0.75] }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [chapterId, verses.length, onLastReadChange]);

  const title = chapter?.transliteration ?? 'Quran';
  const subtitle = chapter?.translation ?? '';
  const currentLabel = activeVerseNumber ? `Verse ${activeVerseNumber}` : 'Verse';
  const isRecitationReady = Boolean(recitationData?.surahUrl || recitationData?.isAyahLevel);

  const audioBar = (
    <div className="pointer-events-auto">
      <FloatingAudioPlayer
        isPlaying={isPlaying}
        progress={progress}
        reciterOptions={RECITER_OPTIONS}
        selectedReciterId={selectedReciterId}
        onReciterChange={setSelectedReciterId}
        isLoading={isRecitationLoading}
        isReady={isRecitationReady}
        currentLabel={currentLabel}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isNextDisabled={!canGoNext}
        isPreviousDisabled={!canGoPrevious}
        className="w-full"
      />
    </div>
  );

  const audioBarElement = floatingRoot ? (
    createPortal(audioBar, floatingRoot)
  ) : (
    <div className="px-6 pb-4 mt-6">{audioBar}</div>
  );

  return (
    <div className="flex w-full flex-col h-full animate-in fade-in duration-300 relative">
      <div className="px-6 pt-7 pb-4">
        <div className="grid grid-cols-[40px_1fr_40px] items-center">
          <button
            type="button"
            onClick={onBack}
            disabled={!onBack}
            aria-label="Back to surah list"
            className="w-10 h-10 rounded-full bg-white/70 border border-white/70 shadow-sm flex items-center justify-center text-gray-700 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-muted-gold uppercase">
              Surah
            </p>
            <h1 className="text-[18px] font-bold text-gray-800 tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[11px] font-medium text-gray-500">{subtitle}</p>
            )}
          </div>

          <button
            type="button"
            aria-label="Typography settings"
            className="w-10 h-10 rounded-full bg-white/70 border border-white/70 shadow-sm flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
          >
            <Type className="w-5 h-5" />
          </button>
        </div>
      </div>

      <PeriodModeBanner />

      <div className="px-6">
        <div className="bg-soft-mint/70 border border-white/70 rounded-[20px] px-5 py-4 text-center shadow-[0_6px_16px_rgba(0,0,0,0.04)]">
          <p className="font-arabic text-[22px] text-[#2B604A] leading-[2]" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      </div>

      <div className="px-6 mt-6 pb-36 flex flex-col gap-4">
        {verses.map((verse, index) => (
          <VerseCard
            key={`${verse.chapter}-${verse.verse}`}
            id={`verse-${verse.chapter}-${verse.verse}`}
            verseNumber={verse.verse}
            arabicText={verse.text}
            translationText={translationMap.get(verse.verse) ?? 'Translation coming soon.'}
            isActive={isPlaying && index === activeVerseIndex}
            isSaved={savedSet.has(`${verse.chapter}:${verse.verse}`)}
            onSaveToggle={(isSaved) => handleSaveToggle(verse.verse, isSaved)}
            onPlay={() => handlePlayVerse(index)}
            onShare={() => { handleShareVerse(verse).catch(console.error); }}
          />
        ))}
      </div>

      {audioBarElement}
    </div>
  );
}
