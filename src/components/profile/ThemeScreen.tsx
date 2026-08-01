import React from 'react';
import { Check, Sparkles } from 'lucide-react';
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
  colors: [string, string, string];
  isNew?: boolean;
  isDark?: boolean;
}> = [
    {
      id: 'oled-vibrant',
      name: 'Dark OLED',
      description: 'Pure black + vibrant accents — premium feel',
      colors: ['#000000', '#111111', '#10B981'],
      isNew: true,
      isDark: true,
    },
    {
      id: 'serenity',
      name: 'Serenity',
      description: 'Warm beige — calm and bright',
      colors: ['#FFFFFF', '#F2F3F5', '#2B8A6E'],
    },
    {
      id: 'bloom',
      name: 'Bloom',
      description: 'Soft pink tint — gentle warmth',
      colors: ['#FFFBFB', '#F5EAEB', '#C4506A'],
    },
    {
      id: 'meadow',
      name: 'Meadow',
      description: 'Fresh mint accent — peaceful focus',
      colors: ['#FBFEFC', '#E8F2EB', '#1A8A80'],
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
              className={`w-full text-left rounded-[24px] p-4 border transition-all duration-300 active:scale-[0.98] flex items-center gap-4 ${selected
                  ? 'bg-theme-surface-card shadow-[var(--nisa-shadow-card)] border-theme-accent/20 ring-2 ring-theme-accent/10'
                  : 'bg-theme-surface-card/60 border-theme-border'
                }`}
            >
              {/* Color preview swatch */}
              <div className="relative w-14 h-14 rounded-[18px] overflow-hidden border-2 border-theme-border flex-shrink-0">
                <div className="absolute inset-0 flex">
                  <div className="flex-1" style={{ backgroundColor: theme.colors[0] }} />
                  <div className="flex-1" style={{ backgroundColor: theme.colors[1] }} />
                </div>
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 translate-y-1"
                  style={{
                    backgroundColor: theme.colors[2],
                    borderColor: theme.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.8)',
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[15px] font-bold text-text-primary">{theme.name}</p>
                  {theme.isNew && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-theme-accent/15 text-theme-accent px-2 py-0.5 rounded-full">
                      <Sparkles className="w-2.5 h-2.5" />
                      New
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-text-tertiary mt-0.5">{theme.description}</p>
              </div>

              {selected && (
                <div className="w-8 h-8 rounded-full bg-theme-accent flex items-center justify-center flex-shrink-0">
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
