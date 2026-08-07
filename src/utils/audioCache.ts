import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileTransfer } from '@capacitor/file-transfer';

const CACHE_NAME = 'nisa-quran-audio-v1';
const STORAGE_KEY = 'nisa_downloaded_surahs';
const NATIVE_DIR = 'nisa_audio_cache';

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

export interface CachedSurahReport {
  downloaded: Record<number, boolean>;
  verified: boolean;
}

export function getSurahIdFromAudioUrl(url: string): number | null {
  let pathname = url;
  try {
    pathname = new URL(url, window.location.origin).pathname;
  } catch { /* not a parsable URL */ }

  const fileName = pathname.split('/').pop() ?? '';
  const stem = fileName.replace(/\.[a-z0-9]+$/i, '');
  const match = /^(\d{1,3})$/.exec(stem) ?? /(?:^|[_-])(\d{1,3})(?=$|[_-])/.exec(stem);
  if (!match) return null;

  const id = Number(match[1]);
  return id >= 1 && id <= 114 ? id : null;
}

export function getReciterIdFromAudioUrl(url: string): string | null {
  const normalizedUrl = normalize(url);
  for (const reciterId of KNOWN_RECITERS) {
    const keys = RECITER_URL_KEYS[reciterId] ?? [reciterId];
    if (keys.some((key) => normalizedUrl.includes(normalize(key)))) return reciterId;
  }
  return null;
}

/** Native filename format: reciterId_surahId_base64url.mp3 */
function getNativeFilename(url: string): string {
  const surahId = getSurahIdFromAudioUrl(url) || '0';
  const reciterId = getReciterIdFromAudioUrl(url) || 'unknown';
  const safeUrl = btoa(url).replace(/[/+=]/g, '_'); // safe base64
  return `${reciterId}_${surahId}_${safeUrl}.mp3`;
}

async function ensureNativeDir() {
  try {
    await Filesystem.mkdir({ path: NATIVE_DIR, directory: Directory.Data, recursive: true });
  } catch (e) {
    // Already exists
  }
}

export async function findCachedReciterForSurah(
  chapterId: number,
  preferredReciterId?: string
): Promise<{ reciterId: string; cachedUrl: string } | null> {
  const isNative = Capacitor.isNativePlatform();

  if (isNative) {
    try {
      await ensureNativeDir();
      const res = await Filesystem.readdir({ path: NATIVE_DIR, directory: Directory.Data });
      const files = res.files;
      const matches = files
        .filter((f) => f.name.includes(`_${chapterId}_`))
        .map((f) => {
           const reciterId = f.name.split('_')[0];
           // Extract original URL if needed, but for native we just return the local URI
           return { reciterId, cachedUrl: f.name, isNativeFile: true };
        });

      if (matches.length === 0) return null;
      for (const reciterId of [preferredReciterId, ...KNOWN_RECITERS]) {
        if (!reciterId) continue;
        const hit = matches.find((m) => m.reciterId === reciterId);
        if (hit) return hit;
      }
      return matches[0];
    } catch {
      return null;
    }
  } else {
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
      return null;
    }
  }
}

export function getDownloadedSurahsFromStorage(): Record<number, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};

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

export function subscribeToDownloadedSurahs(listener: DownloadedSurahsListener): () => void {
  downloadListeners.add(listener);
  return () => {
    downloadListeners.delete(listener);
  };
}

function emitDownloadedSurahs(map: Record<number, boolean>): void {
  for (const listener of downloadListeners) {
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
  } catch { /* ignore */ }
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
  const isNative = Capacitor.isNativePlatform();

  if (isNative) {
    try {
      await ensureNativeDir();
      const filename = getNativeFilename(url);
      const path = `${NATIVE_DIR}/${filename}`;
      
      const fileUri = await Filesystem.getUri({ path, directory: Directory.Data });
      
      let listener: any;
      if (onProgress) {
        listener = await FileTransfer.addListener('progress', (progress) => {
          if (progress.contentLength) {
             onProgress(Math.round((progress.bytes / progress.contentLength) * 100));
          }
        });
      }

      await FileTransfer.downloadFile({
        url,
        path: fileUri.uri,
      });

      if (listener) listener.remove();
      onProgress?.(100);
      return true;
    } catch (e) {
      console.error('Native download failed', e);
      return false;
    }
  } else {
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

      await cache.put(url, response.clone());
      onProgress?.(100);
      return true;
    } catch (error) {
      console.error('Failed to download audio:', error);
      return false;
    }
  }
}

