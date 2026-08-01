const CACHE_NAME = 'nisa-quran-audio-v1';
const STORAGE_KEY = 'nisa_downloaded_surahs';

/** All reciters whose surah.json files are bundled locally in /public/recitations/ */
const KNOWN_RECITERS = ['yasser', 'mishary', 'abdul-basit', 'maher', 'shuraim'];

/**
 * CDN path segments used by each reciter, so a cached URL can be mapped back to the
 * reciter id used under /public/recitations/. The CDN folder rarely matches our id
 * (mishary -> alafasy, abdul-basit -> abdulBasit), so it has to be listed explicitly.
 * Compared after stripping every non-alphanumeric character, case-insensitively.
 */
const RECITER_URL_KEYS: Record<string, string[]> = {
  yasser: ['yasserAlDosari'],
  mishary: ['alafasy', 'misharyAlafasy'],
  'abdul-basit': ['abdulBasit'],
  maher: ['maherAlMuaiqly'],
  shuraim: ['shuraim', 'saudAlShuraim'],
};

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

/** Result of verifying downloaded surahs against CacheStorage. */
export interface CachedSurahReport {
  /** Surahs that are genuinely present in the cache (only trustworthy when `verified`). */
  downloaded: Record<number, boolean>;
  /** False when CacheStorage could not be read, so `downloaded` is optimistic, not proof. */
  verified: boolean;
}

/**
 * Extract the surah number from an audio URL.
 * Only the file name is inspected — matching anywhere in the URL would let folder
 * names, bitrates or timestamps ("128", "2024") masquerade as surah numbers.
 * Returns null when the file name carries no usable surah number.
 */
export function getSurahIdFromAudioUrl(url: string): number | null {
  let pathname = url;
  try {
    pathname = new URL(url, window.location.origin).pathname;
  } catch {
    /* not a parsable URL — fall back to the raw string */
  }

  const fileName = pathname.split('/').pop() ?? '';
  const stem = fileName.replace(/\.[a-z0-9]+$/i, '');
  // Either the whole name is the number ("001") or it is a delimited part of it ("surah_001")
  const match = /^(\d{1,3})$/.exec(stem) ?? /(?:^|[_-])(\d{1,3})(?=$|[_-])/.exec(stem);
  if (!match) return null;

  const id = Number(match[1]);
  return id >= 1 && id <= 114 ? id : null;
}

/** Map a cached audio URL back to one of KNOWN_RECITERS, or null if unrecognised. */
export function getReciterIdFromAudioUrl(url: string): string | null {
  const normalizedUrl = normalize(url);
  for (const reciterId of KNOWN_RECITERS) {
    const keys = RECITER_URL_KEYS[reciterId] ?? [reciterId];
    if (keys.some((key) => normalizedUrl.includes(normalize(key)))) return reciterId;
  }
  return null;
}

/**
 * When offline, find a reciter whose audio for a given surah is already cached.
 * Scans CacheStorage keys directly — works without any network.
 * Prefers `preferredReciterId`, then KNOWN_RECITERS order, so the choice is stable
 * across calls instead of depending on cache key iteration order.
 * Returns { reciterId, cachedUrl } or null if nothing is cached.
 */
export async function findCachedReciterForSurah(
  chapterId: number,
  preferredReciterId?: string
): Promise<{ reciterId: string; cachedUrl: string } | null> {
  if (!('caches' in window)) return null;

  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();

    const matches = keys
      .filter((request) => getSurahIdFromAudioUrl(request.url) === chapterId)
      .map((request) => ({
        reciterId: getReciterIdFromAudioUrl(request.url) ?? 'cached',
        cachedUrl: request.url,
      }))
      .sort((a, b) => a.cachedUrl.localeCompare(b.cachedUrl));

    if (matches.length === 0) return null;

    for (const reciterId of [preferredReciterId, ...KNOWN_RECITERS]) {
      if (!reciterId) continue;
      const hit = matches.find((m) => m.reciterId === reciterId);
      if (hit) return hit;
    }
    return matches[0];
  } catch {
    // CacheStorage error
    return null;
  }
}

