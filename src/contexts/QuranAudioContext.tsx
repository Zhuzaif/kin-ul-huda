import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getCachedAudioUrl, findCachedReciterForSurah, getNativeAudioUri } from '../utils/audioCache';
import { RECITER_OPTIONS } from '../data/quranConstants';
import chapters from '../data/chapters-en.json';
import { Capacitor } from '@capacitor/core';
import { NativeAudio } from '@capgo/capacitor-native-audio';

interface QuranAudioContextType {
  currentSurahId: number;
  setCurrentSurahId: (id: number | ((prev: number) => number)) => void;
  selectedReciterId: string;
  setSelectedReciterId: (id: string) => void;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  togglePlay: () => void;
  progress: number;
  duration: number;
  isLooping: boolean;
  setIsLooping: (val: boolean) => void;
  isShuffle: boolean;
  setIsShuffle: (val: boolean) => void;
  playNext: () => void;
  playPrev: () => void;
  handleSeek: (time: number) => void;
  segments: Record<string, any>;
  sleepTimerEnd: number | null;
  setSleepTimer: (minutes: number) => void;
  clearSleepTimer: () => void;
  forceReloadAudio: () => void;
}

const QuranAudioContext = createContext<QuranAudioContextType | undefined>(undefined);

const RECITER_STORAGE_KEY = 'nisa.quran.reciter';
const SURAH_STORAGE_KEY = 'nisa.quran.lastSurah';
const TIME_STORAGE_KEY = 'nisa.quran.lastTime';

const ASSET_ID = 'quran_audio';

