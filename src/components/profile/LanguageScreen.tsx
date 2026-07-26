import React from 'react';
import { Check } from 'lucide-react';
import ProfileSubScreen from './ProfileSubScreen';
import { useProfile } from '../../contexts/ProfileContext';
import type { AppLanguage } from '../../types/profile';

interface LanguageScreenProps {
  onBack: () => void;
}

const LANGUAGES: Array<{
  id: AppLanguage;
  label: string;
  native: string;
  sample: string;
}> = [
  {
    id: 'en',
    label: 'English',
    native: 'English',
    sample: 'Assalamu Alaikum — your companion in English.',
  },
  {
    id: 'ur',
    label: 'Urdu',
    native: 'اردو',
    sample: 'السلام علیکم — آپ کا ساتھی اردو میں۔',
  },
  {
    id: 'ar',
    label: 'Arabic',
    native: 'العربية',
    sample: 'السلام عليكم — رفيقك باللغة العربية.',
  },
];

export default function LanguageScreen({ onBack }: LanguageScreenProps) {
  const { profile, updateProfile } = useProfile();

  return (
    <ProfileSubScreen title="Language" subtitle="Interface language preference" onBack={onBack}>
      <p className="text-[13px] text-gray-500 leading-relaxed mb-5">
        Quran text remains in Arabic. This setting updates greetings and profile labels. Full Urdu
        translation of the app is coming soon.
      </p>
      <div className="flex flex-col gap-3">
        {LANGUAGES.map((lang) => {
          const selected = profile.language === lang.id;
          const isComingSoon = lang.id === 'ur' || lang.id === 'ar';
          
          return (
            <button
              key={lang.id}
              type="button"
              disabled={isComingSoon}
              onClick={() => updateProfile({ language: lang.id })}
              className={`w-full text-left rounded-[24px] p-4 border transition-all ${
                isComingSoon ? 'opacity-60 cursor-not-allowed' : 'active:scale-[0.98]'
              } ${
                selected
                  ? 'bg-white shadow-md border-muted-gold/30 ring-2 ring-muted-gold/20'
                  : 'bg-white/60 border-white/70'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[15px] font-bold text-gray-800">{lang.label}</p>
                    {isComingSoon && (
                      <span className="text-[9px] font-bold uppercase tracking-wide bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] font-arabic text-muted-gold">{lang.native}</p>
                </div>
                {selected && (
                  <div className="w-8 h-8 rounded-full bg-muted-gold flex items-center justify-center">
                    <Check className="w-4 h-4 text-white stroke-[3]" />
                  </div>
                )}
              </div>
              <p className="text-[12px] text-gray-500 leading-relaxed">{lang.sample}</p>
            </button>
          );
        })}
      </div>
    </ProfileSubScreen>
  );
}
