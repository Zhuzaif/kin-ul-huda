import React, { useMemo, useState, useEffect } from 'react';
import { BookOpen, Search, Clock } from 'lucide-react';
import chapters from '../../data/chapters-en.json';
import juzData from '../../data/juz.json';
import mushaf16Metadata from '../../data/mushaf-16-metadata.json';
import { Chapter } from '../../data/quranConstants';

type JuzEntry = {
  index: string;
  start: { index: string; verse: string; name: string };
  end: { index: string; verse: string; name: string };
};

type MushafPagesData = {
  surahStartPages: Record<string, number>;
  juzStartPages?: Record<string, number>;
};

type MushafTab = 'surahs' | 'juz';

const chapterList = chapters as Chapter[];
const juzRaw = juzData as JuzEntry[];
const pagesData = mushaf16Metadata as MushafPagesData;

const juzNames = [
  { en: 'Alif Lam Meem', ar: 'الم' },
  { en: 'Sayaqool', ar: 'سَيَقُولُ' },
  { en: 'Tilkal Rusul', ar: 'تلك الرسل' },
  { en: 'Lan Tana Loo', ar: 'لن تنالوا' },
  { en: 'Wal Mohsanat', ar: 'والمحصنات' },
  { en: 'La Yuhibbullah', ar: 'لا يحب الله' },
  { en: 'Wa Iza Samiu', ar: 'واذا سمعوا' },
  { en: 'Wa Lau Annana', ar: 'ولو اننا' },
  { en: 'Qalal Malao', ar: 'قال الملأ' },
  { en: "Wa A'lamu", ar: 'واعلموا' },
  { en: 'Yatazeroon', ar: 'يعتذرون' },
  { en: "Wa Mamin Da'abatin", ar: 'وما من دابة' },
  { en: 'Wa Ma Ubrioo', ar: 'وما أبرئ' },
  { en: 'Rubama', ar: 'ربما' },
  { en: 'Subhanallazi', ar: 'سبحان الذي' },
  { en: 'Qal Alam', ar: 'قال ألم' },
  { en: 'Iqtaraba Lin-Nasi', ar: 'اقترب للناس' },
  { en: 'Qadd Aflaha', ar: 'قد أفلح' },
  { en: 'Wa Qalallazina', ar: 'وقال الذين' },
  { en: "A'man Khalaqa", ar: 'أمن خلق' },
  { en: 'Utlu Ma Oohiya', ar: 'اتل ما أوحي' },
  { en: 'Wa Man Yaqnut', ar: 'ومن يقنت' },
  { en: 'Wa Mali', ar: 'وما لي' },
  { en: 'Faman Azlamu', ar: 'فمن أظلم' },
  { en: 'Ilayhi Yuruddu', ar: 'إليه يرد' },
  { en: "Ha'a Meem", ar: 'حم' },
  { en: 'Qala Fama Khatbukum', ar: 'قال فما خطبكم' },
  { en: 'Qadd Sami Allah', ar: 'قد سمع الله' },
  { en: 'Tabarakallazi', ar: 'تبارك الذي' },
  { en: "Amma Yatasa'aloon", ar: 'عم يتساءلون' },
];

interface MushafLayoutProps {
  searchQuery: string;
  onOpenPage: (page: number) => void;
}

export default function MushafLayout({ searchQuery, onOpenPage }: MushafLayoutProps) {
  const [activeTab, setActiveTab] = useState<MushafTab>('surahs');
  const [lastReadPage, setLastReadPage] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('lastMushafPage');
    if (saved) {
      setLastReadPage(parseInt(saved, 10));
    }
  }, []);

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
      // Remove leading zero by casting to Number then String
      const juzIndexStr = String(Number(entry.index));
      const startPage = pagesData.juzStartPages?.[juzIndexStr] ?? 1;
      return {
        index: Number(entry.index),
        title: juzNames[i]?.en ?? `Juz ${entry.index}`,
        titleAr: juzNames[i]?.ar ?? '',
        startSurah: ch?.transliteration ?? entry.start.name,
        startPage,
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
    onOpenPage(startPage);
  };

  const handleOpenJuz = (startPage: number) => {
    onOpenPage(startPage);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      {/* Resume Card */}
      {lastReadPage && !searchQuery && (
        <div className="px-6 pt-6 pb-2">
          <button
            onClick={() => onOpenPage(lastReadPage)}
            className="w-full bg-gradient-to-r from-soft-mint to-white border border-[#2B604A]/20 rounded-[24px] p-5 flex items-center justify-between shadow-[0_8px_24px_rgba(43,96,74,0.08)] group hover:shadow-[0_12px_28px_rgba(43,96,74,0.12)] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#2B604A]/10 flex items-center justify-center text-[#2B604A] group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-bold tracking-wider text-gray-500 uppercase mb-1">
                  Resume Reading
                </p>
                <h3 className="text-[16px] font-bold text-gray-800">
                  Page {lastReadPage}
                </h3>
              </div>
            </div>
            <div className="bg-[#2B604A] text-white px-4 py-2 rounded-full text-[13px] font-medium shadow-sm group-hover:bg-[#1C4433] transition-colors">
              Continue
            </div>
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="px-6 pt-3 pb-3">
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
                const startPage = pagesData.surahStartPages[String(ch.id)];
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
                      {startPage && (
                        <span className="text-[9px] text-gray-400 mt-1">
                          Page {startPage}
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
                  <div className="flex flex-col items-end">
                    {item.titleAr && (
                      <span className="font-arabic text-[18px] text-muted-gold mb-1">
                        {item.titleAr}
                      </span>
                    )}
                    <span className="text-[9px] text-gray-400">
                      Page {item.startPage}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
