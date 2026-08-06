import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { StatusBar, Style } from '@capacitor/status-bar';
import { LocalNotifications } from '@capacitor/local-notifications';
import MobileLayout from './components/MobileLayout';
import OnboardingFlow from './components/OnboardingFlow';
import { PeriodModeProvider } from './contexts/PeriodModeContext';
import { PurityTrackerProvider } from './contexts/PurityTrackerContext';
import { ProfileProvider, useProfile } from './contexts/ProfileContext';
import { QuranAudioProvider } from './contexts/QuranAudioContext';
import { SavedVersesProvider } from './contexts/SavedVersesContext';
import { requestForToken, onMessageListener } from './lib/firebase';
import { supabase } from './lib/supabase';
import { schedulePrayerNotifications } from './utils/notifications';

function AppContent() {
  const { profile, updateProfile } = useProfile();
  const [showOnboarding, setShowOnboarding] = useState(!profile.onboardingCompleted);

  useEffect(() => {
    if (!profile.onboardingCompleted || !profile.userId) return;

    if (Capacitor.isNativePlatform()) {
      PushNotifications.addListener('registration', async (token) => {
        console.log('Native Push Registration Token: ', token.value);
        if (profile.userId) {
          await supabase.from('nisa_users').update({
            push_token: token.value,
            notifications_enabled: true
          }).eq('id', profile.userId);
        }
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push received: ', notification);
        LocalNotifications.schedule({
          notifications: [
            {
              title: notification.title || 'Notification',
              body: notification.body || '',
              id: new Date().getTime(),
              extra: notification.data
            }
          ]
        });
      });
    }

    const unsubscribe = onMessageListener((payload) => {
      if (!Capacitor.isNativePlatform()) {
        console.log('Received web foreground message: ', payload);
        const title = payload.notification?.title || 'Notification';
        const options = {
          body: payload.notification?.body,
          icon: '/vite.svg',
        };
        // Show native notification even when in foreground
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(title, options);
        }
      }
    });

    async function setupNotifications() {
      if (Capacitor.isNativePlatform()) {
        try {
          await StatusBar.setStyle({ style: Style.Light });
          if (Capacitor.getPlatform() === 'android') {
            await StatusBar.setOverlaysWebView({ overlay: true });
            await StatusBar.setBackgroundColor({ color: '#00000000' }).catch(() => {});
          }
        } catch (e) {
          console.error('StatusBar error:', e);
        }
      }
      
      if (Capacitor.isNativePlatform()) {
        let permStatus = await PushNotifications.checkPermissions();
        if (permStatus.receive === 'prompt') {
          permStatus = await PushNotifications.requestPermissions();
        }
        if (permStatus.receive === 'granted') {
          await PushNotifications.register();
        }
      } else if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          const token = await requestForToken();
          if (token) {
            await supabase.from('nisa_users').update({
              push_token: token,
              notifications_enabled: true
            }).eq('id', profile.userId);
          }
        }
      }
    }
    setupNotifications();

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
      if (Capacitor.isNativePlatform()) {
        PushNotifications.removeAllListeners();
      }
    };
  }, [profile.onboardingCompleted, profile.userId]);

  // Schedule local background notifications whenever relevant settings change
  useEffect(() => {
    if (profile.onboardingCompleted) {
      schedulePrayerNotifications(profile).catch((e) => {
        console.error('Failed to schedule local notifications:', e);
      });
    }
  }, [
    profile.onboardingCompleted,
    profile.notificationPrefs?.adhan,
    profile.notificationPrefs?.reminders,
    profile.madhab,
    profile.calculationMethod
  ]);

  // Keep the status bar and the backdrop behind the safe-area insets in sync
  // with the active theme so dark themes don't flash a light strip.
  useEffect(() => {
    const DARK_THEMES = new Set(['black-gold', 'oled-vibrant']);
    const BASE_SURFACE: Record<string, string> = {
      serenity: '#FFFFFF',
      bloom: '#FFFBFB',
      meadow: '#FBFEFC',
      'oled-vibrant': '#000000',
      'black-gold': '#000000',
    };
    const isDark = DARK_THEMES.has(profile.theme);
    const baseSurface = BASE_SURFACE[profile.theme] ?? '#FFFFFF';

    document.body.style.backgroundColor = baseSurface;

    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', baseSurface);

    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light }).catch((e) => {
        console.error('StatusBar style error:', e);
      });
    }
  }, [profile.theme]);

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
        <QuranAudioProvider>
          <SavedVersesProvider>
            <MobileLayout />
          </SavedVersesProvider>
        </QuranAudioProvider>
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
