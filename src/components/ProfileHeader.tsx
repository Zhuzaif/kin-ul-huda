import React from 'react';
import { Sparkles, User } from 'lucide-react';
import { useProfile } from '../contexts/ProfileContext';

interface ProfileHeaderProps {
  onOpenPreferences?: () => void;
}

export default function ProfileHeader({ onOpenPreferences }: ProfileHeaderProps) {
  const { profile } = useProfile();

  const greeting =
    profile.language === 'ur'
      ? `السلام علیکم${profile.name ? `، ${profile.name}` : ''}`
      : `Assalamu Alaikum${profile.name ? `, ${profile.name}` : ''}`;

  const subtitle =
    profile.language === 'ur'
      ? 'آپ کا دن سکون و نور سے بھرا ہو۔'
      : 'May your day be filled with peace & light.';

  return (
    <div className="flex items-center justify-between pt-3 pb-4 px-6">
      <div className="flex items-center gap-3.5">
        {/* Avatar with gradient border */}
        <div
          onClick={onOpenPreferences}
          className="relative cursor-pointer group"
        >
          <div
            className="w-14 h-14 rounded-2xl p-[2px] shadow-sm transition-transform group-hover:scale-105"
            style={{ background: 'linear-gradient(135deg, var(--nisa-accent), var(--nisa-orange))' }}
          >
            <div className="w-full h-full rounded-[14px] bg-theme-surface-card flex items-center justify-center font-bold text-xl text-theme-accent">
              {profile.name ? (
                profile.name.charAt(0).toUpperCase()
              ) : (
                <User className="w-6 h-6" />
              )}
            </div>
          </div>
          {/* Sparkle badge */}
          <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-theme-accent text-white text-[10px] shadow-sm">
            <Sparkles className="w-2.5 h-2.5" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h1
            className={`text-lg font-bold text-text-primary tracking-tight leading-tight ${
              profile.language === 'ur' ? 'font-arabic' : ''
            }`}
            dir={profile.language === 'ur' ? 'rtl' : 'ltr'}
          >
            {greeting}
          </h1>
          <p
            className={`text-[12px] font-medium text-text-tertiary mt-0.5 leading-relaxed ${
              profile.language === 'ur' ? 'font-arabic text-right' : ''
            }`}
            dir={profile.language === 'ur' ? 'rtl' : 'ltr'}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