export function getDownloadedSurahsFromStorage(): Record<number, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};

    // Drop anything that is not a real "surah id -> true" entry
    const clean: Record<number, boolean> = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      const id = Number(key);
      if (Number.isInteger(id) && id >= 1 && id <= 114 && value === true) clean[id] = true;
    }
    return clean;
  } catch {
    return {};
  }
}

type DownloadedSurahsListener = (downloaded: Record<number, boolean>) => void;

const downloadListeners = new Set<DownloadedSurahsListener>();

/**
 * Listen for changes to the downloaded-surah set.
 * Without this, a component only learns about new downloads when it remounts, so a
 * download started elsewhere (or still in progress) would not show up until a refresh.
 * Returns an unsubscribe function.
 */
export function subscribeToDownloadedSurahs(listener: DownloadedSurahsListener): () => void {
  downloadListeners.add(listener);
  return () => {
    downloadListeners.delete(listener);
  };
}

function emitDownloadedSurahs(map: Record<number, boolean>): void {
  for (const listener of downloadListeners) {
    // A fresh object per listener so React sees a new reference and re-renders
    try {
      listener({ ...map });
    } catch (e) {
      console.error('Downloaded-surahs listener failed:', e);
    }
  }
}

function writeDownloadedSurahs(map: Record<number, boolean>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
  // Notify even if persisting failed — the in-memory view should still be correct
  emitDownloadedSurahs(map);
}

export function markSurahDownloaded(surahId: number): void {
  const current = getDownloadedSurahsFromStorage();
  current[surahId] = true;
  writeDownloadedSurahs(current);
}

export function markAllSurahsDownloaded(surahIds: number[]): void {
  const current = getDownloadedSurahsFromStorage();
  for (const id of surahIds) current[id] = true;
  writeDownloadedSurahs(current);
}

/** Replace the stored set entirely — used after verification so stale entries disappear. */
export function replaceDownloadedSurahs(surahIds: number[]): void {
  const next: Record<number, boolean> = {};
  for (const id of surahIds) next[id] = true;
  writeDownloadedSurahs(next);
}

export function unmarkSurahDownloaded(surahId: number): void {
  const current = getDownloadedSurahsFromStorage();
  delete current[surahId];
  writeDownloadedSurahs(current);
}

export async function downloadAudioToCache(
  url: string,
  onProgress?: (percent: number) => void
): Promise<boolean> {
  if (!('caches' in window)) return false;
  try {
    const cache = await caches.open(CACHE_NAME);
    const existing = await cache.match(url);
    if (existing) {
      onProgress?.(100);
      return true;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch audio (${response.status})`);

    // We clone the response because cache.put consumes it
    await cache.put(url, response.clone());
    onProgress?.(100);
    return true;
  } catch (error) {
    console.error('Failed to download audio:', error);
    return false;
  }
}

/**
 * Ground truth for which surahs are actually cached.
 * Reads CacheStorage keys only — it deliberately does NOT seed from localStorage,
 * otherwise optimistic entries would confirm themselves and verification would be pointless.
 * Works offline and covers every reciter, since surah ids come from the cached URLs.
 * `verified: false` means the cache was unreadable and the result proves nothing.
 */
export async function checkCachedSurahs(surahIds: number[]): Promise<CachedSurahReport> {
  if (!('caches' in window)) return { downloaded: {}, verified: false };

  const wanted = new Set(surahIds);
  const downloaded: Record<number, boolean> = {};

  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    for (const request of keys) {
      const id = getSurahIdFromAudioUrl(request.url);
      if (id !== null && wanted.has(id)) downloaded[id] = true;
    }
    return { downloaded, verified: true };
  } catch (e) {
    console.error('Error checking cached surahs:', e);
    return { downloaded: {}, verified: false };
  }
}

export async function getAudioCacheStats(): Promise<{ count: number; supported: boolean }> {
  if (!('caches' in window)) return { count: 0, supported: false };
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
  // Same notification path as writeDownloadedSurahs, so every screen clears its ticks too
  emitDownloadedSurahs({});
  if (!('caches' in window)) return;
  await caches.delete(CACHE_NAME);
}

/**
 * Returns a blob: URL for cached audio, or null when it is not cached.
 * Callers must revoke the returned URL when done.
 */
export async function getCachedAudioUrl(url: string): Promise<string | null> {
  if (!('caches' in window)) return null;
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(url);
    if (!response) return null;
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}
