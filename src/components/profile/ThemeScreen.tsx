import React from 'react';
import { Check } from 'lucide-react';
import ProfileSubScreen from './ProfileSubScreen';
import { useProfile } from '../../contexts/ProfileContext';
import type { AppTheme } from '../../types/profile';

interface ThemeScreenProps {
  onBack: () => void;
}

const THEMES: Array<{
  id: AppTheme;
  name: string;
  description: string;
  preview: string;
}> = [
  {
    id: 'serenity',
    name: 'Serenity',
    description: 'Warm beige — calm and bright',
    preview: 'bg-[#FAF8F5] border-warm-beige-dark',
  },
  {
    id: 'bloom',
    name: 'Bloom',
    description: 'Soft pink tint — gentle warmth',
    preview: 'bg-[#FCF5F5] border-soft-pink-dark/30',
  },
  {
    id: 'meadow',
    name: 'Meadow',
    description: 'Fresh mint accent — peaceful focus',
    preview: 'bg-[#F5FAF7] border-soft-mint-dark',
  },
];

export default function ThemeScreen({ onBack }: ThemeScreenProps) {
  const { profile, updateProfile } = useProfile();

  return (
    <ProfileSubScreen title="Theme" subtitle="Choose your app atmosphere" onBack={onBack}>
      <div className="flex flex-col gap-3">
        {THEMES.map((theme) => {
          const selected = profile.theme === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => updateProfile({ theme: theme.id })}
              className={`w-full text-left rounded-[24px] p-4 border transition-all active:scale-[0.98] flex items-center gap-4 ${
                selected
                  ? 'bg-white shadow-md border-[#2B604A]/15 ring-2 ring-[#2B604A]/10'
                  : 'bg-white/60 border-white/70'
              }`}
            >
              <div className={`w-14 h-14 rounded-[18px] border-2 ${theme.preview}`} />
              <div className="flex-1">
                <p className="text-[15px] font-bold text-gray-800">{theme.name}</p>
                <p className="text-[12px] text-gray-500 mt-0.5">{theme.description}</p>
              </div>
              {selected && (
                <div className="w-8 h-8 rounded-full bg-[#2B604A] flex items-center justify-center">
                  <Check className="w-4 h-4 text-white stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </ProfileSubScreen>
  );
}
