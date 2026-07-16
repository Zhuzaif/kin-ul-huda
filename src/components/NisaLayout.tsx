import React, { useState } from 'react';
import PurityTrackerCard from './PurityTrackerCard';
import FiqhTopicsLibrary from './FiqhTopicsLibrary';
import AskAalimaFAB from './AskAalimaFAB';
import AskAalimaScreen from './AskAalimaScreen';

export default function NisaLayout() {
  const [showAskAalima, setShowAskAalima] = useState(false);

  return (
    <div className="flex w-full flex-col h-full animate-in fade-in duration-300 relative">
      <div className="flex-1 overflow-y-auto scroll-smooth hide-scrollbar relative pt-6">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-soft-pink/30 to-transparent pointer-events-none -z-10" />

        <PurityTrackerCard />
        <FiqhTopicsLibrary />
      </div>

      {!showAskAalima && <AskAalimaFAB onOpen={() => setShowAskAalima(true)} />}

      {showAskAalima && <AskAalimaScreen onBack={() => setShowAskAalima(false)} />}
    </div>
  );
}
