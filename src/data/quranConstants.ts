export type ReciterOption = {
  id: string;
  label: string;
};

export const RECITER_OPTIONS: ReciterOption[] = [
  { id: 'mishary', label: 'Mishary' },
  { id: 'abdul-basit', label: 'Abdul Basit' },
  { id: 'maher', label: 'Maher' },
  { id: 'yasser', label: 'Yasser' },
  { id: 'shuraim', label: 'Shuraim' },
];

export type Chapter = {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: 'meccan' | 'medinan';
  total_verses: number;
};

export type Verse = {
  chapter: number;
  verse: number;
  text: string;
};

export type QuranMap = Record<string, Verse[]>;
