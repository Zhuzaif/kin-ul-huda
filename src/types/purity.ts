export type PurityStatus = 'haiz' | 'istihada' | 'taharah';

export type PuritySettings = {
  cycleLengthDays: number;
  periodLengthDays: number;
};

export type PurityStore = {
  settings: PuritySettings;
  lastPeriodStart: string | null;
  manualStatus: PurityStatus | null;
  manualStatusSince: string | null;
};

export type PuritySnapshot = {
  status: PurityStatus;
  dayInPhase: number;
  ringProgress: number;
  phaseLabel: string;
  isManual: boolean;
  daysUntilPeriodEstimate: number | null;
  lastPeriodStart: string | null;
  settings: PuritySettings;
};
