import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Flower2, Sparkles } from 'lucide-react';
import { useBackHandler } from '../hooks/useBackHandler';
import { BACK_PRIORITY } from '../lib/backButton';
import PurityTrackerCard from './PurityTrackerCard';
import FiqhTopicsLibrary from './FiqhTopicsLibrary';
import AskAalimaFAB from './AskAalimaFAB';
import AskAalimaScreen from './AskAalimaScreen';
import FiqhSubTopicDetail from './FiqhTopicDetail';
import HaizDetailScreen from './HaizDetailScreen';
import NifasDetailScreen from './NifasDetailScreen';
import IstihazaDetailScreen from './IstihazaDetailScreen';
import GhuslDetailScreen from './GhuslDetailScreen';
import WuduTayammumDetailScreen from './WuduTayammumDetailScreen';
import type { FiqhMainTopic, FiqhSubTopic } from '../data/fiqhTopics';

export default function NisaLayout() {
  const [showAskAalima, setShowAskAalima] = useState(false);
  const [selectedSubTopic, setSelectedSubTopic] = useState<{
    sub: FiqhSubTopic;
    parent: FiqhMainTopic;
  } | null>(null);
  const [haizParent, setHaizParent] = useState<FiqhMainTopic | null>(null);
  const [nifasParent, setNifasParent] = useState<FiqhMainTopic | null>(null);
  const [istihazaParent, setIstihazaParent] = useState<FiqhMainTopic | null>(null);
  const [ghuslParent, setGhuslParent] = useState<FiqhMainTopic | null>(null);
  const [wuduTayammumParent, setWuduTayammumParent] = useState<FiqhMainTopic | null>(null);

  // Android back closes whichever detail screen / Ask Aalima overlay is open.
  useBackHandler(showAskAalima, () => setShowAskAalima(false), BACK_PRIORITY.modal);
  useBackHandler(selectedSubTopic !== null, () => setSelectedSubTopic(null));
  useBackHandler(haizParent !== null, () => setHaizParent(null));
  useBackHandler(nifasParent !== null, () => setNifasParent(null));
  useBackHandler(istihazaParent !== null, () => setIstihazaParent(null));
  useBackHandler(ghuslParent !== null, () => setGhuslParent(null));
  useBackHandler(wuduTayammumParent !== null, () => setWuduTayammumParent(null));

  const portalTarget = document.getElementById('mobile-frame-root');

  return (
    <div className="flex w-full flex-col h-full animate-in fade-in duration-300 relative">
      <div className="flex-1 overflow-y-auto scroll-smooth hide-scrollbar relative">
        {/* ── Page Header ── */}
        <div className="px-5 pt-6 pb-4 nisa-slide-up">
          <div className="mb-4">
            <h1 className="text-[24px] font-bold text-text-primary tracking-tight leading-none">
              Al-Nisa
            </h1>
          </div>

          {/* Quranic verse */}
          <div className="bg-theme-surface-card rounded-2xl border border-theme-border px-4 py-3">
            <p
              className="font-arabic text-[16px] text-theme-gold text-right leading-[1.8]"
              dir="rtl"
            >
              وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ
            </p>
            <p className="text-[10px] text-text-muted mt-1 text-right">
              Adh-Dhariyat 51:56
            </p>
          </div>
        </div>

        {/* ── Main Content ── */}
        <PurityTrackerCard />
        <FiqhTopicsLibrary
          onSelectSubTopic={(sub, parent) =>
            setSelectedSubTopic({ sub, parent })
          }
          onOpenHaiz={(parent) => setHaizParent(parent)}
          onOpenNifas={(parent) => setNifasParent(parent)}
          onOpenIstihaza={(parent) => setIstihazaParent(parent)}
          onOpenGhusl={(parent) => setGhuslParent(parent)}
          onOpenWuduTayammum={(parent) => setWuduTayammumParent(parent)}
        />
      </div>

      {!showAskAalima && <AskAalimaFAB onOpen={() => setShowAskAalima(true)} />}

      {/* Overlay screens rendered via portal to prevent infinite scroll bugs */}
      {portalTarget && createPortal(
        <>
          {showAskAalima && <AskAalimaScreen onBack={() => setShowAskAalima(false)} />}
          
          {selectedSubTopic && (
            <FiqhSubTopicDetail
              subTopic={selectedSubTopic.sub}
              parentTopic={selectedSubTopic.parent}
              onBack={() => setSelectedSubTopic(null)}
            />
          )}

          {haizParent && (
            <HaizDetailScreen
              onBack={() => setHaizParent(null)}
            />
          )}

          {nifasParent && (
            <NifasDetailScreen
              onBack={() => setNifasParent(null)}
            />
          )}

          {istihazaParent && (
            <IstihazaDetailScreen
              onBack={() => setIstihazaParent(null)}
            />
          )}

          {ghuslParent && (
            <GhuslDetailScreen
              onBack={() => setGhuslParent(null)}
            />
          )}

          {wuduTayammumParent && (
            <WuduTayammumDetailScreen
              onBack={() => setWuduTayammumParent(null)}
            />
          )}
        </>,
        portalTarget
      )}
    </div>
  );
}
