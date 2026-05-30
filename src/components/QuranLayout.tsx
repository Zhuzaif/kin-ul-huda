import React, { useEffect, useMemo, useState } from 'react';
import QuranHeader from './QuranHeader';
import ResumeReading from './ResumeReading';
import QuranFilters, { QuranFilterId } from './QuranFilters';
import SurahList from './SurahList';
import QuranReadingScreen from './QuranReadingScreen';
import MushafLayout from './mushaf/MushafLayout';
import MushafPageViewer from './mushaf/MushafPageViewer';
import VerseCard from './VerseCard';
import chapters from '../data/chapters-en.json';
import quran from '../data/quran.json';
import translationEn from '../data/editions-en.json';
import juzData from '../data/juz.json';

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

type JuzEntry = {
  index: string;
  start: { index: string; verse: string; name: string };
  end: { index: string; verse: string; name: string };
};

type JuzMapped = {
  index: string;
  title: string;
  startChapterId: number;
  startVerse: number;
  endChapterId: number;
  endVerse: number;
  startName: string;
  endName: string;
  startArabic: string;
  arabicTitle: string;
};

type SavedVerse = {
  chapterId: number;
  verse: number;
};

type LastRead = {
  chapterId: number;
  verse: number;
  updatedAt: number;
};

interface QuranLayoutProps {
  onReadingModeChange?: (isReading: boolean) => void;
}

const chapterList = chapters as Chapter[];
const quranByChapter = quran as QuranMap;
const translationByChapter = translationEn as QuranMap;
const juzRaw = juzData as JuzEntry[];

const LAST_READ_KEY = 'nisa.quran.lastRead';
const SAVED_VERSES_KEY = 'nisa.quran.savedVerses';

const juzNames = [
  'Alif Lam Meem',
  'Sayaqool',
  'Tilkal Rusul',
  'Lan Tana Loo',
  'Wal Mohsanat',
  'La Yuhibbullah',
  'Wa Iza Samiu',
  'Wa Lau Annana',
  'Qalal Malao',
  "Wa A'lamu",
  'Yatazeroon',
  "Wa Mamin Da'abatin",
  'Wa Ma Ubrioo',
  'Rubama',
  'Subhanallazi',
  'Qal Alam',
  'Iqtaraba Lin-Nasi',
  'Qadd Aflaha',
  'Wa Qalallazina',
  "A'man Khalaqa",
  'Utlu Ma Oohiya',
  'Wa Man Yaqnut',
  'Wa Mali',
  'Faman Azlamu',
  'Ilayhi Yuruddu',
  "Ha'a Meem",
  'Qala Fama Khatbukum',
  'Qadd Sami Allah',
  'Tabarakallazi',
  "Amma Yatasa'aloon",
];

const juzArabicNames = [
  'آلم',
  'سَيَقُولُ',
  'تِلْكَ ٱلْرُّسُلُ',
  'لَنْ تَنَالُوا',
  'وَٱلْمُحْصَنَاتُ',
  'لَا يُحِبُّ ٱللهُ',
  'وَإِذَا سَمِعُوا',
  'وَلَوْ أَنَّنَا',
  'قَالَ ٱلْمَلَأُ',
  'وَٱعْلَمُواْ',
  'يَعْتَذِرُونَ',
  'وَمَا مِنْ دَآبَّةٍ',
  'وَمَا أُبَرِّئُ',
  'رُبَمَا',
  'سُبْحَانَ ٱلَّذِى',
  'قَالَ أَلَمْ',
  'ٱقْتَرَبَ لِلْنَّاسِ',
  'قَدْ أَفْلَحَ',
  'وَقَالَ ٱلَّذِينَ',
  'أَمَّنْ خَلَقَ',
  'أُتْلُ مَاأُوْحِیَ',
  'وَمَنْ يَّقْنُتْ',
  'وَمَآ لي',
  'فَمَنْ أَظْلَمُ',
  'إِلَيْهِ يُرَدُّ',
  'حم',
  'قَالَ فَمَا خَطْبُكُمْ',
  'قَدْ سَمِعَ ٱللَّهُ',
  'تَبَارَكَ ٱلَّذِى',
  'عَمَّ يَتَسَاءَلُونَ',
];

