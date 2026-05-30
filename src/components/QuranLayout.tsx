import React, { useEffect, useMemo, useState } from 'react';
import QuranHeader from './QuranHeader';
import ResumeReading from './ResumeReading';
import QuranFilters, { QuranFilterId } from './QuranFilters';
import SurahList from './SurahList';
import QuranReadingScreen from './QuranReadingScreen';
import VerseCard from './VerseCard';
import chapters from '../data/chapters-en.json';
import quran from '../data/quran.json';
import translationEn from '../data/editions-en.json';

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

type SavedVerse = {
  chapterId: number;
  verse: number;
};

type LastRead = {
  chapterId: number;
  verse: number;
  updatedAt: number;
};

const chapterList = chapters as Chapter[];
const quranByChapter = quran as QuranMap;
const translationByChapter = translationEn as QuranMap;

const LAST_READ_KEY = 'nisa.quran.lastRead';
const SAVED_VERSES_KEY = 'nisa.quran.savedVerses';

export default function QuranLayout() {
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  const [selectedVerseNumber, setSelectedVerseNumber] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<QuranFilterId>('surahs');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastRead, setLastRead] = useState<LastRead | null>(null);
  const [savedVerses, setSavedVerses] = useState<SavedVerse[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const lastReadRaw = window.localStorage.getItem(LAST_READ_KEY);
      if (lastReadRaw) {
        const parsed = JSON.parse(lastReadRaw) as LastRead;
        if (
          typeof parsed?.chapterId === 'number' &&
          typeof parsed?.verse === 'number'
        ) {
          setLastRead(parsed);
        }
      }
    } catch (error) {
      console.error(error);
    }

    try {
      const savedRaw = window.localStorage.getItem(SAVED_VERSES_KEY);
      if (savedRaw) {
        const parsed = JSON.parse(savedRaw) as SavedVerse[];
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(
            (item) =>
              typeof item?.chapterId === 'number' && typeof item?.verse === 'number'
          );
          setSavedVerses(cleaned);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !lastRead) {
      return;
    }
    window.localStorage.setItem(LAST_READ_KEY, JSON.stringify(lastRead));
  }, [lastRead]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(SAVED_VERSES_KEY, JSON.stringify(savedVerses));
  }, [savedVerses]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const resumeChapterId = lastRead?.chapterId ?? 1;
  const resumeVerseNumber = lastRead?.verse ?? 1;
  const resumeChapter = chapterList.find((item) => item.id === resumeChapterId) ?? chapterList[0];
  const resumePercent = lastRead && resumeChapter
    ? Math.round((resumeVerseNumber / resumeChapter.total_verses) * 100)
    : 0;

  const filteredSurahs = useMemo(() => {
    const baseList =
      activeFilter === 'friday'
        ? chapterList.filter((item) => item.id === 18)
        : chapterList;

    if (!normalizedQuery) {
      return baseList;
    }

    return baseList.filter((item) => {
      const terms = [
        item.transliteration,
        item.translation,
        item.name,
        String(item.id),
      ];
      return terms.some((term) => term.toLowerCase().includes(normalizedQuery));
    });
  }, [activeFilter, normalizedQuery]);

  const savedVerseCards = useMemo(() => {
    const results = savedVerses
      .map((saved) => {
        const verses = quranByChapter[String(saved.chapterId)] ?? [];
        const verseData = verses.find((item) => item.verse === saved.verse);
        if (!verseData) {
          return null;
        }
        const translations = translationByChapter[String(saved.chapterId)] ?? [];
        const translation = translations.find((item) => item.verse === saved.verse)?.text ?? 'Translation coming soon.';
        const chapter = chapterList.find((item) => item.id === saved.chapterId);
        return {
          chapter,
          verse: verseData,
          translation,
        };
      })
      .filter(Boolean) as Array<{ chapter?: Chapter; verse: Verse; translation: string }>;

    if (!normalizedQuery) {
      return results;
    }

    return results.filter((item) => {
      const terms = [
        item.chapter?.transliteration ?? '',
        item.chapter?.translation ?? '',
        item.verse.text,
        item.translation,
        String(item.verse.verse),
      ];
      return terms.some((term) => term.toLowerCase().includes(normalizedQuery));
    });
  }, [savedVerses, normalizedQuery]);

  const handleContinue = () => {
    setSelectedChapterId(resumeChapterId);
    setSelectedVerseNumber(resumeVerseNumber);
  };

  const handleOpenChapter = (chapterId: number) => {
    setSelectedChapterId(chapterId);
    setSelectedVerseNumber(1);
  };

  const handleLastReadChange = (data: { chapterId: number; verse: number }) => {
    setLastRead({ ...data, updatedAt: Date.now() });
  };

  const handleSaveToggle = (data: { chapterId: number; verse: number; isSaved: boolean }) => {
    setSavedVerses((prev) => {
      const exists = prev.some(
        (item) => item.chapterId === data.chapterId && item.verse === data.verse
      );
      if (data.isSaved && !exists) {
        return [...prev, { chapterId: data.chapterId, verse: data.verse }];
      }
      if (!data.isSaved && exists) {
        return prev.filter(
          (item) => !(item.chapterId === data.chapterId && item.verse === data.verse)
        );
      }
      return prev;
    });
  };

  const handleSearchSubmit = (value: string) => {
    const match = value.match(/^\s*(\d{1,3})\s*[:.-]\s*(\d{1,3})\s*$/);
    if (!match) {
      return;
    }
    const chapterId = Number(match[1]);
    const verseNumber = Number(match[2]);
    const chapter = chapterList.find((item) => item.id === chapterId);
    if (!chapter || verseNumber < 1 || verseNumber > chapter.total_verses) {
      return;
    }
    setSelectedChapterId(chapterId);
    setSelectedVerseNumber(verseNumber);
    setSearchQuery('');
  };

  const handleDownload = () => {
    if (typeof window === 'undefined') {
      return;
    }
    const payload = activeFilter === 'saved' ? savedVerses : chapterList;
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFilter === 'saved' ? 'saved-verses.json' : 'surahs.json';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (selectedChapterId !== null) {
    return (
      <QuranReadingScreen
        chapterId={selectedChapterId}
        initialVerseNumber={selectedVerseNumber ?? 1}
        onBack={() => setSelectedChapterId(null)}
        onLastReadChange={handleLastReadChange}
        savedVerses={savedVerses}
        onSaveToggle={handleSaveToggle}
      />
    );
  }

  return (
    <div className="flex w-full flex-col h-full animate-in fade-in duration-300">
      <QuranHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        onDownload={handleDownload}
      />
      <ResumeReading
        chapterName={resumeChapter?.transliteration ?? 'Al-Fatihah'}
        verseNumber={resumeVerseNumber}
        progressPercent={resumePercent}
        onContinue={handleContinue}
        isAvailable={Boolean(lastRead)}
      />
      <QuranFilters activeFilter={activeFilter} onChange={setActiveFilter} />

      {activeFilter === 'saved' ? (
        <div className="px-6 pb-28 flex flex-col gap-5">
          {savedVerseCards.length === 0 ? (
            <div className="bg-white/70 border border-white/70 rounded-[22px] p-4 text-sm text-gray-500 text-center">
              No saved verses yet.
            </div>
          ) : (
            savedVerseCards.map((item) => (
              <div key={`${item.verse.chapter}-${item.verse.verse}`} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] text-gray-500 px-1">
                  <span>{item.chapter?.transliteration ?? 'Surah'}</span>
                  <span>Verse {item.verse.verse}</span>
                </div>
                <VerseCard
                  verseNumber={item.verse.verse}
                  arabicText={item.verse.text}
                  translationText={item.translation}
                  isSaved
                  onSaveToggle={(isSaved) =>
                    handleSaveToggle({
                      chapterId: item.verse.chapter,
                      verse: item.verse.verse,
                      isSaved,
                    })
                  }
                  onSelect={() => {
                    setSelectedChapterId(item.verse.chapter);
                    setSelectedVerseNumber(item.verse.verse);
                  }}
                />
              </div>
            ))
          )}
        </div>
      ) : activeFilter === 'juz' ? (
        <div className="px-6 pb-28">
          <div className="bg-white/70 border border-white/70 rounded-[22px] p-4 text-sm text-gray-500 text-center">
            Juz navigation needs a juz mapping dataset. Share that file and I will wire it.
          </div>
        </div>
      ) : (
        <SurahList
          items={filteredSurahs}
          onSelect={handleOpenChapter}
          emptyLabel="No surahs match your search."
        />
      )}
    </div>
  );
}
