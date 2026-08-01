import React, { useState, useEffect } from 'react';
import { MapPin, Check, User, Bell, Globe, Scale, ChevronDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ProfileSubScreen from './ProfileSubScreen';
import { useProfile } from '../../contexts/ProfileContext';
import {
  MADHAB_OPTIONS,
  CALCULATION_METHOD_OPTIONS,
} from '../../utils/prayerTimes';
import type { CalculationMethodId, Madhab } from '../../types/profile';

interface PreferencesScreenProps {
  onBack: () => void;
}

export default function PreferencesScreen({ onBack }: PreferencesScreenProps) {
  const { profile, updateProfile } = useProfile();
  const [locationStatus, setLocationStatus] = useState<PermissionState | 'unknown'>('unknown');

  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationStatus(result.state);
        result.onchange = () => {
          setLocationStatus(result.state);
        };
      }).catch(() => {
        setLocationStatus('unknown');
      });
    }
  }, []);

  const handleUpdateLocation = async () => {
    const handleLocationAcquired = async (lat: number, lng: number) => {
      const coords = { lat, lng };
      updateProfile({ locationCoords: coords });

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

    const fetchIPLocation = async () => {
      try {
        const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
        if (res.ok) {
          const data = await res.json();
          await handleLocationAcquired(parseFloat(data.latitude), parseFloat(data.longitude));
          return true;
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
            return true;
          }
        }
      } catch (e) {
        console.error("ipapi fallback failed:", e);
      }
      
      return false;
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await handleLocationAcquired(position.coords.latitude, position.coords.longitude);
        },
        async (error) => {
          const fallbackSuccess = await fetchIPLocation();
          if (!fallbackSuccess) {
            if (error.code === error.PERMISSION_DENIED) {
               alert("Please enable location permissions in your browser or device settings.");
            } else {
               alert("Failed to get location. Please try again.");
            }
          }
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      const fallbackSuccess = await fetchIPLocation();
      if (!fallbackSuccess) {
        alert("Geolocation is not supported by your browser.");
      }
    }
  };

  return (
    <ProfileSubScreen
      title="Settings"
      subtitle="Manage your profile & preferences"
      onBack={onBack}
    >
      <div className="flex flex-col gap-6 pb-8">
        
        {/* GROUP 1: PROFILE & NOTIFICATIONS */}
        <section>
          <h3 className="px-2 text-[13px] font-bold text-text-muted uppercase tracking-wider mb-2">Account</h3>
          <div className="bg-theme-surface-card rounded-3xl border border-theme-border shadow-sm overflow-hidden flex flex-col">
            
            {/* Display Name Row */}
            <div className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-theme-surface-dark flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-theme-accent" />
              </div>
              <div className="flex-1">
                <label className="text-[12px] font-medium text-text-tertiary block">Display Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => updateProfile({ name: e.target.value.slice(0, 32) })}
                  onBlur={() => updateProfile({ name: profile.name.trim() })}
                  placeholder="Your name"
                  className="w-full bg-transparent text-[15px] font-semibold text-text-primary focus:outline-none py-1 placeholder:text-text-muted"
                />
              </div>
            </div>

            <div className="h-[1px] bg-theme-divider mx-4" />

            {/* Prayer Reminders Row */}
            <div className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-theme-surface-dark flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5 text-theme-accent" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-text-primary">Prayer Reminders</p>
                  <p className="text-[12px] text-text-tertiary">Alerts before the next salah</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => updateProfile({ prayerReminders: !profile.prayerReminders })}
                className={`relative w-14 h-8 rounded-full transition-colors flex-shrink-0 ${
                  profile.prayerReminders ? 'bg-theme-accent' : 'bg-theme-surface-dark'
                }`}
                aria-label="Toggle prayer reminders"
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-theme-surface-card rounded-full shadow transition-transform ${
                    profile.prayerReminders ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            
          </div>
        </section>

        {/* GROUP 2: PRAYER SETTINGS */}
        <section>
          <h3 className="px-2 text-[13px] font-bold text-text-muted uppercase tracking-wider mb-2">Prayer Settings</h3>
          <div className="bg-theme-surface-card rounded-3xl border border-theme-border shadow-sm overflow-hidden flex flex-col">
            
            {/* Location Row */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-theme-surface-dark flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-theme-accent" />
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-text-primary">Location</p>
                    <p className="text-[12px] text-text-tertiary">
                      {profile.locationCoords ? 'Location is set' : 'Location not set'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleUpdateLocation}
                  className="bg-theme-accent/10 text-theme-accent px-4 py-2 rounded-xl text-[13px] font-bold hover:bg-theme-accent/20 transition-colors"
                >
                  Update
                </button>
              </div>
              <p className="text-[12px] text-text-muted ml-14">Required for accurate prayer times & Qibla.</p>
            </div>

            <div className="h-[1px] bg-theme-divider mx-4" />

            {/* Madhab Row */}
            <div className="p-4">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-full bg-theme-surface-dark flex items-center justify-center shrink-0">
                  <Scale className="w-5 h-5 text-theme-accent" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-text-primary">Asr Time (Madhab)</p>
                  <p className="text-[12px] text-text-tertiary">Only affects Asr time.</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 ml-14 mt-1">
                {MADHAB_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => updateProfile({ madhab: opt.id as Madhab })}
                    className={`flex-1 py-2 px-3 text-[13px] font-semibold rounded-xl border transition-all ${
                      profile.madhab === opt.id 
                        ? 'bg-theme-accent text-white border-theme-accent shadow-sm'
                        : 'bg-theme-surface-card text-text-secondary border-theme-border hover:bg-theme-surface-alt'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[1px] bg-theme-divider mx-4" />

            {/* Calculation Method Row */}
            <div className="p-4">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-full bg-theme-surface-dark flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-theme-accent" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-text-primary">Calculation Method</p>
                  <p className="text-[12px] text-text-tertiary">Regional authority for Fajr & Isha.</p>
                </div>
              </div>
              
              <div className="ml-14 mt-1 relative">
                <select
                  value={profile.calculationMethod}
                  onChange={(e) => updateProfile({ calculationMethod: e.target.value as CalculationMethodId })}
                  className="w-full appearance-none bg-theme-surface-input border border-theme-border rounded-xl px-4 py-3 pr-10 text-[14px] font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/20 transition-all"
                >
                  {CALCULATION_METHOD_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label} ({opt.region})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="w-5 h-5 text-text-muted" />
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>
    </ProfileSubScreen>
  );
}
