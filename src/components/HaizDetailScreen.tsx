import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Quote,
  Sparkles,
  User,
  BookMarked,
  Lightbulb,
  Droplets,
  ArrowRight,
} from 'lucide-react';
import { haizTopics } from '../data/haizTopics';
import type { HaizTopic } from '../data/haizTopics';
import type { FiqhMainTopic } from '../data/fiqhTopics';

interface HaizDetailScreenProps {
  parentTopic: FiqhMainTopic;
  onBack: () => void;
}

/* ───── Single Topic Detail View ───── */
function HaizTopicView({
  topic,
  onBack,
  onNext,
  onPrev,
  currentIndex,
  totalCount,
}: {
  topic: HaizTopic;
  onBack: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  currentIndex: number;
  totalCount: number;
}) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance && onNext) onNext();
    if (distance < -minSwipeDistance && onPrev) onPrev();
  };

  return (
    <div
      className="absolute inset-0 bg-warm-beige z-[60] flex flex-col animate-in fade-in duration-300"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-10 bg-warm-beige/90 backdrop-blur-md px-5 py-3.5 flex items-center gap-3 border-b border-gray-200/40">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100/50 active:scale-95 transition-all"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#D98A5B]">
            Haiz · Topic {currentIndex + 1}/{totalCount}
          </span>
          <h1 className="text-[15px] font-bold text-gray-800 tracking-tight truncate leading-tight">
            {topic.title}
          </h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-soft-pink flex items-center justify-center flex-shrink-0">
          <Droplets className="w-5 h-5 text-soft-pink-dark" />
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 py-5 pb-28">
        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-soft-pink/60 via-light-peach/40 to-white/50 backdrop-blur-sm border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-5 mb-5">
          <div className="absolute -right-6 -top-6 w-28 h-28 bg-soft-pink-dark/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-muted-gold-light/40 rounded-full blur-xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-2xl">{topic.emoji}</span>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${topic.tagBg} ${topic.tagColor}`}
              >
                {topic.tagLabel}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 tracking-tight mb-2 leading-tight">
              {topic.title}
            </h2>
            <p className="text-[13px] font-medium text-gray-600/90 leading-relaxed">
              {topic.summary}
            </p>
          </div>
        </div>

        {/* Hadith Section */}
        {topic.hadith && (
          <div className="mb-5">
            {/* Arabic Text Card */}
            <div className="rounded-t-[24px] rounded-b-none bg-white/70 backdrop-blur-sm border border-white/70 border-b-0 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-muted-gold-light flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5 text-muted-gold" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-gold">
                  📖 Arabic Text
                </span>
              </div>
              <div className="bg-muted-gold-light/40 rounded-[20px] p-5 border border-muted-gold/15">
                <p
                  className="font-arabic text-[22px] leading-[2.2] text-gray-800 text-right"
                  dir="rtl"
                >
                  {topic.hadith.arabic}
                </p>
              </div>
            </div>

            {/* English Translation Card */}
            <div className="rounded-none bg-white/60 backdrop-blur-sm border border-white/70 border-b-0 border-t-0 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-soft-mint flex items-center justify-center">
                  <Quote className="w-3.5 h-3.5 text-[#2B604A]" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#2B604A]">
                  🌍 English Translation
                </span>
              </div>
              <p className="text-[13.5px] font-medium text-gray-700 leading-[1.85] whitespace-pre-line">
                {topic.hadith.translation}
              </p>
            </div>

            {/* Narrator & Reference Card */}
            <div className="rounded-b-[24px] rounded-t-none bg-white/50 backdrop-blur-sm border border-white/70 border-t-0 p-5 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-light-peach flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-[#D98A5B]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-0.5">
                    👤 Narrator
                  </span>
                  <p className="text-[13px] font-semibold text-gray-700">
                    {topic.hadith.narrator}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-soft-mint flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BookMarked className="w-3.5 h-3.5 text-[#2B604A]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-0.5">
                    📚 Reference
                  </span>
                  <p className="text-[13px] font-semibold text-gray-700 whitespace-pre-line">
                    {topic.hadith.reference}
                  </p>
                  {topic.hadith.additionalRef && (
                    <p className="text-[11px] font-medium text-gray-400 mt-1 italic">
                      {topic.hadith.additionalRef}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Simple Explanation Section */}
        <div className="rounded-[24px] bg-white/60 backdrop-blur-sm border border-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-light-peach flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-[#D98A5B]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D98A5B]">
              📝 Simple Explanation
            </span>
          </div>
          <p className="text-[13.5px] font-medium text-gray-700 leading-[1.85]">
            {topic.explanation}
          </p>
        </div>

        {/* Key Points Section */}
        {topic.keyPoints && topic.keyPoints.length > 0 && (
          <div className="rounded-[24px] bg-gradient-to-br from-soft-mint/50 to-muted-gold-light/30 backdrop-blur-sm border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5 mb-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center">
                <Lightbulb className="w-3.5 h-3.5 text-[#2B604A]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#2B604A]">
                Key Takeaways
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              {topic.keyPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <span className="text-[10px] font-bold text-[#2B604A]">
                      {idx + 1}
                    </span>
                  </div>
                  <p className="text-[13px] font-medium text-gray-700 leading-relaxed flex-1">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-[11px] text-gray-400 text-center mt-4 leading-relaxed px-4">
          General guidance only. For personal rulings, consult a qualified
          Aalima or scholar in your madhab.
        </p>
      </div>

      {/* ── Bottom Navigation Bar ── */}
      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between bg-white/80 backdrop-blur-md px-5 py-3.5 rounded-full shadow-lg border border-gray-100/50">
        <button
          type="button"
          onClick={onPrev}
          disabled={!onPrev}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors active:scale-95 ${
            onPrev
              ? 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              : 'bg-gray-50/50 text-gray-200 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center px-2">
          {currentIndex + 1} of {totalCount}
        </span>

        <button
          type="button"
          onClick={onNext}
          disabled={!onNext}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors active:scale-95 ${
            onNext
              ? 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              : 'bg-gray-50/50 text-gray-200 cursor-not-allowed'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

/* ───── Topic card data with gradient colors for numbers ───── */
const topicsCardData = [
  { subtitle: 'Foundation · Hadith', color: '#1094b8' },
  { subtitle: 'Fiqh Ruling · Calculation', color: '#1b9db3' },
  { subtitle: 'Prayers & Fasting', color: '#27a7ae' },
  { subtitle: 'Adhkar & Supplications', color: '#35b09f' },
  { subtitle: 'Purification Method', color: '#51b680' },
  { subtitle: 'Qada Regulations', color: '#6fbd60' },
  { subtitle: 'Marriage & Spiritual Connection', color: '#8bc440' },
];

/* ───── Haiz Topics List Screen — Ribbon Track Design ───── */
export default function HaizDetailScreen({
  parentTopic,
  onBack,
}: HaizDetailScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (selectedIndex !== null) {
    const topic = haizTopics[selectedIndex];
    return (
      <HaizTopicView
        topic={topic}
        currentIndex={selectedIndex}
        totalCount={haizTopics.length}
        onBack={() => setSelectedIndex(null)}
        onNext={
          selectedIndex < haizTopics.length - 1
            ? () => setSelectedIndex(selectedIndex + 1)
            : undefined
        }
        onPrev={
          selectedIndex > 0
            ? () => setSelectedIndex(selectedIndex - 1)
            : undefined
        }
      />
    );
  }

  /* Inline styles for the ribbon track design */
  const trackStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&display=swap');

    .font-numbers-sg {
      font-family: 'Space Grotesk', sans-serif;
    }

    .haiz-thick-track {
      background: linear-gradient(to bottom, #1094b8 0%, #35b09f 50%, #8bc440 100%);
      box-shadow: inset 0px 4px 10px rgba(0, 0, 0, 0.25), inset 0px -4px 10px rgba(0,0,0,0.15);
    }

    .haiz-topic-card {
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 4px 10px -4px rgba(0, 0, 0, 0.04);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .haiz-topic-card:active {
      transform: scale(0.98);
    }

    .haiz-number-block::after {
      content: '';
      position: absolute;
      right: 0;
      top: 20%;
      bottom: 20%;
      width: 1px;
      background: #e2e8f0;
    }
  `;

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden animate-in fade-in duration-300"
      style={{
        backgroundColor: '#f8fafc',
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23cbd5e1' fill-opacity='0.15'%3E%3Cpath d='M40 80c22.091 0 40-17.909 40-40S62.091 0 40 0 0 17.909 0 40s17.909 40 40 40zm0-2c20.987 0 38-17.013 38-38S60.987 2 40 2 2 19.013 2 40s17.013 38 38 38zm0-38c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20-20-8.954-20-20zm0 0c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        backgroundSize: '100px 100px',
        touchAction: 'none',
      }}
    >
      <style>{trackStyles}</style>

      {/* Frosted glass mobile container */}
      <main className="w-full max-w-sm h-full max-h-[860px] flex flex-col bg-white/60 backdrop-blur-md rounded-[32px] p-4 sm:p-5 border border-white/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden">
        {/* Floating Arabic Header Block */}
        <header className="bg-white rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.06)] px-4 py-3.5 mb-5 relative z-20 border border-slate-50 flex flex-col items-center justify-center">
          {/* Back button positioned absolutely on the left */}
          <button
            type="button"
            onClick={onBack}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 active:scale-95 transition-all"
            aria-label="Go back"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>
          <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight text-center leading-tight font-arabic">
            وَٱذْكُرُواْ ٱللَّهَ
          </h1>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#35b09f]" />
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#35b09f] uppercase">
              Taharah &amp; Purity
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#35b09f]" />
          </div>
        </header>

        {/* Central Content Area with ribbon and cards */}
        <div className="relative flex-1 flex flex-col justify-between py-1 px-1">
          {/* The Continuous Gradient Spine/Track */}
          <div
            className="haiz-thick-track absolute rounded-full z-0"
            style={{
              top: '15px',
              bottom: '15px',
              left: '36px',
              width: '14px',
              transform: 'translateX(-50%)',
            }}
          />

          {/* Topic Cards */}
          {haizTopics.map((topic, idx) => {
            const cardMeta = topicsCardData[idx] || topicsCardData[0];
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className="haiz-topic-card bg-white rounded-[16px] flex items-stretch h-[58px] w-full relative z-10 overflow-hidden cursor-pointer text-left"
              >
                <div
                  className="haiz-number-block relative shrink-0 flex items-center justify-center"
                  style={{ width: '60px', backgroundColor: '#f4f6f8' }}
                >
                  <span
                    className="font-numbers-sg text-xl font-bold"
                    style={{ color: cardMeta.color }}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex-1 px-4 flex flex-col justify-center bg-white min-w-0">
                  <h3 className="text-[13px] font-bold text-slate-800 leading-tight truncate">
                    {topic.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5 truncate">
                    {cardMeta.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="mt-4 text-center z-20">
          <p className="text-[9px] text-slate-400 font-semibold tracking-wide">
            CONSULT A SCHOLAR FOR PERSONAL RULINGS
          </p>
        </footer>
      </main>
    </div>
  );
}
