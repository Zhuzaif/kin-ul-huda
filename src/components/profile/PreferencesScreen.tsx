import React, { useState, useEffect } from 'react';
import { MapPin, Check, User, Bell, BellRing, Globe, Scale, ChevronDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
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
  const [isCalcOpen, setIsCalcOpen] = useState(false);

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

            {/* Adhan Alerts Row */}
            <div className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-theme-surface-dark flex items-center justify-center shrink-0">
                  <BellRing className="w-5 h-5 text-[#F0A500]" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-text-primary">Adhan Alerts</p>
                  <p className="text-[12px] text-text-tertiary">Audio call to prayer</p>
                </div>
              </div>
              <button
                type="button"
                onClick={async () => {
                  const prefs = profile.notificationPrefs || { adhan: false, reminders: false };
                  const nextAdhan = !prefs.adhan;
                  if (nextAdhan && Capacitor.isNativePlatform()) {
                    try {
                      await LocalNotifications.requestPermissions();
                    } catch (e) {
                      console.error('Permission request failed', e);
                    }
                  }
                  updateProfile({
                    notificationPrefs: { ...prefs, adhan: nextAdhan },
                    prayerReminders: nextAdhan || prefs.reminders,
                  });
                }}
                className={`relative w-14 h-8 rounded-full transition-colors flex-shrink-0 border ${
                  profile.notificationPrefs?.adhan ? 'bg-theme-accent border-theme-accent' : 'bg-theme-surface-input border-theme-border'
                }`}
                aria-label="Toggle Adhan alerts"
              >
                <span
                  className={`absolute top-[2.5px] left-[3px] w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${
                    profile.notificationPrefs?.adhan ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="h-[1px] bg-theme-divider mx-4" />

            {/* Daily Reminders Row */}
            <div className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-theme-surface-dark flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5 text-theme-accent" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-text-primary">Daily Reminders</p>
                  <p className="text-[12px] text-text-tertiary">Alert 15 mins before salah</p>
                </div>
              </div>
              <button
                type="button"
                onClick={async () => {
                  const prefs = profile.notificationPrefs || { adhan: false, reminders: false };
                  const nextReminders = !prefs.reminders;
                  if (nextReminders && Capacitor.isNativePlatform()) {
                    try {
                      await LocalNotifications.requestPermissions();
                    } catch (e) {
                      console.error('Permission request failed', e);
                    }
                  }
                  updateProfile({
                    notificationPrefs: { ...prefs, reminders: nextReminders },
                    prayerReminders: prefs.adhan || nextReminders,
                  });
                }}
                className={`relative w-14 h-8 rounded-full transition-colors flex-shrink-0 border ${
                  profile.notificationPrefs?.reminders ? 'bg-theme-accent border-theme-accent' : 'bg-theme-surface-input border-theme-border'
                }`}
                aria-label="Toggle Daily Reminders"
              >
                <span
                  className={`absolute top-[2.5px] left-[3px] w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${
                    profile.notificationPrefs?.reminders ? 'translate-x-6' : 'translate-x-0'
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
              
              <div className="ml-14 mt-1 flex flex-col">
                <button
                  type="button"
                  onClick={() => setIsCalcOpen(!isCalcOpen)}
                  className={`w-full flex items-center justify-between bg-theme-surface-input border border-theme-border px-4 py-3 text-[14px] font-semibold text-text-primary transition-all ${
                    isCalcOpen ? 'rounded-t-xl border-b-0' : 'rounded-xl'
                  }`}
                >
                  <span className="truncate pr-4 text-left">
                    {CALCULATION_METHOD_OPTIONS.find((o) => o.id === profile.calculationMethod)?.label || 'Select Method'}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-text-muted shrink-0 transition-transform ${isCalcOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isCalcOpen && (
                  <div className="flex flex-col bg-theme-surface-card border border-theme-border rounded-b-xl overflow-hidden divide-y divide-theme-divider">
                    {CALCULATION_METHOD_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          updateProfile({ calculationMethod: opt.id as CalculationMethodId });
                          setIsCalcOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-[13px] font-semibold transition-colors hover:bg-theme-surface-alt ${
                          profile.calculationMethod === opt.id ? 'bg-theme-accent/5 text-theme-accent' : 'text-text-primary'
                        }`}
                      >
                        {opt.label} 
                        <span className="block text-[11px] text-text-tertiary font-normal mt-0.5">{opt.region}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>

      </div>
    </ProfileSubScreen>
  );
}
