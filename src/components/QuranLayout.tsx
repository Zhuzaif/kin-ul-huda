import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { listVariants, listItemVariants, modalVariants } from '../lib/motion';
import { useBackHandler } from '../hooks/useBackHandler';
import { downloadAudioToCache, markSurahDownloaded } from '../utils/audioCache';
import QuranHeader from './QuranHeader';
import ResumeReading from './ResumeReading';
import QuranFilters, { QuranFilterId } from './QuranFilters';
import SurahList from './SurahList';
import QuranReadingScreen from './QuranReadingScreen';
import MushafLayout from './mushaf/MushafLayout';
import MushafPageViewer from './mushaf/MushafPageViewer';
import VerseCard from './VerseCard';
import { useProfile } from '../contexts/ProfileContext';
import chapters from '../data/chapters-en.json';
import quran from '../data/quran.json';
import translationEn from '../data/editions-en.json';
import juzData from '../data/juz.json';
import { Chapter, Verse, QuranMap } from '../data/quranConstants';
import { useSavedVerses } from '../contexts/SavedVersesContext';

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

type LastRead = {
  chapterId: number;
  verse: number;
  updatedAt: number;
};

type QuranTab = 'surah' | 'juz' | 'bookmarks';

interface QuranLayoutProps {
  onReadingModeChange?: (isReading: boolean) => void;
}

const chapterList = chapters as Chapter[];
const quranByChapter = quran as QuranMap;
const translationByChapter = translationEn as QuranMap;
const juzRaw = juzData as JuzEntry[];

const LAST_READ_KEY = 'nisa.quran.lastRead';

const MANUAL_BOOKMARKS_KEY = 'nisa.quran.manualBookmarks';

type ManualBookmark = {
  chapterId: number;
  verse: number;
  timestamp: number;
};

// Octagon clip-path for number badges
const OCTAGON_CLIP =
  'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)';

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

// Surahs that contain a Sajdah (prostration) — chapter id + the verse number of the sajdah
const SAJDA_VERSES: { chapterId: number; verse: number }[] = [
  { chapterId: 7, verse: 206 },
  { chapterId: 13, verse: 15 },
  { chapterId: 16, verse: 49 },
  { chapterId: 17, verse: 107 },
  { chapterId: 19, verse: 58 },
  { chapterId: 22, verse: 18 },
  { chapterId: 22, verse: 77 },
  { chapterId: 25, verse: 60 },
  { chapterId: 27, verse: 25 },
  { chapterId: 32, verse: 15 },
  { chapterId: 38, verse: 24 },
  { chapterId: 41, verse: 37 },
  { chapterId: 53, verse: 62 },
  { chapterId: 84, verse: 21 },
  { chapterId: 96, verse: 19 },
];

const parseChapterId = (value: string) => Number(value);
const parseVerseNumber = (value: string) => Number(value.replace('verse_', ''));

