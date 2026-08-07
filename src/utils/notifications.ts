import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { computePrayerSchedule, resolvePrayerCoordinates } from './prayerTimes';
import type { UserProfile } from '../types/profile';

export async function schedulePrayerNotifications(profile: UserProfile) {
  if (!Capacitor.isNativePlatform()) return;

  // 1. Cancel all existing scheduled notifications
  try {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel({ notifications: pending.notifications });
    }
  } catch (e) {
    console.error('Error clearing pending notifications:', e);
  }

  // Ensure notification channel is created for Android
  try {
    await LocalNotifications.createChannel({
      id: 'adhan_channel',
      name: 'Adhan Notifications',
      description: 'Notifications for prayer times with Adhan sound',
      importance: 5, // High importance
      visibility: 1, // Public
      sound: 'adhan.mp3', 
      vibration: true,
    });
  } catch (e) {
    console.error('Error creating notification channel:', e);
  }

  // 2. If master switch is off or both sub-settings are disabled, we are done
  const prefs = profile.notificationPrefs || { adhan: false, reminders: false };
  if (!profile.prayerReminders || (!prefs.adhan && !prefs.reminders)) {
    return;
  }

  // 3. Resolve coordinates
  let coords;
  try {
    coords = await resolvePrayerCoordinates();
  } catch (e) {
    console.error('Failed to resolve coordinates for notifications:', e);
    return;
  }

  // 4. Generate schedule for the next 7 days
  const notificationsToSchedule = [];
  let notifId = Math.floor(Date.now() / 1000); // Base ID

  const now = new Date();

  for (let i = 0; i < 7; i++) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + i);
    
    const schedule = computePrayerSchedule(
      coords.lat,
      coords.lng,
      profile.madhab,
      profile.calculationMethod,
      targetDate
    );

    for (const prayer of schedule) {
      // If Adhan is enabled and the time is in the future
      if (prefs.adhan && prayer.dateObj > now) {
        notificationsToSchedule.push({
          id: notifId++,
          title: `Time for ${prayer.name}`,
          body: `It is time to pray ${prayer.name}.`,
          schedule: { at: prayer.dateObj },
          sound: 'adhan.mp3', // For iOS and as fallback
          channelId: 'adhan_channel', // Crucial for Android custom sound
          smallIcon: 'ic_stat_name', // Default capacitor icon
        });
      }

      // If Reminders are enabled, 15 mins before
      if (prefs.reminders) {
        const reminderTime = new Date(prayer.dateObj.getTime() - 15 * 60 * 1000);
        if (reminderTime > now) {
          notificationsToSchedule.push({
            id: notifId++,
            title: `${prayer.name} approaching`,
            body: `${prayer.name} prayer begins in 15 minutes.`,
            schedule: { at: reminderTime },
            sound: 'default',
            smallIcon: 'ic_stat_name',
          });
        }
      }
    }
  }

  // 5. Schedule them in batches if there are any
  if (notificationsToSchedule.length > 0) {
    try {
      await LocalNotifications.schedule({
        notifications: notificationsToSchedule
      });
      console.log(`Scheduled ${notificationsToSchedule.length} prayer notifications for the next 7 days.`);
    } catch (e) {
      console.error('Error scheduling notifications:', e);
    }
  }
}
