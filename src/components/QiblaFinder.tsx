import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Compass, AlertCircle, MapPin, CheckCircle2 } from 'lucide-react';
import { usePeriodMode } from '../contexts/PeriodModeContext';

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
  
  const [started, setStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [qiblaBearing, setQiblaBearing] = useState<number | null>(null);
  const [heading, setHeading] = useState<number | null>(null);

  const requestPermissionsAndStart = async () => {
    setError(null);
    setStarted(true);

    // 1. Get Location
    const fetchIPLocation = async (errMessage: string) => {
      try {
        const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
        if (res.ok) {
          const data = await res.json();
          const lat = parseFloat(data.latitude);
          const lng = parseFloat(data.longitude);
          setLocation({ lat, lng });
          const bearing = calculateQibla(lat, lng);
          setQiblaBearing(bearing);
          return; // Success
        }
      } catch (e) {
        console.error("IP fallback failed:", e);
      }
      setError(`Location error: ${errMessage}. Please enable location services.`);
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setLocation({ lat, lng });
          const bearing = calculateQibla(lat, lng);
          setQiblaBearing(bearing);
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
    <div className={`h-full flex flex-col ${isPeriodMode ? 'bg-[#FCF5F5]' : 'bg-warm-beige'}`}>
      <div className="flex items-center justify-between px-6 pt-12 pb-6">
        <button 
          onClick={onBack}
          className="w-12 h-12 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/80 transition-colors shadow-sm"
        >
          <ChevronLeft className={`w-6 h-6 ${isPeriodMode ? 'text-soft-pink-dark' : 'text-[#2B604A]'}`} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Qibla Finder</h1>
        <div className="w-12 h-12" /> {/* Spacer */}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        {!started ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center max-w-sm"
          >
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg ${isPeriodMode ? 'bg-gradient-to-br from-[#FCE7D8] to-soft-pink' : 'bg-gradient-to-br from-soft-mint to-[#D1E6DA]'}`}>
              <Compass className={`w-12 h-12 ${isPeriodMode ? 'text-soft-pink-dark' : 'text-[#2B604A]'}`} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Find Qibla Direction</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              To accurately find the Qibla, we need access to your device's location and compass sensors. Please hold your phone flat.
            </p>
            <button 
              onClick={requestPermissionsAndStart}
              className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg active:scale-[0.98] transition-transform ${isPeriodMode ? 'bg-soft-pink-dark' : 'bg-[#1F4535]'}`}
            >
              Start Calibration
            </button>
          </motion.div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 p-6 rounded-[32px] flex flex-col items-center text-center"
          >
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-lg font-bold text-red-900 mb-2">Calibration Error</h3>
            <p className="text-red-700 text-sm">{error}</p>
            <button 
              onClick={requestPermissionsAndStart}
              className="mt-6 px-6 py-2 bg-red-100 text-red-800 rounded-full font-semibold hover:bg-red-200 transition-colors"
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
                className="absolute inset-0 rounded-full border-[8px] border-white/50 shadow-2xl flex items-center justify-center"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)',
                  rotate: heading ? -heading : 0
                }}
                transition={{ type: "spring", damping: 30, stiffness: 100 }}
              >
                {/* N, S, E, W Markers */}
                <div className="absolute top-4 font-bold text-gray-400">N</div>
                <div className="absolute bottom-4 font-bold text-gray-400">S</div>
                <div className="absolute right-4 font-bold text-gray-400">E</div>
                <div className="absolute left-4 font-bold text-gray-400">W</div>

                {/* Qibla Marker (Kaaba) on the dial */}
                {qiblaBearing !== null && (
                  <div 
                    className="absolute w-full h-full flex justify-center"
                    style={{ transform: `rotate(${qiblaBearing}deg)` }}
                  >
                    <div className={`-mt-6 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-colors duration-500 ${perfectlyAligned ? 'bg-[#1F4535] scale-110' : 'bg-gray-800'}`}>
                      <div className="w-4 h-4 bg-yellow-500 rounded-sm" /> {/* Simple Kaaba representation */}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Fixed Phone Indicator */}
              <div className="absolute z-10 flex flex-col items-center">
                <div className="w-1 h-6 bg-red-500 rounded-t-full mb-1 shadow-sm" />
                <div className="w-12 h-20 border-4 border-gray-800 rounded-2xl relative flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-300 rounded-full absolute top-2" />
                </div>
              </div>
            </div>

            {/* Status Information */}
            <div className={`w-full p-6 rounded-[32px] transition-colors duration-500 ${perfectlyAligned ? (isPeriodMode ? 'bg-[#FCE7D8]' : 'bg-soft-mint') : 'bg-white/60'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span className="font-semibold text-sm">Location</span>
                </div>
                {location ? (
                  <span className="text-sm font-medium text-gray-800">
                    {location.lat.toFixed(2)}°, {location.lng.toFixed(2)}°
                  </span>
                ) : (
                  <span className="text-sm font-medium text-gray-400 animate-pulse">Acquiring...</span>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Compass className="w-5 h-5" />
                  <span className="font-semibold text-sm">Heading</span>
                </div>
                {heading !== null ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold tabular-nums text-gray-800">
                      {Math.round(heading)}°
                    </span>
                    {perfectlyAligned && (
                      <CheckCircle2 className={`w-5 h-5 ${isPeriodMode ? 'text-soft-pink-dark' : 'text-[#1F4535]'}`} />
                    )}
                  </div>
                ) : (
                  <span className="text-sm font-medium text-gray-400 animate-pulse">Calibrating...</span>
                )}
              </div>

              {perfectlyAligned && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 text-center font-bold ${isPeriodMode ? 'text-[#D98A5B]' : 'text-[#1F4535]'}`}
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
