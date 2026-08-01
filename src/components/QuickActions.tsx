import React from 'react';
import { BookOpen, CircleDashed, Sun, Library, Headphones, Heart } from 'lucide-react';
import { ActionItem } from '../types';
import { usePeriodMode } from '../contexts/PeriodModeContext';

const defaultActions: ActionItem[] = [
  {
    id: 'quran',
    label: 'Quran Reading',
    icon: BookOpen,
    svg: '/icons/default/quran.svg',
    bgClass: 'bg-theme-orange/15',
    colorClass: 'text-theme-orange'
  },
  {
    id: 'tasbeeh',
    label: 'Tasbeeh Counter',
    icon: CircleDashed,
    svg: '/icons/period/2.svg',
    bgClass: 'bg-theme-accent/15',
    colorClass: 'text-theme-accent'
  },
  {
    id: 'adhkar',
    label: 'Morning Adhkar',
    icon: Sun,
    svg: '/icons/default/adhkar.svg',
    bgClass: 'bg-theme-gold/15',
    colorClass: 'text-theme-gold'
  },
  {
    id: 'fiqh',
    label: 'Fiqh Guide',
    icon: Library,
    svg: '/icons/period/5.svg',
    bgClass: 'bg-theme-rose/15',
    colorClass: 'text-theme-rose'
  }
];

const periodActions: ActionItem[] = [
  {
    id: 'listen-quran',
    label: 'Listen to Quran',
    icon: Headphones,
    svg: '/icons/period/1.svg',
    bgClass: 'bg-theme-orange/15',
    colorClass: 'text-theme-orange'
  },
  {
    id: 'dhikr',
    label: 'Daily Dhikr',
    icon: CircleDashed,
    svg: '/icons/period/3.svg',
    bgClass: 'bg-theme-rose/15',
    colorClass: 'text-theme-rose'
  },
  {
    id: 'duas',
    label: 'Special Duas',
    icon: Heart,
    svg: '/icons/period/2.svg',
    bgClass: 'bg-theme-gold/15',
    colorClass: 'text-theme-gold'
  },
  {
    id: 'fiqh',
    label: 'Fiqh Guide',
    icon: Library,
    svg: '/icons/period/5.svg',
    bgClass: 'bg-theme-surface-dark',
    colorClass: 'text-text-tertiary'
  }
];

interface QuickActionsProps {
  onNavigate?: (tab: string) => void;
  onOpenTasbeeh?: () => void;
}

export default function QuickActions({ onNavigate, onOpenTasbeeh }: QuickActionsProps) {
  const { isPeriodMode } = usePeriodMode();
  const actions = isPeriodMode ? periodActions : defaultActions;

  const handleActionClick = (id: string) => {
    if (id === 'tasbeeh' || id === 'dhikr') {
      onOpenTasbeeh?.();
      return;
    }

    if (!onNavigate) return;

    switch (id) {
      case 'quran':
      case 'listen-quran':
        onNavigate('quran');
        break;
      case 'duas':
      case 'adhkar':
        onNavigate('duas');
        break;
      case 'fiqh':
        onNavigate('nisa');
        break;
      default:
        break;
    }
  };

  return (
    <div className="px-6 mb-28">
      <h3 className="text-lg font-bold text-text-primary tracking-tight mb-4 px-1">Daily Journey</h3>
      <div className="grid grid-cols-4 gap-4 animate-in fade-in duration-300">
        {actions.map((action) => {
          const IconInfo = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action.id)}
              className="flex flex-col items-center gap-3 group active:scale-95 transition-transform"
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-sm ${action.bgClass} transition-transform group-hover:-translate-y-0.5 overflow-hidden p-3`}
              >
                {action.svg ? (
                  <img
                    src={action.svg}
                    alt={action.label}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                ) : (
                  <IconInfo className={`w-6 h-6 stroke-[2.5] ${action.colorClass}`} />
                )}
              </div>
              <span className="text-[10px] font-semibold text-text-tertiary text-center leading-tight w-16">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
