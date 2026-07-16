export type AppTheme = 'serenity' | 'bloom' | 'meadow';
export type AppLanguage = 'en' | 'ur';

/** Affects Asr calculation: Hanafi uses later Asr; others use standard (earlier) Asr. */
export type Madhab = 'hanafi' | 'shafi' | 'maliki' | 'hanbali';

export type CalculationMethodId =
  | 'karachi'
  | 'muslimWorldLeague'
  | 'ummAlQura'
  | 'moonsightingCommittee'
  | 'egyptian'
  | 'dubai'
  | 'singapore';

export type UserProfile = {
  name: string;
  spiritualGoal: string;
  madhab: Madhab;
  calculationMethod: CalculationMethodId;
  prayerReminders: boolean;
  theme: AppTheme;
  language: AppLanguage;
};

export type SettingsScreenId =
  | 'preferences'
  | 'period'
  | 'theme'
  | 'language'
  | 'downloads'
  | null;
