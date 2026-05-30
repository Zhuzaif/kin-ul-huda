import React, { useMemo, useState } from 'react';
import { BookOpen, Search } from 'lucide-react';
import chapters from '../../data/chapters-en.json';
import juzData from '../../data/juz.json';
import mushafPages from '../../data/mushaf-pages.json';
import MushafPageViewer from './MushafPageViewer';

type Chapter = {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: 'meccan' | 'medinan';
  total_verses: number;
};

type JuzEntry = {
  index: string;
  start: { index: string; verse: string; name: string };
  end: { index: string; verse: string; name: string };
};

type MushafPagesData = {
  totalPages: number;
  surahStartPages: Record<string, number>;
  surahPageRanges: Record<string, { start: number; end: number; count: number }>;
};

type MushafTab = 'surahs' | 'juz';

const chapterList = chapters as Chapter[];
const juzRaw = juzData as JuzEntry[];
const pagesData = mushafPages as MushafPagesData;

const juzNames = [
  'Alif Lam Meem', 'Sayaqool', 'Tilkal Rusul', 'Lan Tana Loo',
  'Wal Mohsanat', 'La Yuhibbullah', 'Wa Iza Samiu', 'Wa Lau Annana',
  'Qalal Malao', "Wa A'lamu", 'Yatazeroon', "Wa Mamin Da'abatin",
  'Wa Ma Ubrioo', 'Rubama', 'Subhanallazi', 'Qal Alam',
  'Iqtaraba Lin-Nasi', 'Qadd Aflaha', 'Wa Qalallazina', "A'man Khalaqa",
  'Utlu Ma Oohiya', 'Wa Man Yaqnut', 'Wa Mali', 'Faman Azlamu',
  'Ilayhi Yuruddu', "Ha'a Meem", 'Qala Fama Khatbukum', 'Qadd Sami Allah',
  'Tabarakallazi', "Amma Yatasa'aloon",
];

// Map juz to approximate page numbers (standard 16-line indopak)
const juzStartPages = [
  1, 22, 42, 62, 82, 102, 121, 142, 162, 182,
  201, 222, 242, 262, 282, 302, 322, 342, 362, 382,
  402, 422, 442, 462, 482, 502, 515, 528, 537, 545,
];

export default function MushafLayout() {
  const [activeTab, setActiveTab] = useState<MushafTab>('surahs');
  const [searchQuery, setSearchQuery] = useState('');
  const [openPage, setOpenPage] = useState<number | null>(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredSurahs = useMemo(() => {
    if (!normalizedQuery) return chapterList;
    return chapterList.filter((item) => {
      const terms = [item.transliteration, item.translation, item.name, String(item.id)];
      return terms.some((t) => t.toLowerCase().includes(normalizedQuery));
    });
  }, [normalizedQuery]);

  const juzList = useMemo(() => {
    return juzRaw.map((entry, i) => {
      const startChapterId = Number(entry.start.index);
      const ch = chapterList.find((c) => c.id === startChapterId);
      return {
        index: Number(entry.index),
        title: juzNames[i] ?? `Juz ${entry.index}`,
        startSurah: ch?.transliteration ?? entry.start.name,
        startPage: juzStartPages[i] ?? 1,
      };
    });
  }, []);

  const filteredJuz = useMemo(() => {
    if (!normalizedQuery) return juzList;
    return juzList.filter((item) => {
      const terms = [String(item.index), item.title, item.startSurah];
      return terms.some((t) => t.toLowerCase().includes(normalizedQuery));
    });
  }, [juzList, normalizedQuery]);

  const handleOpenSurah = (surahId: number) => {
    const startPage = pagesData.surahStartPages[String(surahId)] ?? 1;
    setOpenPage(startPage);
  };

  const handleOpenJuz = (startPage: number) => {
    setOpenPage(startPage);
  };

  if (openPage !== null) {
    return (
      <MushafPageViewer
        initialPage={openPage}
        onBack={() => setOpenPage(null)}
      />
    );
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      {/* Header */}
      <div className="px-6 pt-7 pb-3">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-soft-mint flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[#2B604A]" />
          </div>
          <div>
            <h1 className="text-[18px] font-bold text-gray-800">Mushaf</h1>
            <p className="text-[11px] text-gray-500">Indopak 16-Line Edition</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search surah or juz..."
            className="w-full pl-9 pr-4 py-2.5 rounded-full bg-white/80 border border-white/70 text-[13px] text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#2B604A]/20 shadow-sm"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['surahs', 'juz'] as MushafTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-[20px] text-xs font-semibold transition-all shadow-sm border border-white/40 ${
                activeTab === tab
                  ? 'bg-[#2B604A] text-white'
                  : 'bg-white/80 text-gray-600 hover:bg-white'
              }`}
            >
              {tab === 'surahs' ? 'Surahs' : 'Juz'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-28">
        {activeTab === 'surahs' ? (
          <div className="flex flex-col gap-2.5">
            {filteredSurahs.length === 0 ? (
              <div className="bg-white/70 border border-white/70 rounded-[22px] p-4 text-sm text-gray-500 text-center">
                No surahs match your search.
              </div>
            ) : (
              filteredSurahs.map((ch) => {
                const range = pagesData.surahPageRanges[String(ch.id)];
                return (
                  <button
                    key={ch.id}
                    onClick={() => handleOpenSurah(ch.id)}
                    className="bg-white/60 hover:bg-white/85 transition-colors rounded-[22px] p-4 flex items-center justify-between shadow-[0_4px_14px_rgba(0,0,0,0.03)] border border-white/70 text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-soft-mint flex items-center justify-center text-[#2B604A] font-bold text-[12px] shadow-inner">
                        {ch.id}
                      </div>
                      <div>
                        <h4 className="text-[14px] font-bold text-gray-800">
                          {ch.transliteration}
                        </h4>
                        <p className="text-[11px] text-gray-500">
                          {ch.translation} • {ch.total_verses} ayahs
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-arabic text-[20px] text-muted-gold">
                        {ch.name}
                      </span>
                      {range && (
                        <span className="text-[9px] text-gray-400 mt-1">
                          Page {range.start}
                          {range.count > 1 ? `–${range.end}` : ''}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredJuz.length === 0 ? (
              <div className="bg-white/70 border border-white/70 rounded-[22px] p-4 text-sm text-gray-500 text-center sm:col-span-2">
                No juz match your search.
              </div>
            ) : (
              filteredJuz.map((item) => (
                <button
                  key={item.index}
                  onClick={() => handleOpenJuz(item.startPage)}
                  className="bg-white/60 hover:bg-white/85 transition-colors rounded-[22px] p-4 flex items-center justify-between shadow-[0_4px_14px_rgba(0,0,0,0.03)] border border-white/70 text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-soft-mint flex items-center justify-center text-[#2B604A] font-bold text-[12px] shadow-inner">
                      {item.index}
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-gray-800">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        Starts: {item.startSurah}
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] text-gray-400">
                    Page {item.startPage}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
