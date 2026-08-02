import type { UserProfile } from '../types/profile';

export const PROFILE_STORAGE_KEY = 'nisa.user.profile';

export const DEFAULT_PROFILE: UserProfile = {
  userId: null,
  name: '',
  spiritualGoal: '',
  madhab: 'hanafi',
  calculationMethod: 'karachi',
  prayerReminders: true,
  theme: 'black-gold',
  language: 'en',
  onboardingCompleted: false,
  locationCoords: null,
  notificationPrefs: { adhan: true, reminders: true },
};

const VALID_MADHABS = new Set(['hanafi', 'shafi', 'maliki', 'hanbali']);
const VALID_METHODS = new Set([
  'karachi',
  'muslimWorldLeague',
  'ummAlQura',
  'moonsightingCommittee',
  'egyptian',
  'dubai',
  'singapore',
]);

function normalizeProfile(parsed: Partial<UserProfile>): UserProfile {
  const madhab =
    parsed.madhab && VALID_MADHABS.has(parsed.madhab) ? parsed.madhab : DEFAULT_PROFILE.madhab;
  const calculationMethod =
    parsed.calculationMethod && VALID_METHODS.has(parsed.calculationMethod)
      ? parsed.calculationMethod
      : DEFAULT_PROFILE.calculationMethod;

  return { ...DEFAULT_PROFILE, ...parsed, madhab, calculationMethod };
}

export function loadProfile(): UserProfile {
  if (typeof window === 'undefined') return { ...DEFAULT_PROFILE };

  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) {
      const defaults = { ...DEFAULT_PROFILE };
      saveProfile(defaults);
      return defaults;
    }
    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    return normalizeProfile(parsed);
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function getThemeLabel(theme: UserProfile['theme']): string {
  const labels: Record<string, string> = {
    serenity: 'Serenity (Warm & Bright)',
    bloom: 'Bloom (Soft Pink)',
    meadow: 'Meadow (Fresh Mint)',
    'oled-vibrant': 'Dark OLED (Vibrant)',
    'black-gold': 'Black & Gold Elegance',
  };
  return labels[theme] ?? theme;
}

export function getLanguageLabel(lang: UserProfile['language']): string {
  if (lang === 'ur') return 'اردو / Urdu';
  if (lang === 'ar') return 'العربية / Arabic';
  return 'English';
}
