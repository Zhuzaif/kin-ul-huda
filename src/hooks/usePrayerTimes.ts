import { useEffect, useMemo, useState } from 'react';
import type { CalculationMethodId, Madhab } from '../types/profile';
import {
  computePrayerSchedule,
  resolvePrayerCoordinates,
  type PrayerScheduleItem,
} from '../utils/prayerTimes';

export function usePrayerTimes(madhab: Madhab, calculationMethod: CalculationMethodId) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    resolvePrayerCoordinates()
      .then((c) => {
        if (!cancelled) {
          setCoords(c);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) setError('Could not detect location');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const schedule = useMemo<PrayerScheduleItem[]>(() => {
    if (!coords) return [];
    return computePrayerSchedule(coords.lat, coords.lng, madhab, calculationMethod);
  }, [coords, madhab, calculationMethod]);

  const scheduleWithStatus = useMemo(() => {
    const now = new Date();
    return schedule.map((p) => ({
      ...p,
      passed: now > p.dateObj,
    }));
  }, [schedule]);

  const widgetPrayers = useMemo(() => {
    if (!coords || schedule.length === 0) return [];

    const now = new Date();
    const list = schedule.map((p) => ({
      name: p.name,
      time: p.time,
      dateObj: p.dateObj,
      passed: now > p.dateObj,
      active: false as boolean,
    }));

    let nextIndex = list.findIndex((p) => !p.passed);

    if (nextIndex === -1) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowSchedule = computePrayerSchedule(
        coords.lat,
        coords.lng,
        madhab,
        calculationMethod,
        tomorrow
      );
      const fajr = tomorrowSchedule[0];
      if (fajr) {
        list[0] = {
          name: 'Fajr',
          time: fajr.time,
          dateObj: fajr.dateObj,
          passed: false,
          active: true,
        };
      }
    } else {
      list[nextIndex].active = true;
    }

    return list;
  }, [coords, schedule, madhab, calculationMethod]);

  const nextPrayerName = useMemo(() => {
    const active = widgetPrayers.find((p) => p.active);
    return active?.name ?? '...';
  }, [widgetPrayers]);

  const activePrayerDate = useMemo(() => {
    return widgetPrayers.find((p) => p.active)?.dateObj ?? null;
  }, [widgetPrayers]);

  return {
    schedule,
    scheduleWithStatus,
    widgetPrayers,
    nextPrayerName,
    activePrayerDate,
    loading,
    error,
    coords,
  };
}
