import type { ElementType } from 'react';

export type ActionItem = {
  id: string;
  label: string;
  icon: ElementType;
  colorClass: string;
  bgClass: string;
  svg?: string;
};

export interface Dua {
  id: number | string;
  title: string;
  arabic: string;
  translation: string;
  tags?: string[];
  repetition?: string;
  isCustom?: boolean;
}
