import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import type { PuritySettings, PuritySnapshot, PurityStatus, PurityStore } from '../types/purity';
import {
  computePuritySnapshot,
  loadPurityStore,
  savePurityStore,
  shouldEnablePeriodMode,
} from '../utils/purityTracker';
import { usePeriodMode } from './PeriodModeContext';

type PurityTrackerContextType = {
  store: PurityStore;
  snapshot: PuritySnapshot;
  setStatus: (status: PurityStatus) => void;
  logPeriodStartToday: () => void;
  clearManualStatus: () => void;
  updateSettings: (settings: Partial<PuritySettings>) => void;
  refresh: () => void;
};

const PurityTrackerContext = createContext<PurityTrackerContextType | undefined>(undefined);

function isoToday(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function PurityTrackerProvider({ children }: { children: ReactNode }) {
  const { setPeriodMode } = usePeriodMode();
  const [store, setStore] = useState<PurityStore>(() => loadPurityStore());

  const snapshot = useMemo(() => computePuritySnapshot(store), [store]);

  const persist = useCallback((next: PurityStore) => {
    setStore(next);
    savePurityStore(next);
  }, []);

  useEffect(() => {
    const shouldBeOn = shouldEnablePeriodMode(snapshot.status);
    setPeriodMode(shouldBeOn);
  }, [snapshot.status, setPeriodMode]);

  const setStatus = useCallback(
    (status: PurityStatus) => {
      const today = isoToday();
      let next: PurityStore = {
        ...store,
        manualStatus: status,
        manualStatusSince: today,
      };

      if (status === 'haiz') {
        next = {
          ...next,
          lastPeriodStart: today,
          manualStatus: null,
          manualStatusSince: null,
        };
      } else if (status === 'taharah' && store.lastPeriodStart) {
        next = {
          ...next,
          manualStatus: status,
          manualStatusSince: today,
        };
      }

      persist(next);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(30);
      }
    },
    [store, persist]
  );

  const logPeriodStartToday = useCallback(() => {
    const today = isoToday();
    persist({
      ...store,
      lastPeriodStart: today,
      manualStatus: null,
      manualStatusSince: null,
    });
    setPeriodMode(true);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, [store, persist, setPeriodMode]);

  const clearManualStatus = useCallback(() => {
    persist({
      ...store,
      manualStatus: null,
      manualStatusSince: null,
    });
  }, [store, persist]);

  const updateSettings = useCallback(
    (partial: Partial<PuritySettings>) => {
      persist({
        ...store,
        settings: { ...store.settings, ...partial },
      });
    },
    [store, persist]
  );

  const refresh = useCallback(() => {
    setStore(loadPurityStore());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStore((prev) => {
        const next = loadPurityStore();
        return JSON.stringify(prev) === JSON.stringify(next) ? prev : next;
      });
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  const value = useMemo(
    () => ({
      store,
      snapshot,
      setStatus,
      logPeriodStartToday,
      clearManualStatus,
      updateSettings,
      refresh,
    }),
    [store, snapshot, setStatus, logPeriodStartToday, clearManualStatus, updateSettings, refresh]
  );

  return (
    <PurityTrackerContext.Provider value={value}>{children}</PurityTrackerContext.Provider>
  );
}

export function usePurityTracker() {
  const ctx = useContext(PurityTrackerContext);
  if (!ctx) {
    throw new Error('usePurityTracker must be used within PurityTrackerProvider');
  }
  return ctx;
}
