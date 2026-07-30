import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useProfile } from '../contexts/ProfileContext';

export function useActivityTracker(
  activeTab: string, 
  isQuranReading: boolean, 
  showTasbeeh: boolean, 
  profileOverlay: boolean
) {
  const { profile } = useProfile();
  const currentScreenRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Log activity to Supabase
  const logActivity = async (screenName: string, timeSpentSeconds: number) => {
    try {
      await supabase.from('user_activity_logs').insert([
        {
          user_id: profile.userId || null,
          screen_name: screenName,
          time_spent_seconds: timeSpentSeconds
        }
      ]);
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  };

  useEffect(() => {
    // Determine the current logical screen name
    let currentScreen = activeTab;
    if (activeTab === 'quran' && isQuranReading) {
      currentScreen = 'quran_reading';
    } else if (showTasbeeh) {
      currentScreen = 'tasbeeh';
    } else if (profileOverlay) {
      currentScreen = 'profile_settings';
    }

    if (currentScreenRef.current !== currentScreen) {
      // If there was a previous screen, log its time
      if (currentScreenRef.current) {
        const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
        
        // Only log if time spent is meaningful (e.g. > 2 seconds)
        if (timeSpent > 2) {
          logActivity(currentScreenRef.current, timeSpent);
        }
      }

      // Update for the new screen
      currentScreenRef.current = currentScreen;
      startTimeRef.current = Date.now();
    }
  }, [activeTab, isQuranReading, showTasbeeh, profileOverlay, profile.userId]);

  // Handle visibility changes (e.g., closing the app or switching tabs in browser)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && currentScreenRef.current) {
        const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
        if (timeSpent > 2) {
          logActivity(currentScreenRef.current, timeSpent);
        }
        // Reset start time so we don't count the time while hidden
        startTimeRef.current = Date.now();
      } else if (document.visibilityState === 'visible') {
        startTimeRef.current = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [profile.userId]);
}
