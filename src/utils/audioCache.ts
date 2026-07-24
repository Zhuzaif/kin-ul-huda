const CACHE_NAME = 'nisa-quran-audio-v1';
const STORAGE_KEY = 'nisa_downloaded_surahs';

export function getDownloadedSurahsFromStorage(): Record<number, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    /* ignore */
  }
  return {};
}

export function markSurahDownloaded(surahId: number): void {
  try {
    const current = getDownloadedSurahsFromStorage();
    current[surahId] = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    /* ignore */
  }
}

export function markAllSurahsDownloaded(surahIds: number[]): void {
  try {
    const current = getDownloadedSurahsFromStorage();
    for (const id of surahIds) {
      current[id] = true;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    /* ignore */
  }
}

export async function downloadAudioToCache(url: string, onProgress?: (percent: number) => void): Promise<boolean> {
  if (!('caches' in window)) return false;
  try {
    const cache = await caches.open(CACHE_NAME);
    const existing = await cache.match(url);
    if (existing) {
      if (onProgress) onProgress(100);
      return true;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch audio');
    
    // We clone the response because cache.put consumes it
    await cache.put(url, response.clone());
    if (onProgress) onProgress(100);
    return true;
  } catch (error) {
    console.error("Failed to download audio:", error);
    return false;
  }
}

export async function isAudioCached(url: string): Promise<boolean> {
  if (!('caches' in window)) return false;
  const cache = await caches.open(CACHE_NAME);
  const response = await cache.match(url);
  return !!response;
}

export async function checkCachedSurahs(surahIds: number[]): Promise<Record<number, boolean>> {
  const result: Record<number, boolean> = { ...getDownloadedSurahsFromStorage() };
  if (!('caches' in window)) return result;

  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    if (keys.length === 0) return result;

    const res = await fetch('/recitations/mishary/surah.json');
    if (res.ok) {
      const surahData = await res.json();
      for (const id of surahIds) {
        const info = surahData[String(id)];
        if (info && info.audio_url) {
          const match = await cache.match(info.audio_url);
          if (match) {
            result[id] = true;
          }
        }
      }
    }
  } catch (e) {
    console.error('Error checking cached surahs:', e);
  }
  return result;
}

export async function getAudioCacheStats(): Promise<{ count: number; supported: boolean }> {
  if (!('caches' in window)) {
    return { count: 0, supported: false };
  }
  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    return { count: keys.length, supported: true };
  } catch {
    return { count: 0, supported: true };
  }
}

export async function clearAudioCache(): Promise<void> {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  if (!('caches' in window)) return;
  await caches.delete(CACHE_NAME);
}

export async function getCachedAudioUrl(url: string): Promise<string | null> {
  if (!('caches' in window)) return url;
  const cache = await caches.open(CACHE_NAME);
  const response = await cache.match(url);
  if (response) {
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
  return null;
}
