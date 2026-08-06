import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getCachedAudioUrl } from '../utils/audioCache';
import { RECITER_OPTIONS } from '../data/quranConstants';
import chapters from '../data/chapters-en.json';

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
}

const QuranAudioContext = createContext<QuranAudioContextType | undefined>(undefined);

const RECITER_STORAGE_KEY = 'nisa.quran.reciter';
const SURAH_STORAGE_KEY = 'nisa.quran.lastSurah';
const TIME_STORAGE_KEY = 'nisa.quran.lastTime';

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

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isInitialLoad = useRef(true);
  const timeUpdateThrottle = useRef(0);
  const sleepTimerIntervalRef = useRef<number | null>(null);

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

  // Initialize audio element only once
  useEffect(() => {
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
      
      // Throttle saving to localStorage to every 5 seconds
      const now = Date.now();
      if (now - timeUpdateThrottle.current > 5000) {
        window.localStorage.setItem(TIME_STORAGE_KEY, String(audio.currentTime));
        timeUpdateThrottle.current = now;
      }
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      // Restore time if this is the first load
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
  }, [isLooping, duration]);

  // Fetch audio data
  useEffect(() => {
    let isActive = true;
    const fetchAudioData = async () => {
      try {
        const [surahRes, segmentsRes] = await Promise.all([
          fetch(`/recitations/${selectedReciterId}/surah.json`),
          fetch(`/recitations/${selectedReciterId}/segments.json`),
        ]);
        
        if (!surahRes.ok || !segmentsRes.ok) return;

        const surahData = await surahRes.json();
        const segmentsData = await segmentsRes.json();

        if (!isActive) return;

        const surahInfo = surahData[String(currentSurahId)];
        if (surahInfo?.audio_url) {
           const cached = await getCachedAudioUrl(surahInfo.audio_url);
           setSurahAudioUrl(cached || surahInfo.audio_url);
           setSegments(segmentsData);
        }
      } catch (err) {
        console.error("Failed to fetch audio data", err);
      }
    };

    fetchAudioData();

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(RECITER_STORAGE_KEY, selectedReciterId);
      window.localStorage.setItem(SURAH_STORAGE_KEY, String(currentSurahId));
      if (!isInitialLoad.current) {
        window.localStorage.removeItem(TIME_STORAGE_KEY);
      }
    }

    return () => { isActive = false; };
  }, [currentSurahId, selectedReciterId]);

  // Handle URL change
  useEffect(() => {
    if (audioRef.current && surahAudioUrl) {
       audioRef.current.src = surahAudioUrl;
       audioRef.current.load();
       if (isPlaying) {
         audioRef.current.play().catch(e => {
             if (e.name !== 'AbortError') setIsPlaying(false);
         });
       }
    }
  }, [surahAudioUrl]);

  // Sync play state
  useEffect(() => {
      if (audioRef.current && surahAudioUrl) {
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
  }, [isPlaying]);

  // Update Media Session API for lock screen controls
  useEffect(() => {
    if ('mediaSession' in navigator && surahAudioUrl) {
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
  }, [currentSurahId, selectedReciterId, surahAudioUrl]);

  const togglePlay = () => {
    if (!surahAudioUrl) return;
    setIsPlaying(!isPlaying);
  };

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
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
      window.localStorage.setItem(TIME_STORAGE_KEY, String(time));
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
      sleepTimerEnd, setSleepTimer, clearSleepTimer
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
