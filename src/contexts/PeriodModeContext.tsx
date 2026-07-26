import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PeriodModeContextType {
  isPeriodMode: boolean;
  setPeriodMode: (value: boolean) => void;
}

const PeriodModeContext = createContext<PeriodModeContextType | undefined>(undefined);

export function PeriodModeProvider({ children }: { children: ReactNode }) {
  const [isPeriodMode, setIsPeriodMode] = useState(false);

  const setPeriodMode = (value: boolean) => {
    setIsPeriodMode(value);
  };

  return (
    <PeriodModeContext.Provider value={{ isPeriodMode, setPeriodMode }}>
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
