import { useState } from 'react';
import MobileLayout from './components/MobileLayout';
import OnboardingFlow from './components/OnboardingFlow';
import { PeriodModeProvider } from './contexts/PeriodModeContext';
import { PurityTrackerProvider } from './contexts/PurityTrackerContext';
import { ProfileProvider, useProfile } from './contexts/ProfileContext';

function AppContent() {
  const { profile, updateProfile } = useProfile();
  const [showOnboarding, setShowOnboarding] = useState(!profile.onboardingCompleted);

  if (showOnboarding) {
    return (
      <OnboardingFlow
        onComplete={() => {
          setShowOnboarding(false);
        }}
      />
    );
  }

  return (
    <PeriodModeProvider>
      <PurityTrackerProvider>
        <MobileLayout />
      </PurityTrackerProvider>
    </PeriodModeProvider>
  );
}

export default function App() {
  return (
    <ProfileProvider>
      <AppContent />
    </ProfileProvider>
  );
}
