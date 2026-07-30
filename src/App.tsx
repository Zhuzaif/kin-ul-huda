import { useState, useEffect } from 'react';
import MobileLayout from './components/MobileLayout';
import OnboardingFlow from './components/OnboardingFlow';
import { PeriodModeProvider } from './contexts/PeriodModeContext';
import { PurityTrackerProvider } from './contexts/PurityTrackerContext';
import { ProfileProvider, useProfile } from './contexts/ProfileContext';
import { requestForToken, onMessageListener } from './lib/firebase';
import { supabase } from './lib/supabase';

function AppContent() {
  const { profile, updateProfile } = useProfile();
  const [showOnboarding, setShowOnboarding] = useState(!profile.onboardingCompleted);

  useEffect(() => {
    if (!profile.onboardingCompleted || !profile.userId) return;

    const unsubscribe = onMessageListener((payload) => {
      console.log('Received foreground message: ', payload);
      const title = payload.notification?.title || 'Notification';
      const options = {
        body: payload.notification?.body,
        icon: '/vite.svg',
      };
      // Show native notification even when in foreground
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, options);
      }
    });

    async function setupNotifications() {
      if ('Notification' in window && Notification.permission === 'granted') {
        const token = await requestForToken();
        if (token) {
          await supabase.from('nisa_users').update({
            push_token: token,
            notifications_enabled: true
          }).eq('id', profile.userId);
        }
      }
    }
    setupNotifications();

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [profile.onboardingCompleted, profile.userId]);

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
