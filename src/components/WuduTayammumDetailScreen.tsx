import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { wuduTayammumTopics } from '../data/wuduTayammumTopics';
import TopicDetailView from './shared/TopicDetailView';

interface WuduTayammumDetailScreenProps {
  onBack: () => void;
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
  onBack,
}: WuduTayammumDetailScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (selectedIndex !== null) {
    const topic = wuduTayammumTopics[selectedIndex];
    return (
      <TopicDetailView
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
      background: var(--color-theme-border);
    }
  `;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-hidden animate-in fade-in duration-300 bg-theme-surface"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        touchAction: 'none',
      }}
    >
      <style>{trackStyles}</style>

      <main className="w-full h-full flex flex-col bg-theme-surface-card relative overflow-hidden">
        {/* Floating Arabic Header Block */}
        <header className="bg-theme-surface-card border-b border-theme-border px-4 py-4 mb-2 relative z-20 flex flex-col items-center justify-center">
          {/* Back button positioned absolutely on the left */}
          <button
            type="button"
            onClick={onBack}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-theme-surface-alt hover:bg-theme-surface-input active:scale-95 transition-all"
            aria-label="Go back"
          >
            <ChevronLeft className="w-4 h-4 text-text-secondary" />
          </button>
          <h1 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight text-center leading-tight font-arabic">
            فَاغْسِلُواْ وُجُوهَكُمْ وَأَيْدِيَكُمْ
          </h1>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-theme-accent" />
            <span className="text-[10px] font-bold tracking-[0.15em] text-theme-accent uppercase">
              Taharah &amp; Wudu &amp; Tayammum
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-theme-accent" />
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
                  style={{ width: '60px', backgroundColor: 'var(--color-theme-surface-input)' }}
                >
                  <span
                    className="font-numbers-sg text-xl font-bold"
                    style={{ color: cardMeta.color }}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex-1 px-4 flex flex-col justify-center bg-theme-surface-card min-w-0">
                  <h3 className="text-[13px] font-bold text-text-primary leading-tight truncate">
                    {topic.title}
                  </h3>
                  <p className="text-[10px] text-text-muted font-medium mt-0.5 truncate">
                    {cardMeta.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="mt-4 text-center z-20">
          <p className="text-[9px] text-text-muted font-semibold tracking-wide">
            CONSULT A SCHOLAR FOR PERSONAL RULINGS
          </p>
        </footer>
      </main>
    </div>
  );
}
