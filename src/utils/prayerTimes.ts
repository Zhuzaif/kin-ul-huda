import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from 'adhan';
import type { CalculationMethodId, Madhab as ProfileMadhab } from '../types/profile';

export type PrayerScheduleItem = {
  name: string;
  time: string;
  dateObj: Date;
};

const MECCA = { lat: 21.4225, lng: 39.8262 };

let cachedCoords: { lat: number; lng: number } | null = null;

export function setCachedCoords(coords: { lat: number; lng: number }) {
  cachedCoords = coords;
}

export const MADHAB_OPTIONS: Array<{
  id: ProfileMadhab;
  label: string;
  shortLabel: string;
  asrRule: string;
  description: string;
}> = [
  {
    id: 'hanafi',
    label: 'Hanafi',
    shortLabel: 'Hanafi',
    asrRule: 'Later Asr (shadow = 2×)',
    description: 'Asr begins when shadow length equals twice the object height.',
  },
  {
    id: 'shafi',
    label: "Shafi'i",
    shortLabel: "Shafi'i",
    asrRule: 'Standard Asr (shadow = 1×)',
    description: 'Asr begins when shadow equals object height — same rule as Maliki & Hanbali.',
  },
  {
    id: 'maliki',
    label: 'Maliki',
    shortLabel: 'Maliki',
    asrRule: 'Standard Asr (shadow = 1×)',
    description: 'Earlier Asr time, aligned with Shafi\'i and Hanbali calculation.',
  },
  {
    id: 'hanbali',
    label: 'Hanbali',
    shortLabel: 'Hanbali',
    asrRule: 'Standard Asr (shadow = 1×)',
    description: 'Earlier Asr time, aligned with Shafi\'i and Maliki calculation.',
  },
];

export const CALCULATION_METHOD_OPTIONS: Array<{
  id: CalculationMethodId;
  label: string;
  region: string;
}> = [
  { id: 'karachi', label: 'Karachi', region: 'Pakistan, India, South Asia' },
  { id: 'muslimWorldLeague', label: 'Muslim World League', region: 'Europe, Far East' },
  { id: 'ummAlQura', label: 'Umm al-Qura', region: 'Saudi Arabia, Gulf' },
  { id: 'moonsightingCommittee', label: 'Moonsighting Committee', region: 'UK, North America' },
  { id: 'egyptian', label: 'Egyptian', region: 'Egypt, Africa' },
  { id: 'dubai', label: 'Dubai (UAE)', region: 'United Arab Emirates' },
  { id: 'singapore', label: 'Singapore', region: 'Malaysia, Indonesia' },
];

export function getMadhabLabel(madhab: ProfileMadhab): string {
  return MADHAB_OPTIONS.find((m) => m.id === madhab)?.shortLabel ?? madhab;
}

export function mapMadhabToAdhan(madhab: ProfileMadhab): (typeof Madhab)[keyof typeof Madhab] {
  return madhab === 'hanafi' ? Madhab.Hanafi : Madhab.Shafi;
}

function buildCalculationParams(methodId: CalculationMethodId) {
  const builders: Record<CalculationMethodId, () => ReturnType<typeof CalculationMethod.Karachi>> = {
    karachi: () => CalculationMethod.Karachi(),
    muslimWorldLeague: () => CalculationMethod.MuslimWorldLeague(),
    ummAlQura: () => CalculationMethod.UmmAlQura(),
    moonsightingCommittee: () => CalculationMethod.MoonsightingCommittee(),
    egyptian: () => CalculationMethod.Egyptian(),
    dubai: () => CalculationMethod.Dubai(),
    singapore: () => CalculationMethod.Singapore(),
  };
  const params = builders[methodId]();
  return params;
}

export function formatPrayerTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export function computePrayerSchedule(
  lat: number,
  lng: number,
  madhab: ProfileMadhab,
  methodId: CalculationMethodId,
  date = new Date()
): PrayerScheduleItem[] {
  const coordinates = new Coordinates(lat, lng);
  const params = buildCalculationParams(methodId);
  params.madhab = mapMadhabToAdhan(madhab);

  const pt = new PrayerTimes(coordinates, date, params);

  return [
    { name: 'Fajr', dateObj: pt.fajr, time: formatPrayerTime(pt.fajr) },
    { name: 'Dhuhr', dateObj: pt.dhuhr, time: formatPrayerTime(pt.dhuhr) },
    { name: 'Asr', dateObj: pt.asr, time: formatPrayerTime(pt.asr) },
    { name: 'Maghrib', dateObj: pt.maghrib, time: formatPrayerTime(pt.maghrib) },
    { name: 'Isha', dateObj: pt.isha, time: formatPrayerTime(pt.isha) },
  ];
}

export async function resolvePrayerCoordinates(): Promise<{ lat: number; lng: number }> {
  if (cachedCoords) return cachedCoords;

  // Check if user saved coords during onboarding
  try {
    const raw = window.localStorage.getItem('nisa.user.profile');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.locationCoords && typeof parsed.locationCoords.lat === 'number') {
        cachedCoords = parsed.locationCoords;
        return cachedCoords;
      }
    }
  } catch { /* ignore */ }

  try {
    const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
    if (res.ok) {
      const data = await res.json();
      const lat = parseFloat(data.latitude);
      const lng = parseFloat(data.longitude);
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
        cachedCoords = { lat, lng };
        return cachedCoords;
      }
    }
  } catch {
    /* fallback below */
  }

  cachedCoords = MECCA;
  return cachedCoords;
}


export function getCalculationMethodLabel(id: CalculationMethodId): string {
  return CALCULATION_METHOD_OPTIONS.find((m) => m.id === id)?.label ?? id;
}
