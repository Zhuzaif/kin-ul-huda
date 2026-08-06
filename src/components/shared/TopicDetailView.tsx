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

/* ───── Generic Topic Shape ───── */
export type TopicHadith = {
  arabic: string;
  translation: string;
  narrator: string;
  reference: string;
  additionalRef?: string;
};

export type TopicData = {
  id: string;
  title: string;
  emoji: string;
  tagLabel: string;
  tagColor: string;
  tagBg: string;
  summary: string;
  hadith?: TopicHadith;
  explanation: string;
  keyPoints?: string[];
};

interface TopicDetailViewProps {
  topic: TopicData;
  onBack: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  currentIndex: number;
  totalCount: number;
}

/* ───── Shared Topic Detail View — Minimalist Spiritual Design ───── */
export default function TopicDetailView({
  topic,
  onBack,
  onNext,
  onPrev,
  currentIndex,
  totalCount,
}: TopicDetailViewProps) {
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

  /* Spiritual design inline CSS variables */
  const spiritualStyles = `
    .spiritual-bg { background-color: var(--color-theme-surface); color: var(--color-text-primary); }
    .spiritual-header { border-bottom: 1px solid var(--color-theme-border); background: var(--color-theme-surface); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
    .spiritual-gold { color: var(--color-theme-gold); }
    .spiritual-emerald { color: var(--color-theme-accent-strong); }
    .spiritual-secondary { background: var(--color-theme-surface-alt); }
    .spiritual-muted { color: var(--color-text-tertiary); }
    .spiritual-border { border-color: var(--color-theme-border); }

    .tab-pill-container { background: var(--color-theme-surface-alt); border-radius: 9999px; padding: 4px; display: flex; }
    .tab-pill { flex: 1; border-radius: 9999px; padding: 8px 16px; font-size: 14px; font-weight: 500; text-align: center; cursor: pointer; transition: all 0.2s; border: none; background: transparent; color: var(--color-text-primary); }
    .tab-pill.active { background: var(--color-theme-surface-card); color: var(--color-theme-accent-strong); box-shadow: 0 1px 4px rgba(0,0,0,0.06); }

    .accordion-trigger { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 16px 0; font-size: 14px; font-weight: 500; color: var(--color-text-primary); text-align: left; cursor: pointer; background: none; border: none; border-bottom: 1px solid var(--color-theme-border); transition: all 0.2s; }
    .accordion-trigger:last-child { border-bottom: none; }
    .accordion-chevron { width: 16px; height: 16px; color: var(--color-text-tertiary); transition: transform 0.2s; flex-shrink: 0; }
    .accordion-chevron.open { transform: rotate(180deg); }
    .accordion-content { overflow: hidden; transition: max-height 0.3s ease, opacity 0.3s ease; }
    .accordion-content.closed { max-height: 0; opacity: 0; }
    .accordion-content.open { max-height: 2000px; opacity: 1; }
  `;
  return (
    <div className="fixed inset-0 z-[60] flex flex-col animate-in fade-in duration-300 spiritual-bg" style={{ backgroundColor: 'var(--color-theme-surface)', color: 'var(--color-text-primary)' }}>
      <style>{spiritualStyles}</style>

      {/* ── Sticky Header ── */}
      <header
        className="sticky top-0 z-10 spiritual-header relative overflow-hidden"
        style={{
          borderBottom: '1px solid var(--color-theme-border)',
          background: 'var(--color-theme-surface)',
          backdropFilter: 'blur(12px)',
          paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))',
          paddingBottom: '16px'
        }}
      >
        {/* Ink Animation Background */}
        <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay">
          <div className="liquid-ink"></div>
          <div className="liquid-ink-2"></div>
        </div>

        <div className="relative z-10 flex items-center justify-between px-5 max-w-2xl mx-auto">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 grid place-items-center rounded-full transition-colors hover:bg-theme-surface-alt active:scale-95"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" style={{ color: 'var(--color-text-primary)', opacity: 0.7 }} strokeWidth={1.75} />
          </button>

          <h2 className="text-center text-[15px] font-medium" style={{ color: 'var(--color-text-primary)' }}>
            {topic.tagLabel}
          </h2>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setBookmarked((v) => !v)}
              className="w-9 h-9 grid place-items-center rounded-full transition-colors hover:bg-theme-surface-alt"
              aria-label="Bookmark"
            >
              <BookMarked
                className="w-5 h-5"
                strokeWidth={1.75}
                fill={bookmarked ? 'currentColor' : 'none'}
                stroke="currentColor"
                style={{ color: bookmarked ? 'var(--color-theme-gold)' : 'var(--color-text-tertiary)' }}
              />
            </button>
            <button
              type="button"
              className="w-9 h-9 grid place-items-center rounded-full transition-colors hover:bg-theme-surface-alt"
              aria-label="Share"
            >
              <ArrowRight className="w-5 h-5 rotate-[-45deg]" strokeWidth={1.75} style={{ color: 'var(--color-text-tertiary)' }} />
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
                style={{ color: 'var(--color-text-primary)' }}
              >
                {topic.hadith.arabic}
              </p>
            ) : (
              /* If no hadith, show the summary as main content */
              <p className="text-center text-[16px] leading-[1.9] font-medium" style={{ color: 'var(--color-text-primary)' }}>
                {topic.summary}
              </p>
            )}

            {/* Ornamental Divider */}
            <div className="my-8 flex items-center justify-center gap-3">
              <span className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, var(--color-theme-border-strong))' }} />
              <span style={{ color: 'var(--color-theme-gold)' }}>۞</span>
              <span className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, var(--color-theme-border-strong))' }} />
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
                      <p className="text-left text-[14px] leading-[1.9]" style={{ color: 'var(--color-text-primary)' }}>
                        {topic.hadith.translation}
                      </p>
                      {/* Meta Pills */}
                      <div className="mt-6 pt-5" style={{ borderTop: '1px solid var(--color-theme-border)' }}>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: 'var(--color-theme-surface-alt)', color: 'var(--color-text-tertiary)' }}>
                            <User className="w-3.5 h-3.5" strokeWidth={1.75} style={{ color: 'var(--color-theme-accent-strong)' }} />
                            <span className="text-[13px]">Narrated by {topic.hadith.narrator}</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: 'var(--color-theme-surface-alt)', color: 'var(--color-text-tertiary)' }}>
                            <BookOpen className="w-3.5 h-3.5" strokeWidth={1.75} style={{ color: 'var(--color-theme-gold)' }} />
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
                  <div style={{ borderBottom: '1px solid var(--color-theme-border)' }}>
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
                    <div style={{ borderBottom: '1px solid var(--color-theme-border)' }}>
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
                                  style={{ background: 'var(--color-theme-accent-soft)' }}
                                >
                                  <Sparkles className="w-3 h-3" strokeWidth={2.5} style={{ color: 'var(--color-theme-accent-strong)' }} />
                                </span>
                                <span className="text-[14px] leading-[1.7]" style={{ color: 'var(--color-text-secondary)' }}>
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
          <p className="mx-auto max-w-md text-center text-[11px] leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            General guidance only. For rulings specific to your situation, please
            consult a qualified scholar.
          </p>
        </main>
      </div>

      {/* ── Bottom Navigation Bar ── */}
      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between px-5 py-3.5 rounded-full shadow-lg" style={{ background: 'var(--color-theme-surface-card)', backdropFilter: 'blur(12px)', border: '1px solid var(--color-theme-border)' }}>
        <button
          type="button"
          onClick={onPrev}
          disabled={!onPrev}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-95 ${onPrev
            ? 'text-text-tertiary hover:bg-theme-surface-alt hover:text-text-primary'
            : 'text-text-muted/50 cursor-not-allowed'
            }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-center px-2" style={{ color: 'var(--color-text-tertiary)' }}>
          {currentIndex + 1} of {totalCount}
        </span>

        <button
          type="button"
          onClick={onNext}
          disabled={!onNext}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-95 ${onNext
            ? 'text-text-tertiary hover:bg-theme-surface-alt hover:text-text-primary'
            : 'text-text-muted/50 cursor-not-allowed'
            }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