const parseChapterId = (value: string) => Number(value);
const parseVerseNumber = (value: string) => Number(value.replace('verse_', ''));

export default function QuranLayout({ onReadingModeChange }: QuranLayoutProps) {
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  const [selectedVerseNumber, setSelectedVerseNumber] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<QuranFilterId>('quran');
  const [quranSubTab, setQuranSubTab] = useState<'surahs' | 'juz'>('surahs');
  const [openMushafPage, setOpenMushafPage] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastRead, setLastRead] = useState<LastRead | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const lastReadRaw = window.localStorage.getItem(LAST_READ_KEY);
      if (lastReadRaw) {
        const parsed = JSON.parse(lastReadRaw) as LastRead;
        if (
          typeof parsed?.chapterId === 'number' &&
          typeof parsed?.verse === 'number'
        ) {
          return parsed;
        }
      }
    } catch (error) {
      console.error(error);
    }

    return null;
  });

  const [savedVerses, setSavedVerses] = useState<SavedVerse[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const savedRaw = window.localStorage.getItem(SAVED_VERSES_KEY);
      if (savedRaw) {
        const parsed = JSON.parse(savedRaw) as SavedVerse[];
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item) =>
              typeof item?.chapterId === 'number' && typeof item?.verse === 'number'
          );
        }
      }
    } catch (error) {
      console.error(error);
    }

    return [];
  });

  useEffect(() => {
    onReadingModeChange?.(selectedChapterId !== null || openMushafPage !== null);
  }, [onReadingModeChange, selectedChapterId, openMushafPage]);

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

  const juzList = useMemo<JuzMapped[]>(() => {
    return juzRaw.map((entry, position) => {
      const startChapterId = parseChapterId(entry.start.index);
      const endChapterId = parseChapterId(entry.end.index);
      const startVerse = parseVerseNumber(entry.start.verse);
      const endVerse = parseVerseNumber(entry.end.verse);
      const startChapter = chapterList.find((item) => item.id === startChapterId);
      const endChapter = chapterList.find((item) => item.id === endChapterId);

      return {
        index: entry.index,
        title: juzNames[position] ?? `Juz ${entry.index}`,
        arabicTitle: juzArabicNames[position] ?? '',
        startChapterId,
        startVerse,
        endChapterId,
        endVerse,
        startName: startChapter?.transliteration ?? entry.start.name,
        endName: endChapter?.transliteration ?? entry.end.name,
        startArabic: startChapter?.name ?? '',
      };
    });
  }, []);

  const isVerseInJuz = (chapterId: number, verse: number, item: JuzMapped) => {
    if (chapterId < item.startChapterId || chapterId > item.endChapterId) {
      return false;
    }
    if (item.startChapterId === item.endChapterId) {
      return verse >= item.startVerse && verse <= item.endVerse;
    }
    if (chapterId === item.startChapterId) {
      return verse >= item.startVerse;
    }
    if (chapterId === item.endChapterId) {
      return verse <= item.endVerse;
    }
    return true;
  };

  const currentJuz = useMemo(() => {
    if (!lastRead) {
      return null;
    }
    return (
      juzList.find((item) => isVerseInJuz(lastRead.chapterId, lastRead.verse, item)) ??
      null
    );
  }, [juzList, lastRead]);

  const filteredJuz = useMemo(() => {
    if (!normalizedQuery) {
      return juzList;
    }
    return juzList.filter((item) => {
      const terms = [
        item.index,
        item.title,
        item.startName,
        item.endName,
        item.startArabic,
        item.arabicTitle,
        String(item.startVerse),
        String(item.endVerse),
      ];
      return terms.some((term) => term.toLowerCase().includes(normalizedQuery));
    });
  }, [juzList, normalizedQuery]);

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

  const handleOpenJuz = (item: JuzMapped) => {
    setSelectedChapterId(item.startChapterId);
    setSelectedVerseNumber(item.startVerse);
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
    const payload = activeFilter === 'saved'
      ? savedVerses
      : (activeFilter === 'quran' && quranSubTab === 'juz')
        ? juzList
        : chapterList;
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFilter === 'saved'
      ? 'saved-verses.json'
      : (activeFilter === 'quran' && quranSubTab === 'juz')
        ? 'juz.json'
        : 'surahs.json';
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

  if (openMushafPage !== null) {
    return (
      <MushafPageViewer
        initialPage={openMushafPage}
        onBack={() => setOpenMushafPage(null)}
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

      {activeFilter === 'quran' && (
        <div className="px-6 mb-6">
          <div className="flex gap-2">
            {(['surahs', 'juz'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setQuranSubTab(tab)}
                className={`px-5 py-2.5 rounded-[20px] text-xs font-semibold transition-all shadow-sm border border-white/40 ${
                  quranSubTab === tab
                    ? 'bg-[#2B604A] text-white'
                    : 'bg-white/80 text-gray-600 hover:bg-white'
                }`}
              >
                {tab === 'surahs' ? 'Surahs' : 'Juz'}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeFilter === 'saved' ? (
        <div className="px-6 pb-28 flex flex-col gap-5">
          {savedVerseCards.length === 0 ? (
            <div className="bg-white/70 border border-white/70 rounded-[22px] p-4 text-sm text-gray-500 text-center">
              {savedVerses.length === 0 ? (
                'No saved verses yet.'
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <span>No saved verses match your search.</span>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-[11px] font-semibold uppercase tracking-widest text-white bg-[#2B604A] px-4 py-2 rounded-full shadow-sm"
                  >
                    Clear Search
                  </button>
                </div>
              )}
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
      ) : (activeFilter === 'quran' && quranSubTab === 'juz') ? (
        <div className="px-6 pb-28 flex flex-col gap-4">
          {currentJuz && lastRead ? (
            <button
              type="button"
              onClick={handleContinue}
              className="w-full bg-white/70 border border-white/70 rounded-[24px] px-4 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex items-center justify-between"
            >
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-gold font-semibold">
                  Continue Reading
                </p>
                <p className="text-[14px] font-semibold text-gray-800 mt-1">
                  Juz {currentJuz.index} • {currentJuz.title}
                </p>
                <p className="text-[11px] text-gray-500 mt-1">
                  {resumeChapter?.transliteration ?? 'Surah'} • {resumeChapterId}:{resumeVerseNumber}
                </p>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-white bg-[#2B604A] px-3 py-2 rounded-full shadow-sm">
                Resume
              </span>
            </button>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredJuz.length === 0 ? (
              <div className="bg-white/70 border border-white/70 rounded-[22px] p-4 text-sm text-gray-500 text-center sm:col-span-2">
                No juz match your search.
              </div>
            ) : (
              filteredJuz.map((item) => (
                <button
                  key={item.index}
                  onClick={() => handleOpenJuz(item)}
                  className="bg-white/60 hover:bg-white/85 transition-colors rounded-[26px] p-4 flex items-center justify-between shadow-[0_6px_18px_rgba(0,0,0,0.04)] border border-white/70 text-left relative overflow-hidden group"
                  aria-label={`Open Juz ${item.index}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-soft-mint/25 via-transparent to-soft-mint/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="flex items-center gap-3 z-10">
                    <div className="w-11 h-11 rounded-full bg-soft-mint flex items-center justify-center text-[#2B604A] font-bold text-[12px] shadow-inner">
                      {item.index}
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-gray-800 tracking-tight">
                          {item.title}
                      </h4>
                        <p className="text-[11px] text-gray-500 mt-1">
                          Starts at {item.startName}
                        </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end z-10">
                    <span className="text-[22px] font-arabic text-muted-gold">
                      {item.arabicTitle || item.startArabic || item.startName}
                    </span>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-muted-gold bg-muted-gold-light/60 px-2 py-1 rounded-full mt-2">
                      Start
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      ) : activeFilter === 'mushaf' ? (
        <MushafLayout searchQuery={searchQuery} onOpenPage={setOpenMushafPage} />
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
