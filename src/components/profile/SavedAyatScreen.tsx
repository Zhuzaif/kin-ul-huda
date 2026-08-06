import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { listVariants, listItemVariants } from '../../lib/motion';
import ProfileSubScreen from './ProfileSubScreen';
import VerseCard from '../VerseCard';
import chapters from '../../data/chapters-en.json';
import quran from '../../data/quran.json';
import translationEn from '../../data/editions-en.json';
import { Chapter, Verse, QuranMap } from '../../data/quranConstants';
import { useSavedVerses } from '../../contexts/SavedVersesContext';

const chapterList = chapters as Chapter[];
const quranByChapter = quran as QuranMap;
const translationByChapter = translationEn as QuranMap;

interface SavedAyatScreenProps {
  onBack: () => void;
}

export default function SavedAyatScreen({ onBack }: SavedAyatScreenProps) {
  const { savedVerses, handleSaveToggle } = useSavedVerses();

  const savedVerseCards = useMemo(() => {
    const results = savedVerses
      .map((saved) => {
        const verses = quranByChapter[String(saved.chapterId)] ?? [];
        const verseData = verses.find((item) => item.verse === saved.verse);
        if (!verseData) {
          return null;
        }
        const translations = translationByChapter[String(saved.chapterId)] ?? [];
        const translation = translations.find((item) => item.verse === saved.verse)?.text ?? 'Translation coming soon.';
        const chapter = chapterList.find((item) => item.id === saved.chapterId);
        return {
          chapter,
          verse: verseData,
          translation,
        };
      })
      .filter(Boolean) as Array<{ chapter?: Chapter; verse: Verse; translation: string }>;

    return results;
  }, [savedVerses]);

  return (
    <ProfileSubScreen
      title="Saved Ayat"
      subtitle="Your favorite verses from the Quran"
      onBack={onBack}
    >
      <div className="flex flex-col gap-6 pb-8 px-2">
        {savedVerseCards.length === 0 ? (
          <div className="bg-theme-surface-card border border-theme-border rounded-[22px] p-6 text-sm text-text-tertiary text-center">
            No saved verses yet. Open a Surah and tap the heart icon on any verse to save it here!
          </div>
        ) : (
          <motion.div variants={listVariants} initial="initial" animate="animate" className="flex flex-col gap-5">
            {savedVerseCards.map((item) => (
              <motion.div variants={listItemVariants} key={`${item.verse.chapter}-${item.verse.verse}`} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] text-text-tertiary px-2">
                  <span>{item.chapter?.transliteration ?? 'Surah'}</span>
                  <span>Verse {item.verse.verse}</span>
                </div>
                <VerseCard
                  verseNumber={item.verse.verse}
                  arabicText={item.verse.text}
                  translationText={item.translation}
                  isSaved
                  onSaveToggle={(isSaved) =>
                    handleSaveToggle({
                      chapterId: item.verse.chapter,
                      verse: item.verse.verse,
                      isSaved,
                    })
                  }
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </ProfileSubScreen>
  );
}
