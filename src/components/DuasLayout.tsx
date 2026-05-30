import React from 'react';
import DuasHeader from './DuasHeader';
import DuaHighlightCard from './DuaHighlightCard';
import DuaCategories from './DuaCategories';
import DuaList from './DuaList';
import TasbeehFAB from './TasbeehFAB';

export default function DuasLayout() {
  return (
    <div className="flex w-full flex-col h-full animate-in fade-in duration-300 relative">
      <div className="flex-1 overflow-y-auto scroll-smooth hide-scrollbar relative">
        <DuasHeader />
        <DuaHighlightCard />
        <DuaCategories />
        <DuaList />
      </div>
      <TasbeehFAB />
    </div>
  );
}
