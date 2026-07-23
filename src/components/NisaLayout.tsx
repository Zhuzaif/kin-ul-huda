import React, { useState } from 'react';
import { Flower2, Sparkles } from 'lucide-react';
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

  return (
    <div className="flex w-full flex-col h-full animate-in fade-in duration-300 relative">
      <div className="flex-1 overflow-y-auto scroll-smooth hide-scrollbar relative">
        {/* ── Page Header ── */}
        <div className="px-5 pt-6 pb-4 nisa-slide-up">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3 h-3 text-[#D98A5B]" />
                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#D98A5B]">
                  Purity & Fiqh
                </span>
              </div>
              <h1 className="text-[24px] font-bold text-gray-800 tracking-tight leading-none">
                Al-Nisa
              </h1>
              <p className="text-[12px] font-medium text-gray-400 mt-1">
                Women's fiqh, cycle tracking & guided learning
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-[#FDF5F0] flex items-center justify-center">
              <Flower2 className="w-5 h-5 text-[#D98A5B]" />
            </div>
          </div>

          {/* Quranic verse */}
          <div className="bg-white rounded-2xl border border-gray-100 px-4 py-3">
            <p
              className="font-arabic text-[16px] text-[#C9A66B] text-right leading-[1.8]"
              dir="rtl"
            >
              وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ
            </p>
            <p className="text-[10px] text-gray-400 mt-1 text-right">
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

      {showAskAalima && <AskAalimaScreen onBack={() => setShowAskAalima(false)} />}

      {/* Overlay screens rendered OUTSIDE the scrollable container */}
      {selectedSubTopic && (
        <FiqhSubTopicDetail
          subTopic={selectedSubTopic.sub}
          parentTopic={selectedSubTopic.parent}
          onBack={() => setSelectedSubTopic(null)}
        />
      )}

      {haizParent && (
        <HaizDetailScreen
          parentTopic={haizParent}
          onBack={() => setHaizParent(null)}
        />
      )}

      {nifasParent && (
        <NifasDetailScreen
          parentTopic={nifasParent}
          onBack={() => setNifasParent(null)}
        />
      )}

      {istihazaParent && (
        <IstihazaDetailScreen
          parentTopic={istihazaParent}
          onBack={() => setIstihazaParent(null)}
        />
      )}

      {ghuslParent && (
        <GhuslDetailScreen
          parentTopic={ghuslParent}
          onBack={() => setGhuslParent(null)}
        />
      )}

      {wuduTayammumParent && (
        <WuduTayammumDetailScreen
          parentTopic={wuduTayammumParent}
          onBack={() => setWuduTayammumParent(null)}
        />
      )}
    </div>
  );
}