export default function QuranLayout({ onReadingModeChange }: QuranLayoutProps) {
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  const [selectedVerseNumber, setSelectedVerseNumber] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<QuranFilterId>('surah');
  const [activeTab, setActiveTab] = useState<QuranTab>('surah');
  const [openMushafPage, setOpenMushafPage] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGlobalDownloading, setIsGlobalDownloading] = useState(false);
  const [globalDownloadProgress, setGlobalDownloadProgress] = useState(0);
  const [showGlobalDownloadModal, setShowGlobalDownloadModal] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.getElementById('mobile-frame-root'));
  }, []);

  const handleBackFromReading = () => {
    setSelectedChapterId(null);
    setOpenMushafPage(null);
  };

  // Android back closes the reading / mushaf screen before the app can exit.
  useBackHandler(selectedChapterId !== null, () => setSelectedChapterId(null));
  useBackHandler(openMushafPage !== null, () => setOpenMushafPage(null));

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

  const { savedVerses, handleSaveToggle } = useSavedVerses();

  const [manualBookmarks, setManualBookmarks] = useState<ManualBookmark[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const raw = window.localStorage.getItem(MANUAL_BOOKMARKS_KEY);
      const seeded = window.localStorage.getItem('nisa.quran.bookmarks.seeded');
      
      let initialData: ManualBookmark[] = [];
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          initialData = parsed.filter(
            (item) => typeof item?.chapterId === 'number' && typeof item?.verse === 'number'
          );
        }
      }

      if (!seeded) {
        // Default surahs: Kahf (18), Yaseen (36), Ar-Rahman (55), Al-Mulk (67)
        const defaultSurahs = [18, 36, 55, 67];
        defaultSurahs.forEach((chapterId, i) => {
          if (!initialData.some(b => b.chapterId === chapterId)) {
            initialData.push({ chapterId, verse: 1, timestamp: Date.now() - i * 1000 });
          }
        });
        window.localStorage.setItem('nisa.quran.bookmarks.seeded', 'true');
        window.localStorage.setItem(MANUAL_BOOKMARKS_KEY, JSON.stringify(initialData));
      }

      return initialData;
    } catch (e) {
      console.error(e);
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
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(MANUAL_BOOKMARKS_KEY, JSON.stringify(manualBookmarks));
    }
  }, [manualBookmarks]);

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

  const sajdaChapterIds = useMemo(
    () => Array.from(new Set(SAJDA_VERSES.map((s) => s.chapterId))),
    []
  );

  const filteredSurahs = useMemo(() => {
    const baseList =
      activeFilter === 'sajda'
        ? chapterList.filter((item) => sajdaChapterIds.includes(item.id))
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
  }, [activeFilter, normalizedQuery, sajdaChapterIds]);

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

  const manualBookmarkSurahs = useMemo(() => {
    return manualBookmarks
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((b) => chapterList.find((c) => c.id === b.chapterId))
      .filter(Boolean) as Chapter[];
  }, [manualBookmarks]);

  const filteredBookmarkSurahs = useMemo(() => {
    if (!normalizedQuery) return manualBookmarkSurahs;
    return manualBookmarkSurahs.filter(item => {
      const terms = [
        item.transliteration,
        item.translation,
        item.name,
        String(item.id),
      ];
      return terms.some(term => term.toLowerCase().includes(normalizedQuery));
    });
  }, [manualBookmarkSurahs, normalizedQuery]);

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

  const handleBookmarkToggle = () => {
    if (selectedChapterId === null) return;
    const currentVerse = selectedVerseNumber ?? 1;
    
    setManualBookmarks(prev => {
      const exists = prev.some(b => b.chapterId === selectedChapterId);
      if (exists) {
        return prev.filter(b => b.chapterId !== selectedChapterId);
      }
      return [{ chapterId: selectedChapterId, verse: currentVerse, timestamp: Date.now() }, ...prev];
    });
    
    // Close the reading screen and navigate to bookmarks tab
    setSelectedChapterId(null);
    setActiveFilter('bookmarks');
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

  const handleDownloadClick = () => {
    if (isGlobalDownloading) return;
    setShowGlobalDownloadModal(true);
  };

  const confirmGlobalDownload = async () => {
    setShowGlobalDownloadModal(false);
    setIsGlobalDownloading(true);
    setGlobalDownloadProgress(0);

    try {
      const res = await fetch('/recitations/yasser/surah.json');
      if (!res.ok) throw new Error('Failed to fetch surah data');
      const surahData = await res.json();
      const entries = Object.entries(surahData).filter(([_, s]: any) => s.audio_url);

      if (entries.length === 0) throw new Error('No audio available for this reciter');

      let done = 0;
      let failed = 0;
      // Mark a surah only after its own download really landed in the cache, otherwise
      // a mid-way network failure would advertise audio that cannot be played offline.
      for (const [surahId, s] of entries) {
        const ok = await downloadAudioToCache((s as any).audio_url);
        if (ok) {
          markSurahDownloaded(Number(surahId));
        } else {
          failed++;
        }
        done++;
        setGlobalDownloadProgress(Math.round((done / entries.length) * 100));
      }

      if (failed > 0) {
        alert(
          `${failed} of ${entries.length} surahs could not be downloaded. The ones that succeeded are saved — check your connection and try again.`
        );
      }
    } catch (e) {
      console.error("Failed to download all audio", e);
      alert("Failed to download audio. Please check your connection.");
    } finally {
      setIsGlobalDownloading(false);
    }
  };

  const bookmarkedSurahIds = useMemo(() => {
    return new Set(manualBookmarks.map((b) => b.chapterId));
  }, [manualBookmarks]);

  const handleLongPressChapter = (chapterId: number) => {
    setManualBookmarks((prev) => {
      const exists = prev.some((b) => b.chapterId === chapterId);
      if (exists) {
        return prev.filter((b) => b.chapterId !== chapterId);
      }
      return [{ chapterId, verse: 1, timestamp: Date.now() }, ...prev];
    });
  };

  if (selectedChapterId !== null) {
    const isBookmarked = manualBookmarks.some(b => b.chapterId === selectedChapterId);

    return (
      <QuranReadingScreen
        chapterId={selectedChapterId}
        initialVerseNumber={selectedVerseNumber ?? 1}
        onBack={() => setSelectedChapterId(null)}
        onLastReadChange={handleLastReadChange}
        savedVerses={savedVerses}
        onSaveToggle={handleSaveToggle}
        isBookmarked={isBookmarked}
        onBookmarkToggle={handleBookmarkToggle}
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
        onDownload={handleDownloadClick}
        isDownloading={isGlobalDownloading}
        downloadProgress={globalDownloadProgress}
      />
      <ResumeReading
        chapterName={resumeChapter?.transliteration ?? 'Al-Fatihah'}
        chapterArabic={resumeChapter?.name}
        verseNumber={resumeVerseNumber}
        progressPercent={resumePercent}
        onContinue={handleContinue}
        isAvailable={Boolean(lastRead)}
      />
      <QuranFilters activeFilter={activeFilter} onChange={setActiveFilter} />

      {activeFilter === 'bookmarks' ? (
        <SurahList
          items={filteredBookmarkSurahs}
          onSelect={(id) => {
             const bookmarked = manualBookmarks.find(b => b.chapterId === id);
             setSelectedChapterId(id);
             setSelectedVerseNumber(bookmarked?.verse ?? 1);
          }}
          bookmarkedSurahIds={bookmarkedSurahIds}
          onLongPress={handleLongPressChapter}
          emptyLabel={manualBookmarks.length === 0 ? 'No bookmarked Surahs yet. Open a Surah and tap the Bookmark icon to save your place!' : 'No bookmarks match your search.'}
        />
      ) : activeFilter === 'fav_ayat' ? (
        <div className="px-6 pb-6 flex flex-col gap-5">
          {savedVerseCards.length === 0 ? (
            <div className="bg-theme-surface-card border border-theme-border rounded-[22px] p-4 text-sm text-text-tertiary text-center">
              {savedVerses.length === 0 ? (
                'No saved verses yet.'
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <span>No saved verses match your search.</span>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-[11px] font-semibold uppercase tracking-widest text-white bg-theme-accent px-4 py-2 rounded-full shadow-sm"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          ) : (
            <motion.div variants={listVariants} initial="initial" animate="animate" className="flex flex-col gap-5">
              {savedVerseCards.map((item) => (
                <motion.div variants={listItemVariants} key={`${item.verse.chapter}-${item.verse.verse}`} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] text-text-tertiary px-1">
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
              </motion.div>
            ))}
            </motion.div>
          )}
        </div>
      ) : activeFilter === 'juz' ? (
        <div className="px-6 pb-6 flex flex-col">
          {filteredJuz.length === 0 ? (
            <div className="bg-theme-surface-card border border-theme-border rounded-[16px] p-4 text-sm text-text-tertiary text-center">
              No juz match your search.
            </div>
          ) : (
            <motion.div variants={listVariants} initial="initial" animate="animate" className="flex flex-col">
              {filteredJuz.map((item) => (
                <motion.div
                  variants={listItemVariants}
                  key={item.index}
                role="button"
                tabIndex={0}
                onClick={() => handleOpenJuz(item)}
                aria-label={`Open Juz ${item.index}`}
                className="flex items-center justify-between py-3.5 border-b border-theme-border cursor-pointer transition-colors hover:bg-theme-surface-alt text-left"
              >
                {/* Left: octagon number + info */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <div
                      className="absolute inset-0"
                      style={{
                        clipPath: OCTAGON_CLIP,
                        background: 'linear-gradient(135deg, var(--color-theme-gold), var(--color-theme-accent-strong))',
                      }}
                    />
                    <div
                      className="absolute inset-[2px] flex items-center justify-center bg-theme-surface-card"
                      style={{
                        clipPath: OCTAGON_CLIP,
                      }}
                    >
                      <span className="text-[14px] font-semibold text-theme-accent-strong relative z-10">
                        {item.index}
                      </span>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-[15px] font-semibold text-text-primary truncate">
                      {item.title}
                    </h4>
                    <p className="text-[12px] text-text-muted mt-0.5">
                      Starts at {item.startName}
                    </p>
                  </div>
                </div>

                {/* Right: Arabic */}
                <div className="text-right shrink-0">
                  <p
                    className="text-[20px] leading-none text-theme-accent-strong"
                    style={{ fontFamily: "'Amiri', serif" }}
                  >
                    {item.arabicTitle || item.startArabic || item.startName}
                  </p>
                  <p className="text-[11px] text-theme-gold font-medium mt-1.5">
                    {item.startName}
                  </p>
                </div>
              </motion.div>
            ))}
            </motion.div>
          )}
        </div>
      ) : activeFilter === 'mushaf' ? (
        <MushafLayout searchQuery={searchQuery} onOpenPage={setOpenMushafPage} />
      ) : (
        <SurahList
          items={filteredSurahs}
          onSelect={handleOpenChapter}
          bookmarkedSurahIds={bookmarkedSurahIds}
          onLongPress={handleLongPressChapter}
          emptyLabel="No surahs match your search."
        />
      )}

      {portalTarget &&
        createPortal(
          <AnimatePresence>
            {showGlobalDownloadModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                  onClick={() => setShowGlobalDownloadModal(false)}
                />
                <motion.div 
                  variants={modalVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="bg-theme-surface-card rounded-[32px] w-full max-w-[320px] p-6 shadow-2xl relative overflow-hidden z-10 flex flex-col items-center text-center"
                >
                  <h3 className="text-xl font-bold text-text-primary mb-2">Download All Audio</h3>
                  <p className="text-sm text-text-secondary mb-6">
                    This will download ~600MB of audio for offline use. Proceed?
                  </p>

                  <div className="flex items-center gap-3 w-full">
                    <button
                      onClick={() => setShowGlobalDownloadModal(false)}
                      className="flex-1 py-3.5 bg-theme-surface-dark text-text-secondary font-bold rounded-[20px] hover:bg-theme-surface-alt transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmGlobalDownload}
                      className="flex-1 py-3.5 bg-theme-accent text-white font-bold rounded-[20px] hover:bg-theme-accent-strong transition-colors"
                    >
                      Proceed
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          portalTarget
        )}
    </div>
  );
}
