import React, { createContext, useContext, useState, useEffect } from 'react';

export type SavedVerse = {
  chapterId: number;
  verse: number;
};

interface SavedVersesContextType {
  savedVerses: SavedVerse[];
  handleSaveToggle: (data: { chapterId: number; verse: number; isSaved: boolean }) => void;
}

const SavedVersesContext = createContext<SavedVersesContextType | undefined>(undefined);
const SAVED_VERSES_KEY = 'nisa.quran.savedVerses';

export const SavedVersesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedVerses, setSavedVerses] = useState<SavedVerse[]>(() => {
    if (typeof window !== 'undefined') {
      const savedRaw = window.localStorage.getItem(SAVED_VERSES_KEY);
      if (savedRaw) {
        try {
          const parsed = JSON.parse(savedRaw) as SavedVerse[];
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {
          console.error('Failed to parse saved verses', e);
        }
      }
    }
    return [];
  });

  useEffect(() => {
    window.localStorage.setItem(SAVED_VERSES_KEY, JSON.stringify(savedVerses));
  }, [savedVerses]);

  const handleSaveToggle = (data: { chapterId: number; verse: number; isSaved: boolean }) => {
    setSavedVerses((prev) => {
      const exists = prev.some(
        (item) => item.chapterId === data.chapterId && item.verse === data.verse
      );
      if (data.isSaved && !exists) {
        return [...prev, { chapterId: data.chapterId, verse: data.verse }];
      }
      if (!data.isSaved && exists) {
        return prev.filter(
          (item) => !(item.chapterId === data.chapterId && item.verse === data.verse)
        );
      }
      return prev;
    });
  };

  return (
    <SavedVersesContext.Provider value={{ savedVerses, handleSaveToggle }}>
      {children}
    </SavedVersesContext.Provider>
  );
};

export const useSavedVerses = () => {
  const context = useContext(SavedVersesContext);
  if (context === undefined) {
    throw new Error('useSavedVerses must be used within a SavedVersesProvider');
  }
  return context;
};
