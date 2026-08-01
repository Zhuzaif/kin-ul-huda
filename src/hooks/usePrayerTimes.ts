import { useEffect, useMemo, useState } from 'react';
import type { CalculationMethodId, Madhab } from '../types/profile';
import {
  computePrayerSchedule,
  resolvePrayerCoordinates,
  type PrayerScheduleItem,
} from '../utils/prayerTimes';

export function usePrayerTimes(
  madhab: Madhab,
  calculationMethod: CalculationMethodId,
  coordsOverride?: { lat: number; lng: number } | null
) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    let cancelled = false;
    // When the caller supplies an explicit location (e.g. the user picked one
    // in settings), use it directly and skip IP/geo resolution.
    if (coordsOverride) {
      setCoords(coordsOverride);
      setError(null);
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }
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

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const schedule = useMemo<PrayerScheduleItem[]>(() => {
    if (!coords) return [];
    return computePrayerSchedule(coords.lat, coords.lng, madhab, calculationMethod, now);
  }, [coords, madhab, calculationMethod, now.toDateString()]);

  const scheduleWithStatus = useMemo(() => {
    return schedule.map((p) => ({
      ...p,
      passed: now > p.dateObj,
    }));
  }, [schedule, now]);

  const widgetPrayers = useMemo(() => {
    if (!coords || schedule.length === 0) return [];

    const list = schedule.map((p) => ({
      name: p.name,
      time: p.time,
      dateObj: p.dateObj,
      passed: now > p.dateObj,
      active: false as boolean,
    }));

    let nextIndex = list.findIndex((p) => !p.passed);

    if (nextIndex === -1) {
      const tomorrow = new Date(now);
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
        return list.map((p, idx) => {
          if (idx === 0) {
            return {
              ...p,
              dateObj: fajr.dateObj,
              time: fajr.time,
              passed: false,
              active: true,
            };
          }
          return p;
        });
      }
    } else {
      list[nextIndex].active = true;
    }

    return list;
  }, [coords, schedule, madhab, calculationMethod, now]);

  const nextPrayerName = useMemo(() => {
    const active = widgetPrayers.find((p) => p.active);
    return active?.name ?? '...';
  }, [widgetPrayers]);

  const activePrayerTime = useMemo(() => {
    const active = widgetPrayers.find((p) => p.active);
    return active?.time ?? '';
  }, [widgetPrayers]);

  const activePrayerDate = useMemo(() => {
    return widgetPrayers.find((p) => p.active)?.dateObj ?? null;
  }, [widgetPrayers]);

  return {
    schedule,
    scheduleWithStatus,
    widgetPrayers,
    nextPrayerName,
    activePrayerTime,
    activePrayerDate,
    loading,
    error,
    coords,
  };
}