export async function checkCachedSurahs(surahIds: number[]): Promise<CachedSurahReport> {
  const isNative = Capacitor.isNativePlatform();
  const wanted = new Set(surahIds);
  const downloaded: Record<number, boolean> = {};

  if (isNative) {
    try {
      await ensureNativeDir();
      const res = await Filesystem.readdir({ path: NATIVE_DIR, directory: Directory.Data });
      for (const f of res.files) {
        const parts = f.name.split('_');
        if (parts.length >= 2) {
          const id = Number(parts[1]);
          if (wanted.has(id)) downloaded[id] = true;
        }
      }
      return { downloaded, verified: true };
    } catch (e) {
      console.error('Native checkCachedSurahs failed', e);
      return { downloaded: {}, verified: false };
    }
  } else {
    if (!('caches' in window)) return { downloaded: {}, verified: false };
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
}

export async function getAudioCacheStats(): Promise<{ count: number; supported: boolean }> {
  const isNative = Capacitor.isNativePlatform();
  if (isNative) {
    try {
      await ensureNativeDir();
      const res = await Filesystem.readdir({ path: NATIVE_DIR, directory: Directory.Data });
      return { count: res.files.length, supported: true };
    } catch {
      return { count: 0, supported: true };
    }
  } else {
    if (!('caches' in window)) return { count: 0, supported: false };
    try {
      const cache = await caches.open(CACHE_NAME);
      const keys = await cache.keys();
      return { count: keys.length, supported: true };
    } catch {
      return { count: 0, supported: true };
    }
  }
}

export async function clearAudioCache(): Promise<void> {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* ignore */ }
  emitDownloadedSurahs({});

  const isNative = Capacitor.isNativePlatform();
  if (isNative) {
    try {
      await Filesystem.rmdir({ path: NATIVE_DIR, directory: Directory.Data, recursive: true });
    } catch (e) { /* ignore */ }
  } else {
    if (!('caches' in window)) return;
    await caches.delete(CACHE_NAME);
  }
}

export async function getCachedAudioUrl(url: string): Promise<string | null> {
  const isNative = Capacitor.isNativePlatform();
  if (isNative) {
    // If the 'url' passed is actually the native filename (from findCachedReciterForSurah)
    // we resolve its path. Otherwise we resolve from the URL hash.
    try {
      let filename = url;
      if (url.startsWith('http')) {
         filename = getNativeFilename(url);
      }
      const path = `${NATIVE_DIR}/${filename}`;
      const stat = await Filesystem.stat({ path, directory: Directory.Data });
      const uri = await Filesystem.getUri({ path, directory: Directory.Data });
      // For webview usage (like standard audio element), use convertFileSrc
      return Capacitor.convertFileSrc(uri.uri);
    } catch (e) {
      return null;
    }
  } else {
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
}

/** 
 * Returns the raw native URI (file://...) which is required by NativeAudio plugin.
 * capacitor://localhost/ or https://localhost/ generated by convertFileSrc might fail in NativeAudio. 
 */
export async function getNativeAudioUri(url: string): Promise<string | null> {
  if (!Capacitor.isNativePlatform()) return null;
  try {
    let filename = url;
    if (url.startsWith('http')) {
        filename = getNativeFilename(url);
    }
    const path = `${NATIVE_DIR}/${filename}`;
    // ensure file exists
    await Filesystem.stat({ path, directory: Directory.Data });
    const uriRes = await Filesystem.getUri({ path, directory: Directory.Data });
    return uriRes.uri;
  } catch (e) {
    return null;
  }
}
