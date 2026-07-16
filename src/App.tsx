import MobileLayout from './components/MobileLayout';
import { PeriodModeProvider } from './contexts/PeriodModeContext';
import { PurityTrackerProvider } from './contexts/PurityTrackerContext';
import { ProfileProvider } from './contexts/ProfileContext';

export default function App() {
  return (
    <ProfileProvider>
      <PeriodModeProvider>
        <PurityTrackerProvider>
          <MobileLayout />
        </PurityTrackerProvider>
      </PeriodModeProvider>
    </ProfileProvider>
  );
}
