import React, { useState } from 'react';
import { Moon, Flower2, X, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePeriodMode } from '../contexts/PeriodModeContext';
import { usePurityTracker } from '../contexts/PurityTrackerContext';
import { useProfile } from '../contexts/ProfileContext';

export default function Header() {
  const { isPeriodMode } = usePeriodMode();
  const { snapshot, setStatus, logPeriodStartToday, updateSettings } = usePurityTracker();
  const { profile } = useProfile();
  const [showPeriodPopup, setShowPeriodPopup] = useState(false);
  const [tempPeriodDays, setTempPeriodDays] = useState(snapshot.settings.periodLengthDays);
  const [tempCycleDays, setTempCycleDays] = useState(snapshot.settings.cycleLengthDays);

  const salam = profile.language === 'ur' ? 'السلام علیکم،' : 'Assalamu Alaikum,';

  const handleToggle = () => {
    if (!isPeriodMode) {
      // Turning ON → show popup to configure haiz days, then set haiz
      setTempPeriodDays(snapshot.settings.periodLengthDays);
      setTempCycleDays(snapshot.settings.cycleLengthDays);
      setShowPeriodPopup(true);
    } else {
      // Turning OFF → set to taharah (pure)
      setStatus('taharah');
    }
  };

  const handleConfirmPeriod = () => {
    // Save the settings first
    updateSettings({
      periodLengthDays: tempPeriodDays,
      cycleLengthDays: tempCycleDays,
    });
    // Log period start today (sets haiz + enables period mode)
    logPeriodStartToday();
    setShowPeriodPopup(false);
  };

  return (
    <>
      <header className="flex items-center justify-between pt-3 pb-6 px-6">
        <div>
          <h1
            className={`text-2xl font-semibold text-text-primary tracking-tight ${
              profile.language === 'ur' ? 'font-arabic' : ''
            }`}
            dir={profile.language === 'ur' ? 'rtl' : 'ltr'}
          >
            {salam}
          </h1>
          <h2
            className={`text-2xl font-medium text-text-secondary ${profile.language === 'ur' ? 'font-arabic' : ''}`}
            dir={profile.language === 'ur' ? 'rtl' : 'ltr'}
          >
            {profile.name}
          </h2>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button
            onClick={handleToggle}
            className={`relative w-14 h-8 rounded-full transition-colors duration-300 ease-in-out flex items-center px-1 ${
              isPeriodMode ? 'bg-theme-rose' : 'bg-theme-surface-dark'
            }`}
            aria-label="Toggle Period Mode"
          >
            <motion.div
              animate={{ x: isPeriodMode ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-6 h-6 bg-theme-surface-card rounded-full shadow-sm flex items-center justify-center p-[4px]"
            >
              {isPeriodMode ? (
                <Flower2 className="w-full h-full text-theme-rose" />
              ) : (
                <Moon className="w-full h-full text-text-muted" />
              )}
            </motion.div>
          </button>
          <span className="text-[9px] uppercase font-bold tracking-wider text-text-muted mt-0.5">
            Period Mode
          </span>
        </div>
      </header>

      {/* ── Period Mode Popup ── */}
      <AnimatePresence>
        {showPeriodPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm px-6"
            onClick={() => setShowPeriodPopup(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="w-full max-w-[340px] bg-theme-surface-elevated rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden border border-theme-border"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 pt-6 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-[17px] font-bold text-text-primary tracking-tight">
                    Start Period Mode
                  </h3>
                  <p className="text-[12px] text-text-muted mt-0.5">
                    Configure your cycle settings
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPeriodPopup(false)}
                  className="w-8 h-8 rounded-full bg-theme-surface-dark flex items-center justify-center active:scale-95 transition-all"
                >
                  <X className="w-4 h-4 text-text-tertiary" />
                </button>
              </div>

              {/* Settings */}
              <div className="px-6 pb-2 flex flex-col gap-4">
                {/* Haiz Days */}
                <div className="flex items-center justify-between bg-theme-rose/10 rounded-2xl px-4 py-3 border border-theme-rose/15">
                  <div>
                    <p className="text-[13px] font-semibold text-text-primary">Haiz Duration</p>
                    <p className="text-[11px] text-text-muted">Period length in days</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTempPeriodDays((p) => Math.max(3, p - 1))}
                      className="w-8 h-8 rounded-full bg-theme-surface-card border border-theme-border flex items-center justify-center active:scale-95 transition-all shadow-sm"
                    >
                      <Minus className="w-3.5 h-3.5 text-text-secondary" />
                    </button>
                    <span className="text-[18px] font-bold text-text-primary w-8 text-center tabular-nums">
                      {tempPeriodDays}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTempPeriodDays((p) => Math.min(15, p + 1))}
                      className="w-8 h-8 rounded-full bg-theme-surface-card border border-theme-border flex items-center justify-center active:scale-95 transition-all shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5 text-text-secondary" />
                    </button>
                  </div>
                </div>

                {/* Cycle Days */}
                <div className="flex items-center justify-between bg-theme-accent/10 rounded-2xl px-4 py-3 border border-theme-accent/15">
                  <div>
                    <p className="text-[13px] font-semibold text-text-primary">Cycle Length</p>
                    <p className="text-[11px] text-text-muted">Full cycle in days</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTempCycleDays((p) => Math.max(21, p - 1))}
                      className="w-8 h-8 rounded-full bg-theme-surface-card border border-theme-border flex items-center justify-center active:scale-95 transition-all shadow-sm"
                    >
                      <Minus className="w-3.5 h-3.5 text-text-secondary" />
                    </button>
                    <span className="text-[18px] font-bold text-text-primary w-8 text-center tabular-nums">
                      {tempCycleDays}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTempCycleDays((p) => Math.min(40, p + 1))}
                      className="w-8 h-8 rounded-full bg-theme-surface-card border border-theme-border flex items-center justify-center active:scale-95 transition-all shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5 text-text-secondary" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 pt-4 pb-6 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowPeriodPopup(false)}
                  className="flex-1 py-3 rounded-2xl bg-theme-surface-dark text-[13px] font-semibold text-text-secondary active:scale-[0.98] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPeriod}
                  className="flex-1 py-3 rounded-2xl bg-theme-rose text-[13px] font-bold text-white active:scale-[0.98] transition-all shadow-sm"
                >
                  Start Haiz
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
