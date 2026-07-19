import React, { useState } from 'react';
import PurityTrackerCard from './PurityTrackerCard';
import FiqhTopicsLibrary from './FiqhTopicsLibrary';
import AskAalimaFAB from './AskAalimaFAB';
import AskAalimaScreen from './AskAalimaScreen';
import FiqhSubTopicDetail from './FiqhTopicDetail';
import HaizDetailScreen from './HaizDetailScreen';
import type { FiqhMainTopic, FiqhSubTopic } from '../data/fiqhTopics';

export default function NisaLayout() {
  const [showAskAalima, setShowAskAalima] = useState(false);
  const [selectedSubTopic, setSelectedSubTopic] = useState<{
    sub: FiqhSubTopic;
    parent: FiqhMainTopic;
  } | null>(null);
  const [haizParent, setHaizParent] = useState<FiqhMainTopic | null>(null);

  return (
    <div className="flex w-full flex-col h-full animate-in fade-in duration-300 relative">
      <div className="flex-1 overflow-y-auto scroll-smooth hide-scrollbar relative pt-6">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-soft-pink/30 to-transparent pointer-events-none -z-10" />

        <PurityTrackerCard />
        <FiqhTopicsLibrary
          onSelectSubTopic={(sub, parent) =>
            setSelectedSubTopic({ sub, parent })
          }
          onOpenHaiz={(parent) => setHaizParent(parent)}
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
    </div>
  );
}
