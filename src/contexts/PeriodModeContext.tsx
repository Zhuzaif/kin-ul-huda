import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PeriodModeContextType {
  isPeriodMode: boolean;
  togglePeriodMode: () => void;
}

const PeriodModeContext = createContext<PeriodModeContextType | undefined>(undefined);

export function PeriodModeProvider({ children }: { children: ReactNode }) {
  const [isPeriodMode, setIsPeriodMode] = useState(false);

  const togglePeriodMode = () => {
    setIsPeriodMode((prev) => !prev);
    // Trigger subtle haptic feedback if supported
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <PeriodModeContext.Provider value={{ isPeriodMode, togglePeriodMode }}>
      {children}
    </PeriodModeContext.Provider>
  );
}

export function usePeriodMode() {
  const context = useContext(PeriodModeContext);
  if (context === undefined) {
    throw new Error('usePeriodMode must be used within a PeriodModeProvider');
  }
  return context;
}
