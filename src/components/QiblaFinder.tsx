import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Compass, AlertCircle, MapPin, CheckCircle2 } from 'lucide-react';
import { usePeriodMode } from '../contexts/PeriodModeContext';
import { useProfile } from '../contexts/ProfileContext';
import { supabase } from '../lib/supabase';

const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

function calculateQibla(latitude: number, longitude: number) {
  const latR = latitude * (Math.PI / 180);
  const lonR = longitude * (Math.PI / 180);
  const kaabaLatR = KAABA_LAT * (Math.PI / 180);
  const kaabaLonR = KAABA_LNG * (Math.PI / 180);
  
  const y = Math.sin(kaabaLonR - lonR);
  const x = Math.cos(latR) * Math.tan(kaabaLatR) - Math.sin(latR) * Math.cos(kaabaLonR - lonR);
  
  let qibla = Math.atan2(y, x) * (180 / Math.PI);
  return (qibla + 360) % 360;
}

export default function QiblaFinder({ onBack }: { onBack: () => void }) {
  const { isPeriodMode } = usePeriodMode();
  const { profile, updateProfile } = useProfile();
  
  const [started, setStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [qiblaBearing, setQiblaBearing] = useState<number | null>(null);
  const [heading, setHeading] = useState<number | null>(null);

  const requestPermissionsAndStart = async () => {
    setError(null);
    setStarted(true);

    const handleLocationAcquired = async (lat: number, lng: number) => {
      setLocation({ lat, lng });
      const bearing = calculateQibla(lat, lng);
      setQiblaBearing(bearing);
      
      updateProfile({ locationCoords: { lat, lng } });
      if (profile.userId) {
        try {
          await supabase
            .from('nisa_users')
            .update({ country: `${lat},${lng}` })
            .eq('id', profile.userId);
        } catch (e) {
          console.error('Failed to update location on server:', e);
        }
      }
    };

    const fetchIPLocation = async (errMessage: string) => {
      try {
        const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
        if (res.ok) {
          const data = await res.json();
          await handleLocationAcquired(parseFloat(data.latitude), parseFloat(data.longitude));
          return; // Success
        }
      } catch (e) {
        console.error("geojs fallback failed:", e);
      }
      
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          if (data.latitude && data.longitude) {
            await handleLocationAcquired(parseFloat(data.latitude), parseFloat(data.longitude));
            return; // Success
          }
        }
      } catch (e) {
        console.error("ipapi fallback failed:", e);
      }
      
      setError(`Location error: ${errMessage}. Please enable location services.`);
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handleLocationAcquired(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          fetchIPLocation(err.message);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      fetchIPLocation("Geolocation is not supported by this browser.");
    }

    // 2. Get Device Orientation (Compass)
    const startCompass = () => {
      const handleOrientation = (event: DeviceOrientationEvent) => {
        let compassHeading = null;
        
        // iOS WebKit
        if ((event as any).webkitCompassHeading !== undefined) {
          compassHeading = (event as any).webkitCompassHeading;
        } 
        // Android absolute orientation
        else if (event.absolute && event.alpha !== null) {
          compassHeading = 360 - event.alpha;
        }

        if (compassHeading !== null) {
          // Smooth the heading slightly or just set it
          setHeading(compassHeading);
        }
      };

      if ('ondeviceorientationabsolute' in (window as any)) {
        (window as any).addEventListener('deviceorientationabsolute', handleOrientation, true);
      } else {
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    };

    // iOS 13+ requires explicit permission via a user gesture
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          startCompass();
        } else {
          setError("Compass permission denied. Please allow it in settings.");
        }
      } catch (err) {
        setError("Error requesting compass permission.");
      }
    } else {
      // Non-iOS 13+ devices
      startCompass();
    }
  };

  const isAligned = heading !== null && qiblaBearing !== null && Math.abs((heading - qiblaBearing + 360) % 360) < 3;
  const isAlignedOrFlipped = heading !== null && qiblaBearing !== null && Math.abs((heading - qiblaBearing + 360) % 360) > 357;
  const perfectlyAligned = isAligned || isAlignedOrFlipped;

  useEffect(() => {
    if (perfectlyAligned && 'vibrate' in navigator) {
      // Trigger short haptic vibration when aligned
      navigator.vibrate(50);
    }
  }, [perfectlyAligned]);

  return (
    <div className="h-full flex flex-col bg-theme-surface">
      <div className="flex items-center justify-between px-6 pt-3 pb-6">
        <button 
          onClick={onBack}
          className="w-12 h-12 bg-theme-surface-card/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-theme-surface-card/80 transition-colors shadow-sm"
        >
          <ChevronLeft className={`w-6 h-6 ${isPeriodMode ? 'text-theme-rose' : 'text-theme-accent'}`} />
        </button>
        <h1 className="text-xl font-bold text-text-primary">Qibla Finder</h1>
        <div className="w-12 h-12" /> {/* Spacer */}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        {!started ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center max-w-sm"
          >
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg bg-theme-accent-soft">
              <Compass className={`w-12 h-12 ${isPeriodMode ? 'text-theme-rose' : 'text-theme-accent'}`} />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Find Qibla Direction</h2>
            <p className="text-text-secondary mb-8 leading-relaxed">
              To accurately find the Qibla, we need access to your device's location and compass sensors. Please hold your phone flat.
            </p>
            <button 
              onClick={requestPermissionsAndStart}
              className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg active:scale-[0.98] transition-transform ${isPeriodMode ? 'bg-theme-rose' : 'bg-theme-accent-strong'}`}
            >
              Start Calibration
            </button>
          </motion.div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 p-6 rounded-[32px] flex flex-col items-center text-center border border-red-500/20"
          >
            <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
            <h3 className="text-lg font-bold text-text-primary mb-2">Calibration Error</h3>
            <p className="text-text-secondary text-sm">{error}</p>
            <button
              onClick={requestPermissionsAndStart}
              className="mt-6 px-6 py-2 bg-red-500/15 text-red-400 rounded-full font-semibold hover:bg-red-500/25 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center w-full max-w-md">
            
            {/* Compass Dial Container */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 mb-12 flex items-center justify-center">
              
              {/* The Dial */}
              <motion.div 
                className="absolute inset-0 rounded-full border-[8px] border-theme-border shadow-2xl flex items-center justify-center"
                style={{
                  background: 'radial-gradient(circle, var(--color-theme-surface-elevated) 0%, var(--color-theme-surface-card) 100%)',
                  rotate: heading ? -heading : 0
                }}
                transition={{ type: "spring", damping: 30, stiffness: 100 }}
              >
                {/* N, S, E, W Markers */}
                <div className="absolute top-4 font-bold text-text-muted">N</div>
                <div className="absolute bottom-4 font-bold text-text-muted">S</div>
                <div className="absolute right-4 font-bold text-text-muted">E</div>
                <div className="absolute left-4 font-bold text-text-muted">W</div>

                {/* Qibla Marker (Kaaba) on the dial */}
                {qiblaBearing !== null && (
                  <div 
                    className="absolute w-full h-full flex justify-center"
                    style={{ transform: `rotate(${qiblaBearing}deg)` }}
                  >
                    <div className={`-mt-8 w-12 h-12 flex items-center justify-center transition-transform duration-500 ${perfectlyAligned ? 'scale-125 drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]' : 'drop-shadow-md'}`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="#1C1C1C"/>
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#2A2A2A"/>
                        <path d="M2 7V17L12 22V12L2 7Z" fill="#151515"/>
                        <path d="M22 7V17L12 22V12L22 7Z" fill="#1C1C1C"/>
                        <path d="M2 9.5L12 14.5L22 9.5V11L12 16L2 11V9.5Z" fill="#D4AF37"/>
                      </svg>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Fixed Phone Indicator */}
              <div className="absolute z-10 flex flex-col items-center">
                <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-red-500" />
                <div className="w-1 h-5 bg-red-500 mb-1 shadow-sm" />
                <div className="w-12 h-20 border-4 border-text-primary rounded-2xl relative flex items-center justify-center bg-theme-surface-card/50 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-text-tertiary rounded-full absolute top-2" />
                </div>
              </div>
            </div>

            {/* Status Information */}
            <div className={`w-full p-6 rounded-[32px] transition-colors duration-500 ${perfectlyAligned ? (isPeriodMode ? 'bg-theme-orange/15' : 'bg-theme-accent-soft') : 'bg-theme-surface-card/60'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-text-secondary">
                  <MapPin className="w-5 h-5" />
                  <span className="font-semibold text-sm">Location</span>
                </div>
                {location ? (
                  <span className="text-sm font-medium text-text-primary">
                    {location.lat.toFixed(2)}°, {location.lng.toFixed(2)}°
                  </span>
                ) : (
                  <span className="text-sm font-medium text-text-muted animate-pulse">Acquiring...</span>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Compass className="w-5 h-5" />
                  <span className="font-semibold text-sm">Heading</span>
                </div>
                {heading !== null ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold tabular-nums text-text-primary">
                      {Math.round(heading)}°
                    </span>
                    {perfectlyAligned && (
                      <CheckCircle2 className={`w-5 h-5 ${isPeriodMode ? 'text-theme-rose' : 'text-theme-accent'}`} />
                    )}
                  </div>
                ) : (
                  <span className="text-sm font-medium text-text-muted animate-pulse">Calibrating...</span>
                )}
              </div>

              {perfectlyAligned && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 text-center font-bold ${isPeriodMode ? 'text-theme-orange' : 'text-theme-accent'}`}
                >
                  You are facing the Qibla
                </motion.div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