export const QuranAudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSurahId, setCurrentSurahId] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(SURAH_STORAGE_KEY);
      if (stored) return Number(stored);
    }
    return 18;
  });
  
  const [selectedReciterId, setSelectedReciterId] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(RECITER_STORAGE_KEY);
      if (stored && RECITER_OPTIONS.some(r => r.id === stored)) return stored;
    }
    return 'mishary';
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  const [surahAudioUrl, setSurahAudioUrl] = useState('');
  const [segments, setSegments] = useState<Record<string, any>>({});
  
  const [sleepTimerEnd, setSleepTimerEnd] = useState<number | null>(null);
  const [audioVersion, setAudioVersion] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isInitialLoad = useRef(true);
  const timeUpdateThrottle = useRef(0);
  const sleepTimerIntervalRef = useRef<number | null>(null);

  const isNative = Capacitor.isNativePlatform();

  const setSleepTimer = (minutes: number) => {
    setSleepTimerEnd(Date.now() + minutes * 60 * 1000);
  };

  const clearSleepTimer = () => {
    setSleepTimerEnd(null);
  };

  useEffect(() => {
    if (sleepTimerEnd) {
      sleepTimerIntervalRef.current = window.setInterval(() => {
        if (Date.now() >= sleepTimerEnd) {
          setIsPlaying(false);
          setSleepTimerEnd(null);
        }
      }, 1000);
    } else if (sleepTimerIntervalRef.current) {
      clearInterval(sleepTimerIntervalRef.current);
      sleepTimerIntervalRef.current = null;
    }

    return () => {
      if (sleepTimerIntervalRef.current) {
        clearInterval(sleepTimerIntervalRef.current);
      }
    };
  }, [sleepTimerEnd]);

  // Native Audio Setup
  useEffect(() => {
    if (!isNative) return;

    NativeAudio.configure({
      focus: true,
      background: true
    }).catch(console.error);

    let timeListener: any;
    let completeListener: any;
    let stateListener: any;

    const setupListeners = async () => {
      timeListener = await NativeAudio.addListener('currentTime', (state) => {
        if (state.assetId === ASSET_ID) {
          setProgress(state.currentTime);
          const now = Date.now();
          if (now - timeUpdateThrottle.current > 5000) {
            window.localStorage.setItem(TIME_STORAGE_KEY, String(state.currentTime));
            timeUpdateThrottle.current = now;
          }
        }
      });

      completeListener = await NativeAudio.addListener('complete', (state) => {
        if (state.assetId === ASSET_ID) {
          if (isLooping) {
            NativeAudio.play({ assetId: ASSET_ID }).catch(console.error);
          } else {
            playNext();
          }
        }
      });

      stateListener = await NativeAudio.addListener('playbackState', (state) => {
        if (state.assetId === ASSET_ID) {
          if (state.duration) setDuration(state.duration);
          if (state.reason === 'remotePlay' || state.reason === 'play') setIsPlaying(true);
          else if (state.reason === 'remotePause' || state.reason === 'pause') setIsPlaying(false);
          else if (state.reason === 'remoteNext') playNext();
          else if (state.reason === 'remotePrevious') playPrev();
        }
      });
    };

    setupListeners();

    return () => {
      if (timeListener) timeListener.remove();
      if (completeListener) completeListener.remove();
      if (stateListener) stateListener.remove();
    };
  }, [isNative, isLooping]);

  // Web Audio Setup
  useEffect(() => {
    if (isNative) return;

    if (!audioRef.current && typeof window !== 'undefined') {
      audioRef.current = new Audio();
      const storedTime = window.localStorage.getItem(TIME_STORAGE_KEY);
      if (storedTime) {
        setProgress(Number(storedTime));
      }
    }

    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setProgress(audio.currentTime);
      if (!duration || duration === 0 || isNaN(duration)) {
         setDuration(audio.duration || 0);
      }
      const now = Date.now();
      if (now - timeUpdateThrottle.current > 5000) {
        window.localStorage.setItem(TIME_STORAGE_KEY, String(audio.currentTime));
        timeUpdateThrottle.current = now;
      }
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      if (isInitialLoad.current) {
        const storedTime = window.localStorage.getItem(TIME_STORAGE_KEY);
        if (storedTime && audio.duration > Number(storedTime)) {
          audio.currentTime = Number(storedTime);
        }
        isInitialLoad.current = false;
      }
    };

    const onEnded = () => {
      if (isLooping) {
         audio.currentTime = 0;
         audio.play().catch(console.error);
      } else {
         playNext();
      }
    };
    
    const onPause = () => {
       setIsPlaying(false);
       window.localStorage.setItem(TIME_STORAGE_KEY, String(audio.currentTime));
    };
    
    const onPlay = () => setIsPlaying(true);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('play', onPlay);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('play', onPlay);
    };
  }, [isNative, isLooping, duration]);

  // Fetch audio data
  useEffect(() => {
    let isActive = true;
    const fetchAudioData = async () => {
        let surahData = null;
        let segmentsData = {};

        try {
          const [surahRes, segmentsRes] = await Promise.all([
            fetch(`/recitations/${selectedReciterId}/surah.json`),
            fetch(`/recitations/${selectedReciterId}/segments.json`),
          ]);
          if (surahRes.ok) surahData = await surahRes.json();
          if (segmentsRes.ok) segmentsData = await segmentsRes.json();
        } catch (err) {
          console.warn("Offline or failed to fetch metadata, trying cache fallback");
        }

        if (!isActive) return;

        // Check if we have a downloaded version
        const cached = await findCachedReciterForSurah(currentSurahId, selectedReciterId);
        
        if (cached) {
            if (isNative) {
                const nativeUri = await getNativeAudioUri(cached.cachedUrl);
                if (nativeUri) {
                    setSurahAudioUrl(nativeUri);
                    if (cached.reciterId !== selectedReciterId) setSelectedReciterId(cached.reciterId);
                    setSegments(segmentsData || {});
                    return;
                }
            } else {
                const blobUrl = await getCachedAudioUrl(cached.cachedUrl);
                if (blobUrl) {
                    setSurahAudioUrl(blobUrl);
                    if (cached.reciterId !== selectedReciterId) setSelectedReciterId(cached.reciterId);
                    setSegments(segmentsData || {});
                    return;
                }
            }
        }

        // If not cached, fall back to streaming
        if (surahData) {
            const surahInfo = surahData[String(currentSurahId)];
            if (surahInfo?.audio_url) {
               setSurahAudioUrl(surahInfo.audio_url);
               setSegments(segmentsData || {});
            }
        } else {
            setSurahAudioUrl('');
            setSegments({});
            setIsPlaying(false);
            if (typeof window !== 'undefined') {
                setTimeout(() => {
                    alert('No internet connection. Please download this Surah first to listen offline.');
                }, 100);
            }
        }
    };

    fetchAudioData();

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(RECITER_STORAGE_KEY, selectedReciterId);
      window.localStorage.setItem(SURAH_STORAGE_KEY, String(currentSurahId));
      if (!isInitialLoad.current && !isNative) {
        window.localStorage.removeItem(TIME_STORAGE_KEY);
      }
    }

    return () => { isActive = false; };
  }, [currentSurahId, selectedReciterId, audioVersion]);

  // Handle URL change
  useEffect(() => {
    if (!surahAudioUrl) {
      if (isNative) {
        NativeAudio.stop({ assetId: ASSET_ID }).catch(() => {});
        NativeAudio.unload({ assetId: ASSET_ID }).catch(() => {});
      } else if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      return;
    }

    if (isNative) {
      const loadNativeAudio = async () => {
        const chapter = chapters.find(c => c.id === currentSurahId);
        const reciter = RECITER_OPTIONS.find(r => r.id === selectedReciterId);
        
        try {
          await NativeAudio.unload({ assetId: ASSET_ID }).catch(() => {});
          await NativeAudio.preload({
            assetId: ASSET_ID,
            assetPath: surahAudioUrl,
            audioChannelNum: 1,
            isUrl: true,
            title: `Surah ${chapter?.transliteration || ''}`,
            artist: reciter?.label || '',
            album: 'Quran',
            cover: 'public/icons/icon-512x512.png' // remote/local URLs
          });
          
          if (isInitialLoad.current) {
            const storedTime = window.localStorage.getItem(TIME_STORAGE_KEY);
            if (storedTime) {
               await NativeAudio.setCurrentTime({ assetId: ASSET_ID, time: Number(storedTime) }).catch(console.error);
            }
            isInitialLoad.current = false;
          } else {
             window.localStorage.removeItem(TIME_STORAGE_KEY);
          }

          if (isPlaying) {
            await NativeAudio.play({ assetId: ASSET_ID });
          }
        } catch (e) {
          console.error('Failed to load native audio:', e);
        }
      };
      loadNativeAudio();
    } else {
      if (audioRef.current) {
         audioRef.current.src = surahAudioUrl;
         audioRef.current.load();
         if (isPlaying) {
           audioRef.current.play().catch(e => {
               if (e.name !== 'AbortError') setIsPlaying(false);
           });
         }
      }
    }
  }, [surahAudioUrl]);

  // Sync play state
  useEffect(() => {
    if (!surahAudioUrl) return;
    
    if (isNative) {
      if (isPlaying) {
         NativeAudio.play({ assetId: ASSET_ID }).catch(e => setIsPlaying(false));
      } else {
         NativeAudio.pause({ assetId: ASSET_ID }).catch(() => {});
      }
    } else {
      if (audioRef.current) {
          if (isPlaying) {
              const p = audioRef.current.play();
              if (p !== undefined) {
                  p.catch(e => {
                      if (e.name !== 'AbortError') setIsPlaying(false);
                  });
              }
          } else {
              audioRef.current.pause();
          }
      }
    }
  }, [isPlaying]);

  // Update Media Session API for web lock screen controls
  useEffect(() => {
    if (!isNative && 'mediaSession' in navigator && surahAudioUrl) {
      const chapter = chapters.find(c => c.id === currentSurahId);
      const reciter = RECITER_OPTIONS.find(r => r.id === selectedReciterId);
      
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `Surah ${chapter?.transliteration || ''}`,
        artist: reciter?.label || '',
        album: 'Quran',
        artwork: [
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true));
      navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false));
      navigator.mediaSession.setActionHandler('previoustrack', playPrev);
      navigator.mediaSession.setActionHandler('nexttrack', playNext);
    }
  }, [currentSurahId, selectedReciterId, surahAudioUrl, isNative]);

  const togglePlay = () => {
    if (!surahAudioUrl) {
      setAudioVersion(v => v + 1);
      setIsPlaying(true);
      return;
    }
    if (!isPlaying && surahAudioUrl.startsWith('http') && typeof navigator !== 'undefined' && !navigator.onLine) {
       setAudioVersion(v => v + 1);
    }
    setIsPlaying(!isPlaying);
  };

  const forceReloadAudio = () => setAudioVersion(v => v + 1);

  const playNext = () => {
    if (isShuffle) {
      setCurrentSurahId(Math.floor(Math.random() * 114) + 1);
    } else {
      setCurrentSurahId(prev => (prev % 114) + 1);
    }
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentSurahId(prev => (prev === 1 ? 114 : prev - 1));
    setIsPlaying(true);
  };

  const handleSeek = (time: number) => {
    if (isNative) {
      NativeAudio.setCurrentTime({ assetId: ASSET_ID, time }).then(() => {
        setProgress(time);
        window.localStorage.setItem(TIME_STORAGE_KEY, String(time));
      }).catch(console.error);
    } else {
      if (audioRef.current) {
        audioRef.current.currentTime = time;
        setProgress(time);
        window.localStorage.setItem(TIME_STORAGE_KEY, String(time));
      }
    }
  };

  return (
    <QuranAudioContext.Provider value={{
      currentSurahId, setCurrentSurahId,
      selectedReciterId, setSelectedReciterId,
      isPlaying, setIsPlaying, togglePlay,
      progress, duration,
      isLooping, setIsLooping,
      isShuffle, setIsShuffle,
      playNext, playPrev,
      handleSeek, segments,
      sleepTimerEnd, setSleepTimer, clearSleepTimer,
      forceReloadAudio
    }}>
      {children}
    </QuranAudioContext.Provider>
  );
};

export const useQuranAudio = () => {
  const context = useContext(QuranAudioContext);
  if (context === undefined) {
    throw new Error('useQuranAudio must be used within a QuranAudioProvider');
  }
  return context;
};
