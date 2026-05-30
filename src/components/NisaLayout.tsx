import React from 'react';
import NisaHeader from './NisaHeader';
import PurityTrackerCard from './PurityTrackerCard';
import FiqhLearningPath from './FiqhLearningPath';
import AskAalimaFAB from './AskAalimaFAB';

export default function NisaLayout() {
  return (
    <div className="flex w-full flex-col h-full animate-in fade-in duration-300 relative">
      <div className="flex-1 overflow-y-auto scroll-smooth hide-scrollbar relative">
        <NisaHeader />
        <PurityTrackerCard />
        <FiqhLearningPath />
      </div>
      <AskAalimaFAB />
    </div>
  );
}
