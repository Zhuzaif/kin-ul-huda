import MobileLayout from './components/MobileLayout';
import { PeriodModeProvider } from './contexts/PeriodModeContext';

export default function App() {
  return (
    <PeriodModeProvider>
      <MobileLayout />
    </PeriodModeProvider>
  );
}
