const CACHE_NAME = 'nisa-quran-audio-v1';

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
