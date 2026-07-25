import type { PuritySettings, PuritySnapshot, PurityStatus, PurityStore } from '../types/purity';

export const PURITY_STORAGE_KEY = 'nisa.purity.tracker';

export const DEFAULT_SETTINGS: PuritySettings = {
  cycleLengthDays: 28,
  periodLengthDays: 8,
};

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysBetween(from: Date, to: Date): number {
  const ms = startOfDay(to).getTime() - startOfDay(from).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function isoDateOnly(date: Date): string {
  const d = startOfDay(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return startOfDay(new Date(y, m - 1, d));
}

export function getDefaultStore(): PurityStore {
  return {
    settings: { ...DEFAULT_SETTINGS },
    lastPeriodStart: null,
    manualStatus: null,
    manualStatusSince: null,
  };
}

export function loadPurityStore(): PurityStore {
  if (typeof window === 'undefined') {
    return getDefaultStore();
  }

  try {
    const raw = window.localStorage.getItem(PURITY_STORAGE_KEY);
    if (!raw) {
      const defaults = getDefaultStore();
      savePurityStore(defaults);
      return defaults;
    }

    const parsed = JSON.parse(raw) as Partial<PurityStore>;
    return {
      settings: {
        cycleLengthDays: parsed.settings?.cycleLengthDays ?? DEFAULT_SETTINGS.cycleLengthDays,
        periodLengthDays: parsed.settings?.periodLengthDays ?? DEFAULT_SETTINGS.periodLengthDays,
      },
      lastPeriodStart: parsed.lastPeriodStart ?? null,
      manualStatus: parsed.manualStatus ?? null,
      manualStatusSince: parsed.manualStatusSince ?? null,
    };
  } catch {
    return getDefaultStore();
  }
}

export function savePurityStore(store: PurityStore): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PURITY_STORAGE_KEY, JSON.stringify(store));
}

export function computePuritySnapshot(store: PurityStore, today = new Date()): PuritySnapshot {
  const { settings, lastPeriodStart, manualStatus } = store;

  if (manualStatus) {
    const manualSince = store.manualStatusSince
      ? parseIsoDate(store.manualStatusSince)
      : startOfDay(today);
    const dayInPhase = daysBetween(manualSince, today) + 1;
    return buildSnapshot(manualStatus, dayInPhase, settings, lastPeriodStart, true, today);
  }

  if (!lastPeriodStart) {
    return buildSnapshot('taharah', 0, settings, null, false, today);
  }

  const periodStart = parseIsoDate(lastPeriodStart);
  const cycleDay = daysBetween(periodStart, today) + 1;

  if (cycleDay <= settings.periodLengthDays) {
    return buildSnapshot('haiz', cycleDay, settings, lastPeriodStart, false, today);
  }

  if (cycleDay <= settings.cycleLengthDays) {
    const purityDay = cycleDay - settings.periodLengthDays;
    return buildSnapshot('taharah', purityDay, settings, lastPeriodStart, false, today);
  }

  const overdueDay = cycleDay - settings.cycleLengthDays;
  return buildSnapshot('taharah', overdueDay, settings, lastPeriodStart, false, today);
}

function buildSnapshot(
  status: PurityStatus,
  dayInPhase: number,
  settings: PuritySettings,
  lastPeriodStart: string | null,
  isManual: boolean,
  today: Date
): PuritySnapshot {
  let ringProgress = 0;
  let phaseLabel = '';
  let daysUntilPeriodEstimate: number | null = null;

  if (status === 'haiz') {
    const day = Math.max(1, dayInPhase);
    ringProgress = Math.min(100, Math.round((day / settings.periodLengthDays) * 100));
    phaseLabel = 'Haiz';
  } else if (status === 'istihada') {
    const day = Math.max(1, dayInPhase);
    ringProgress = Math.min(100, Math.round((day / 10) * 100));
    phaseLabel = 'Istihada';
  } else {
    if (lastPeriodStart) {
      const periodStart = parseIsoDate(lastPeriodStart);
      const cycleDay = daysBetween(periodStart, today) + 1;
      const purityWindow = settings.cycleLengthDays - settings.periodLengthDays;
      const purityDay = Math.max(1, cycleDay - settings.periodLengthDays);
      ringProgress = Math.min(100, Math.round((purityDay / purityWindow) * 100));
      daysUntilPeriodEstimate = Math.max(0, settings.cycleLengthDays - cycleDay + 1);
    }
    phaseLabel = 'Taharah';
  }

  return {
    status,
    dayInPhase: Math.max(status === 'taharah' && !lastPeriodStart ? 0 : 1, dayInPhase),
    ringProgress,
    phaseLabel,
    isManual,
    daysUntilPeriodEstimate,
    lastPeriodStart,
    settings,
  };
}

export function shouldEnablePeriodMode(status: PurityStatus): boolean {
  return status === 'haiz' || status === 'istihada';
}
