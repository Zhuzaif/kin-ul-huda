import React, { useState } from 'react';
import { useBackHandler } from '../hooks/useBackHandler';
import { BACK_PRIORITY } from '../lib/backButton';
import DuasHeader from './DuasHeader';
import DuaHighlightCard from './DuaHighlightCard';
import DuaCategories from './DuaCategories';
import DuaList from './DuaList';
import DuaDetailScreen from './DuaDetailScreen';
import CreateDuaModal from './CreateDuaModal';
import { Dua } from '../types';

export default function DuasLayout() {
  const [selectedDua, setSelectedDua] = useState<Dua | null>(null);
  const [activeTab, setActiveTab] = useState('All Duas');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [currentDuaList, setCurrentDuaList] = useState<Dua[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Android back closes the open dua detail / create modal first.
  useBackHandler(selectedDua !== null, () => setSelectedDua(null));
  useBackHandler(
    isCreateModalOpen,
    () => setIsCreateModalOpen(false),
    BACK_PRIORITY.modal
  );

  const handleSelectDua = (dua: Dua, index: number, duaList: Dua[]) => {
    setSelectedDua(dua);
    setCurrentIndex(index);
    setCurrentDuaList(duaList);
  };

  const handleNextDua = () => {
    if (currentDuaList.length > 0) {
      const nextIndex = (currentIndex + 1) % currentDuaList.length;
      setCurrentIndex(nextIndex);
      setSelectedDua(currentDuaList[nextIndex]);
    }
  };

  const handlePrevDua = () => {
    if (currentDuaList.length > 0) {
      const prevIndex = (currentIndex - 1 + currentDuaList.length) % currentDuaList.length;
      setCurrentIndex(prevIndex);
      setSelectedDua(currentDuaList[prevIndex]);
    }
  };

  const handleSaveCustomDua = (dua: Dua) => {
    try {
      const existing = JSON.parse(localStorage.getItem('customDuas') || '[]');
      const updated = [dua, ...existing];
      localStorage.setItem('customDuas', JSON.stringify(updated));
      setRefreshTrigger(prev => prev + 1);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCustomDua = (duaId: Dua['id']) => {
    try {
      const existing = JSON.parse(localStorage.getItem('customDuas') || '[]');
      const updated = existing.filter((dua: Dua) => dua.id !== duaId);
      localStorage.setItem('customDuas', JSON.stringify(updated));
      setRefreshTrigger(prev => prev + 1);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex w-full flex-col h-full animate-in fade-in duration-300 relative">
      <div className="flex-1 overflow-y-auto scroll-smooth hide-scrollbar relative">
        <DuasHeader activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 'My Prayers' && (
          <DuaHighlightCard onAddDua={() => setIsCreateModalOpen(true)} />
        )}
        <DuaCategories activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        <DuaList 
          onSelectDua={handleSelectDua} 
          onDeleteDua={handleDeleteCustomDua}
          activeTab={activeTab} 
          activeCategory={activeCategory} 
          refreshTrigger={refreshTrigger}
        />
      </div>

      {selectedDua && (
        <DuaDetailScreen 
          dua={selectedDua} 
          onBack={() => setSelectedDua(null)} 
          onNext={handleNextDua}
          onPrev={handlePrevDua}
        />
      )}

      <CreateDuaModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveCustomDua}
      />
    </div>
  );
}
