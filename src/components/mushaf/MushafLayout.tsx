import React, { useMemo, useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
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

// Octagon clip-path for number badges
const OCTAGON_CLIP =
  'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)';

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
      {/* Resume Card — compact, matching the new hero style */}
      {lastReadPage && !searchQuery && (
        <div className="px-6 pb-4">
          <button
            onClick={() => onOpenPage(lastReadPage)}
            className="relative w-full rounded-[20px] px-5 py-4 overflow-hidden shadow-[0_10px_20px_rgba(11,77,60,0.25)] flex items-center justify-between"
            style={{
              background: 'linear-gradient(135deg, #0B4D3C 0%, #135E4A 100%)',
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 90% 10%, rgba(201,162,75,0.22) 0%, transparent 42%), radial-gradient(circle at 10% 90%, rgba(255,255,255,0.10) 0%, transparent 32%)",
              }}
            />
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <span
                  className="inline-block text-[10px] font-semibold tracking-[1px] px-2.5 py-0.5 rounded-full mb-1"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff' }}
                >
                  CONTINUE
                </span>
                <h3
                  className="text-[17px] font-bold text-white leading-tight"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Mushaf Page {lastReadPage}
                </h3>
              </div>
            </div>
            <span
              className="relative z-10 flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[12px] font-semibold"
              style={{ background: '#C9A24B', color: '#0B4D3C' }}
            >
              Continue
            </span>
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="px-6 pb-3">
        <div className="flex gap-2.5 overflow-x-auto pb-1 hide-scrollbar">
          {(['surahs', 'juz'] as MushafTab[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-[18px] py-2 rounded-[12px] text-[13px] font-medium transition-all border ${isActive
                  ? 'bg-[#0B4D3C] text-white border-[#0B4D3C]'
                  : 'bg-white text-gray-700 border-[#E0E0E0] hover:bg-gray-50'
                  }`}
              >
                {tab === 'surahs' ? 'Surahs' : 'Juz'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-28">
        {activeTab === 'surahs' ? (
          <div className="flex flex-col">
            {filteredSurahs.length === 0 ? (
              <div className="bg-white border border-[#E0E0E0] rounded-[16px] p-4 text-sm text-gray-500 text-center">
                No surahs match your search.
              </div>
            ) : (
              filteredSurahs.map((ch) => {
                const startPage = pagesData.surahStartPages[String(ch.id)];
                return (
                  <div
                    key={ch.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleOpenSurah(ch.id)}
                    aria-label={`Open ${ch.transliteration} in Mushaf`}
                    className="flex items-center justify-between py-3.5 border-b border-black/5 cursor-pointer transition-colors hover:bg-black/[0.015] text-left"
                  >
                    {/* Left: octagon number + info */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative w-10 h-10 flex-shrink-0">
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
                          <span className="text-[14px] font-semibold text-[#0B4D3C] relative z-10">
                            {ch.id}
                          </span>
                        </div>
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-[15px] font-semibold text-gray-800 truncate">
                          {ch.transliteration}
                        </h4>
                        <p className="text-[12px] text-gray-400 mt-0.5">
                          {ch.translation} • {ch.total_verses} Verses
                        </p>
                      </div>
                    </div>

                    {/* Right: Arabic + page */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span
                        className="text-[22px] leading-none text-[#0B4D3C]"
                        style={{ fontFamily: "'Amiri', serif" }}
                      >
                        {ch.name}
                      </span>
                      {startPage && (
                        <span className="text-[11px] text-[#C9A24B] font-medium">
                          P{startPage}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="flex flex-col">
            {filteredJuz.length === 0 ? (
              <div className="bg-white border border-[#E0E0E0] rounded-[16px] p-4 text-sm text-gray-500 text-center">
                No juz match your search.
              </div>
            ) : (
              filteredJuz.map((item) => (
                <div
                  key={item.index}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleOpenJuz(item.startPage)}
                  aria-label={`Open Juz ${item.index} in Mushaf`}
                  className="flex items-center justify-between py-3.5 border-b border-black/5 cursor-pointer transition-colors hover:bg-black/[0.015] text-left"
                >
                  {/* Left: octagon number + info */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative w-10 h-10 flex-shrink-0">
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
                        <span className="text-[14px] font-semibold text-[#0B4D3C] relative z-10">
                          {item.index}
                        </span>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-[15px] font-semibold text-gray-800 truncate">
                        Juz {item.index} • {item.title}
                      </h4>
                      <p className="text-[12px] text-gray-400 mt-0.5">
                        Starts: {item.startSurah}
                      </p>
                    </div>
                  </div>

                  {/* Right: Arabic */}
                  <div className="text-right shrink-0">
                    {item.titleAr && (
                      <span
                        className="text-[20px] leading-none text-[#0B4D3C]"
                        style={{ fontFamily: "'Amiri', serif" }}
                      >
                        {item.titleAr}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
