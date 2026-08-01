import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Sparkles,
  User,
  BookMarked,
  ArrowRight,
} from 'lucide-react';
import { wuduTayammumTopics } from '../data/wuduTayammumTopics';
import type { WuduTayammumTopic } from '../data/wuduTayammumTopics';
import type { FiqhMainTopic } from '../data/fiqhTopics';

interface WuduTayammumDetailScreenProps {
  parentTopic: FiqhMainTopic;
  onBack: () => void;
}

/* ───── Single Topic Detail View — Minimalist Spiritual Design ───── */
function WuduTayammumTopicView({
  topic,
  onBack,
  onNext,
  onPrev,
  currentIndex,
  totalCount,
}: {
  topic: WuduTayammumTopic;
  onBack: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  currentIndex: number;
  totalCount: number;
}) {
  const [activeTab, setActiveTab] = useState<'translation' | 'explanation'>('translation');
  const [expandedSection, setExpandedSection] = useState<string | null>('explanation');
  const [bookmarked, setBookmarked] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const renderExplanation = (text: string) => {
    const paragraphs = text.split('\n\n');
    return (
      <div className="flex flex-col gap-4">
        {paragraphs.map((para, i) => {
          const trimmed = para.trim();
          const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+?):\s*([\s\S]*)$/);
          if (numberedMatch) {
            const [, num, heading, body] = numberedMatch;
            return (
              <div key={i} className="flex flex-col gap-1">
                <p className="text-[14px] font-semibold leading-[1.7]" style={{ color: 'var(--color-text-primary)' }}>
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold mr-2" style={{ background: 'var(--color-theme-accent-soft)', color: 'var(--color-theme-accent-strong)' }}>
                    {num}
                  </span>
                  {heading}
                </p>
                {body && (
                  <p className="text-[13.5px] leading-[1.85] pl-7" style={{ color: 'var(--color-text-secondary)' }}>
                    {body}
                  </p>
                )}
              </div>
            );
          }
          return (
            <p key={i} className="text-[14px] leading-[1.9]" style={{ color: 'var(--color-text-secondary)' }}>
              {trimmed}
            </p>
          );
        })}
      </div>
    );
  };

  /* Injected Minimalist Spiritual Styles */
  const spiritualStyles = `
    .spiritual-bg { background-color: var(--color-theme-surface); color: var(--color-text-primary); }
    .spiritual-header { border-bottom: 1px solid var(--color-theme-border); background: var(--color-theme-surface); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
    .spiritual-gold { color: var(--color-theme-gold); }
    .spiritual-emerald { color: var(--color-theme-accent-strong); }
    .spiritual-secondary { background: var(--color-theme-surface-alt); }
    .spiritual-muted { color: var(--color-text-muted); }
    .spiritual-border { border-color: rgba(0,0,0,0.05); }


    .accordion-trigger { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 16px 0; font-size: 14px; font-weight: 500; color: #2b2b28; text-align: left; cursor: pointer; background: none; border: none; border-bottom: 1px solid rgba(0,0,0,0.05); transition: all 0.2s; }
    .accordion-trigger:last-child { border-bottom: none; }
    .accordion-chevron { width: 16px; height: 16px; color: #8a897f; transition: transform 0.2s; flex-shrink: 0; }
    .accordion-chevron.open { transform: rotate(180deg); }
    .accordion-content { overflow: hidden; transition: max-height 0.3s ease, opacity 0.3s ease; }
    .accordion-content.closed { max-height: 0; opacity: 0; }
    .accordion-content.open { max-height: 2000px; opacity: 1; }
  `;

  return (
    <div className="absolute inset-0 z-[60] flex flex-col animate-in fade-in duration-300 spiritual-bg" style={{ backgroundColor: '#f9f9f6', color: '#2b2b28' }}>
      <style>{spiritualStyles}</style>

      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-10 spiritual-header" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'rgba(249,249,246,0.8)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center justify-between px-5 py-3.5 max-w-2xl mx-auto">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 grid place-items-center rounded-full transition-colors hover:bg-[#f0efe9] active:scale-95"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" style={{ color: '#2b2b28', opacity: 0.7 }} strokeWidth={1.75} />
          </button>

          <h2 className="text-center text-[15px] font-medium" style={{ color: 'rgba(43,43,40,0.9)' }}>
            {topic.tagLabel}
          </h2>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setBookmarked((v) => !v)}
              className="w-9 h-9 grid place-items-center rounded-full transition-colors hover:bg-[#f0efe9]"
              aria-label="Bookmark"
            >
              <BookMarked
                className="w-5 h-5"
                strokeWidth={1.75}
                fill={bookmarked ? '#b08d35' : 'none'}
                stroke={bookmarked ? '#b08d35' : 'currentColor'}
                style={{ color: 'rgba(43,43,40,0.7)' }}
              />
            </button>
            <button
              type="button"
              className="w-9 h-9 grid place-items-center rounded-full transition-colors hover:bg-[#f0efe9]"
              aria-label="Share"
            >
              <ArrowRight className="w-5 h-5 rotate-[-45deg]" strokeWidth={1.75} style={{ color: 'rgba(43,43,40,0.7)' }} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Scrollable Content ── */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-28">
        <main className="max-w-2xl mx-auto px-6 pb-16 pt-8">
          <section className="mb-10">
            {/* Arabic Text — Centered */}
            {topic.hadith ? (
              <p
                dir="rtl"
                lang="ar"
                className="font-arabic text-center text-[28px] leading-[2.4]"
                style={{ color: '#2b2b28' }}
              >
                {topic.hadith.arabic}
              </p>
            ) : (
              /* If no hadith, show the summary as main content */
              <p className="text-center text-[16px] leading-[1.9] font-medium" style={{ color: 'rgba(43,43,40,0.9)' }}>
                {topic.summary}
              </p>
            )}

            {/* Ornamental Divider */}
            <div className="my-8 flex items-center justify-center gap-3">
              <span className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.1))' }} />
              <span style={{ color: '#b08d35' }}>۞</span>
              <span className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, rgba(0,0,0,0.1))' }} />
            </div>

            {/* Tabs — Translation / Explanation */}
            <div className="w-full">
              <div className="mx-auto mb-6 max-w-sm tab-pill-container">
                <button
                  type="button"
                  className={`tab-pill ${activeTab === 'translation' ? 'active' : ''}`}
                  onClick={() => setActiveTab('translation')}
                >
                  Translation
                </button>
                <button
                  type="button"
                  className={`tab-pill ${activeTab === 'explanation' ? 'active' : ''}`}
                  onClick={() => setActiveTab('explanation')}
                >
                  Explanation
                </button>
              </div>

              {/* Translation Tab Content */}
              {activeTab === 'translation' && (
                <div className="animate-in fade-in duration-200">
                  {topic.hadith ? (
                    <>
                      <p className="text-left text-[14px] leading-[1.9]" style={{ color: 'rgba(43,43,40,0.9)' }}>
                        {topic.hadith.translation}
                      </p>
                      {/* Meta Pills */}
                      <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: '#f0efe9', color: '#8a897f' }}>
                            <User className="w-3.5 h-3.5" strokeWidth={1.75} style={{ color: '#0f5c4a' }} />
                            <span className="text-[13px]">Narrated by {topic.hadith.narrator}</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: '#f0efe9', color: '#8a897f' }}>
                            <BookOpen className="w-3.5 h-3.5" strokeWidth={1.75} style={{ color: '#b08d35' }} />
                            <span className="text-[13px]">{topic.hadith.reference.split('\n')[0]}</span>
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-left">
                      {renderExplanation(topic.explanation)}
                    </div>
                  )}
                </div>
              )}

              {/* Explanation Tab Content */}
              {activeTab === 'explanation' && (
                <div className="animate-in fade-in duration-200">
                  {/* Simple Explanation Accordion */}
                  <div style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <button
                      type="button"
                      className="accordion-trigger"
                      onClick={() => toggleSection('explanation')}
                      style={{ borderBottom: expandedSection === 'explanation' ? 'none' : undefined }}
                    >
                      <span>Simple Explanation</span>
                      <ChevronDown className={`accordion-chevron ${expandedSection === 'explanation' ? 'open' : ''}`} />
                    </button>
                    <div className={`accordion-content ${expandedSection === 'explanation' ? 'open' : 'closed'}`}>
                      <div className="pb-4">
                        {renderExplanation(topic.explanation)}
                      </div>
                    </div>
                  </div>

                  {/* Key Takeaways Accordion */}
                  {topic.keyPoints && topic.keyPoints.length > 0 && (
                    <div style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <button
                        type="button"
                        className="accordion-trigger"
                        onClick={() => toggleSection('takeaways')}
                      >
                        <span>Key Takeaways</span>
                        <ChevronDown className={`accordion-chevron ${expandedSection === 'takeaways' ? 'open' : ''}`} />
                      </button>
                      <div className={`accordion-content ${expandedSection === 'takeaways' ? 'open' : 'closed'}`}>
                        <div className="pb-4">
                          <ul className="flex flex-col gap-4">
                            {topic.keyPoints.map((point, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <span
                                  className="mt-0.5 w-5 h-5 shrink-0 grid place-items-center rounded-full"
                                  style={{ background: 'rgba(15,92,74,0.1)' }}
                                >
                                  <Sparkles className="w-3 h-3" strokeWidth={2.5} style={{ color: '#0f5c4a' }} />
                                </span>
                                <span className="text-[14px] leading-[1.7]" style={{ color: 'rgba(43,43,40,0.8)' }}>
                                  {point}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Footer Disclaimer */}
          <p className="mx-auto max-w-md text-center text-[11px] leading-relaxed" style={{ color: 'rgba(138,137,127,0.7)' }}>
            General guidance only. For rulings specific to your situation, please
            consult a qualified scholar.
          </p>
        </main>
      </div>

      {/* ── Bottom Navigation Bar ── */}
      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between px-5 py-3.5 rounded-full shadow-lg" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,0,0,0.05)' }}>
        <button
          type="button"
          onClick={onPrev}
          disabled={!onPrev}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-95 ${onPrev
            ? 'text-[#2b2b28]/60 hover:bg-[#f0efe9] hover:text-[#2b2b28]'
            : 'text-[#2b2b28]/15 cursor-not-allowed'
            }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="text-[13px] font-medium" style={{ color: 'rgba(43,43,40,0.7)' }}>
          {currentIndex + 1} of {totalCount}
        </span>

        <button
          type="button"
          onClick={onNext}
          disabled={!onNext}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-95 ${onNext
            ? 'text-[#2b2b28]/60 hover:bg-[#f0efe9] hover:text-[#2b2b28]'
            : 'text-[#2b2b28]/15 cursor-not-allowed'
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
  { subtitle: 'Sunnah Method · Step-by-Step', color: '#1094b8' },
  { subtitle: 'Fiqh Rulings · Invalidators', color: '#1b9db3' },
  { subtitle: 'Precautions · Common Mistakes', color: '#27a7ae' },
  { subtitle: 'Tayammum · Permissions', color: '#35b09f' },
  { subtitle: 'Sunnah Tayammum · Steps', color: '#51b680' },
  { subtitle: 'Dua & Virtues · Paradise', color: '#6fbd60' },
];

/* ───── Wudu & Tayammum Topics List Screen — Ribbon Track Design ───── */
export default function WuduTayammumDetailScreen({
  parentTopic,
  onBack,
}: WuduTayammumDetailScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (selectedIndex !== null) {
    const topic = wuduTayammumTopics[selectedIndex];
    return (
      <WuduTayammumTopicView
        topic={topic}
        currentIndex={selectedIndex}
        totalCount={wuduTayammumTopics.length}
        onBack={() => setSelectedIndex(null)}
        onNext={
          selectedIndex < wuduTayammumTopics.length - 1
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

    .wudu-thick-track {
      background: linear-gradient(to bottom, #1094b8 0%, #35b09f 50%, #8bc440 100%);
      box-shadow: inset 0px 4px 10px rgba(0, 0, 0, 0.25), inset 0px -4px 10px rgba(0,0,0,0.15);
    }

    .wudu-topic-card {
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 4px 10px -4px rgba(0, 0, 0, 0.04);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .wudu-topic-card:active {
      transform: scale(0.98);
    }

    .wudu-number-block::after {
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
      <main className="w-full max-w-sm h-full max-h-[860px] flex flex-col bg-theme-surface-card backdrop-blur-md rounded-[32px] p-4 sm:p-5 border border-theme-border shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden">
        {/* Floating Arabic Header Block */}
        <header className="bg-theme-surface-card rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.06)] px-4 py-3.5 mb-5 relative z-20 border border-slate-50 flex flex-col items-center justify-center">
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
            فَاغْسِلُواْ وُجُوهَكُمْ وَأَيْدِيَكُمْ
          </h1>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#35b09f]" />
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#35b09f] uppercase">
              Taharah &amp; Wudu &amp; Tayammum
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#35b09f]" />
          </div>
        </header>

        {/* Central Content Area with ribbon and cards — 6 items using justify-between */}
        <div className="relative flex-1 flex flex-col justify-between py-1 px-1">
          {/* The Continuous Gradient Spine/Track */}
          <div
            className="wudu-thick-track absolute rounded-full z-0"
            style={{
              top: '15px',
              bottom: '15px',
              left: '36px',
              width: '14px',
              transform: 'translateX(-50%)',
            }}
          />

          {/* Topic Cards */}
          {wuduTayammumTopics.map((topic, idx) => {
            const cardMeta = topicsCardData[idx] || topicsCardData[0];
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className="wudu-topic-card bg-theme-surface-card rounded-[16px] flex items-stretch h-[58px] w-full relative z-10 overflow-hidden cursor-pointer text-left"
              >
                <div
                  className="wudu-number-block relative shrink-0 flex items-center justify-center"
                  style={{ width: '60px', backgroundColor: '#f4f6f8' }}
                >
                  <span
                    className="font-numbers-sg text-xl font-bold"
                    style={{ color: cardMeta.color }}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex-1 px-4 flex flex-col justify-center bg-theme-surface-card min-w-0">
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
