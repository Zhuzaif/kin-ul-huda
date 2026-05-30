import React, { useEffect, useMemo, useState } from 'react';
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
  const savedSet = useMemo(
    () => new Set(savedVerses.map((item) => `${item.chapterId}:${item.verse}`)),
    [savedVerses]
  );

  useEffect(() => {
    setActiveVerseIndex(0);
    setIsPlaying(false);
    setProgress(0);
  }, [chapterId]);

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
    if (!isPlaying || verses.length === 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setProgress((current) => {
        const next = current + 0.03;
        if (next >= 1) {
          setActiveVerseIndex((index) => {
            const isLast = index >= verses.length - 1;
            if (isLast) {
              setIsPlaying(false);
              return index;
            }
            return index + 1;
          });
          return 0;
        }
        return next;
      });
    }, 220);

    return () => window.clearInterval(intervalId);
  }, [isPlaying, verses.length]);

  const activeVerseNumber = verses[activeVerseIndex]?.verse ?? null;
  const canGoPrevious = activeVerseIndex > 0;
  const canGoNext = activeVerseIndex < verses.length - 1;

  const handlePlayPause = () => {
    if (verses.length === 0) {
      return;
    }
    setIsPlaying((prev) => !prev);
  };

  const handleNext = () => {
    if (!canGoNext) {
      return;
    }
    setActiveVerseIndex((prev) => Math.min(prev + 1, verses.length - 1));
    setProgress(0);
  };

  const handlePrevious = () => {
    if (!canGoPrevious) {
      return;
    }
    setActiveVerseIndex((prev) => Math.max(prev - 1, 0));
    setProgress(0);
  };

  const handleSelectVerse = (index: number) => {
    setActiveVerseIndex(index);
    setProgress(0);
  };

  const handlePlayVerse = (index: number) => {
    setActiveVerseIndex(index);
    setProgress(0);
    setIsPlaying(true);
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
    const verse = verses[activeVerseIndex];
    if (!verse) {
      return;
    }
    onLastReadChange?.({ chapterId, verse: verse.verse });
    const element = document.getElementById(`verse-${chapterId}-${verse.verse}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [activeVerseIndex, chapterId, verses, onLastReadChange]);

  const title = chapter?.transliteration ?? 'Quran';
  const subtitle = chapter?.translation ?? '';
  const currentLabel = activeVerseNumber ? `Verse ${activeVerseNumber}` : 'Verse';

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
            isActive={index === activeVerseIndex}
            isSaved={savedSet.has(`${verse.chapter}:${verse.verse}`)}
            onSaveToggle={(isSaved) => handleSaveToggle(verse.verse, isSaved)}
            onSelect={() => handleSelectVerse(index)}
            onPlay={() => handlePlayVerse(index)}
            onShare={() => handleShareVerse(verse)}
          />
        ))}
      </div>

      <div className="absolute bottom-24 left-0 right-0 px-6 pb-4 z-20">
        <FloatingAudioPlayer
          isPlaying={isPlaying}
          progress={progress}
          reciterName="Mishary"
          currentLabel={currentLabel}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isNextDisabled={!canGoNext}
          isPreviousDisabled={!canGoPrevious}
        />
      </div>
    </div>
  );
}
