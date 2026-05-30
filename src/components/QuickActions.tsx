import React from 'react';
import { BookOpen, CircleDashed, Sun, Library, Headphones, Heart } from 'lucide-react';
import { ActionItem } from '../types';
import { usePeriodMode } from '../contexts/PeriodModeContext';

const defaultActions: ActionItem[] = [
  {
    id: 'quran',
    label: 'Quran Reading',
    icon: BookOpen,
    bgClass: 'bg-light-peach',
    colorClass: 'text-[#D98A5B]'
  },
  {
    id: 'tasbeeh',
    label: 'Tasbeeh Counter',
    icon: CircleDashed,
    bgClass: 'bg-soft-mint',
    colorClass: 'text-[#2B604A]'
  },
  {
    id: 'adhkar',
    label: 'Morning Adhkar',
    icon: Sun,
    bgClass: 'bg-muted-gold-light',
    colorClass: 'text-muted-gold'
  },
  {
    id: 'fiqh',
    label: 'Fiqh Guide',
    icon: Library,
    bgClass: 'bg-soft-pink',
    colorClass: 'text-soft-pink-dark'
  }
];

const periodActions: ActionItem[] = [
  {
    id: 'listen-quran',
    label: 'Listen to Quran',
    icon: Headphones,
    bgClass: 'bg-light-peach',
    colorClass: 'text-[#D98A5B]'
  },
  {
    id: 'dhikr',
    label: 'Daily Dhikr',
    icon: CircleDashed,
    bgClass: 'bg-soft-pink',
    colorClass: 'text-soft-pink-dark'
  },
  {
    id: 'duas',
    label: 'Special Duas',
    icon: Heart,
    bgClass: 'bg-muted-gold-light',
    colorClass: 'text-muted-gold'
  },
  {
    id: 'fiqh',
    label: 'Fiqh Guide',
    icon: Library,
    bgClass: 'bg-gray-100',
    colorClass: 'text-gray-600'
  }
];

interface QuickActionsProps {
  onNavigate?: (tab: string) => void;
}

export default function QuickActions({ onNavigate }: QuickActionsProps) {
  const { isPeriodMode } = usePeriodMode();
  const actions = isPeriodMode ? periodActions : defaultActions;

  const handleActionClick = (id: string) => {
    if (!onNavigate) return;
    
    switch (id) {
      case 'quran':
      case 'listen-quran':
        onNavigate('quran');
        break;
      case 'tasbeeh':
      case 'dhikr':
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
      <h3 className="text-lg font-bold text-gray-800 tracking-tight mb-4 px-1">Daily Journey</h3>
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
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-sm ${action.bgClass} transition-transform group-hover:-translate-y-0.5`}
              >
                <IconInfo className={`w-6 h-6 stroke-[2.5] ${action.colorClass}`} />
              </div>
              <span className="text-[10px] font-semibold text-gray-600 text-center leading-tight w-16">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
