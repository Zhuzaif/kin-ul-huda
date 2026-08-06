import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Type, Minus, Plus } from 'lucide-react';
import { buttonTap } from '../lib/motion';

export interface TextSettings {
  arabicFontSize: number;
  translationFontSize: number;
  showTranslation: boolean;
}

export const DEFAULT_TEXT_SETTINGS: TextSettings = {
  arabicFontSize: 26,
  translationFontSize: 13.5,
  showTranslation: true,
};

interface TextSettingsOverlayProps {
  settings: TextSettings;
  onSettingsChange: (settings: TextSettings) => void;
  onClose: () => void;
}

export default function TextSettingsOverlay({ settings, onSettingsChange, onClose }: TextSettingsOverlayProps) {
  const updateSetting = <K extends keyof TextSettings>(key: K, value: TextSettings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex flex-col justify-end bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full bg-theme-surface rounded-t-3xl border-t border-theme-border shadow-2xl overflow-hidden"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-theme-border/50 bg-theme-surface-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-theme-accent-soft text-theme-accent flex items-center justify-center">
                <Type size={20} />
              </div>
              <h2 className="text-lg font-bold text-text-primary tracking-tight">Reading Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-theme-surface hover:bg-theme-surface-elevated text-text-secondary transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-8 pb-12">
            {/* Arabic Font Size */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-text-secondary tracking-wide uppercase">Arabic Size</h3>
                <span className="text-xs font-medium text-theme-gold">{settings.arabicFontSize}px</span>
              </div>
              <div className="flex items-center gap-4">
                <motion.button
                  whileTap={buttonTap}
                  onClick={() => updateSetting('arabicFontSize', Math.max(18, settings.arabicFontSize - 2))}
                  className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-theme-surface-card border border-theme-border text-text-primary shadow-sm hover:bg-theme-surface-elevated"
                >
                  <Minus size={18} />
                </motion.button>
                <div className="flex-1 relative">
                  <input
                    type="range"
                    min="18"
                    max="60"
                    step="2"
                    value={settings.arabicFontSize}
                    onChange={(e) => updateSetting('arabicFontSize', Number(e.target.value))}
                    className="w-full accent-theme-accent h-2 bg-theme-surface-input rounded-full appearance-none outline-none"
                  />
                </div>
                <motion.button
                  whileTap={buttonTap}
                  onClick={() => updateSetting('arabicFontSize', Math.min(60, settings.arabicFontSize + 2))}
                  className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-theme-surface-card border border-theme-border text-text-primary shadow-sm hover:bg-theme-surface-elevated"
                >
                  <Plus size={18} />
                </motion.button>
              </div>
            </div>

            {/* Translation Font Size */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-text-secondary tracking-wide uppercase">Translation Size</h3>
                <span className="text-xs font-medium text-theme-gold">{settings.translationFontSize}px</span>
              </div>
              <div className="flex items-center gap-4">
                <motion.button
                  whileTap={buttonTap}
                  onClick={() => updateSetting('translationFontSize', Math.max(10, settings.translationFontSize - 1))}
                  className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-theme-surface-card border border-theme-border text-text-primary shadow-sm hover:bg-theme-surface-elevated"
                >
                  <Minus size={18} />
                </motion.button>
                <div className="flex-1 relative">
                  <input
                    type="range"
                    min="10"
                    max="30"
                    step="1"
                    value={settings.translationFontSize}
                    onChange={(e) => updateSetting('translationFontSize', Number(e.target.value))}
                    className="w-full accent-theme-accent h-2 bg-theme-surface-input rounded-full appearance-none outline-none"
                  />
                </div>
                <motion.button
                  whileTap={buttonTap}
                  onClick={() => updateSetting('translationFontSize', Math.min(30, settings.translationFontSize + 1))}
                  className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-theme-surface-card border border-theme-border text-text-primary shadow-sm hover:bg-theme-surface-elevated"
                >
                  <Plus size={18} />
                </motion.button>
              </div>
            </div>

            {/* Translation Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-theme-border/50 mt-6">
              <div>
                <h3 className="text-sm font-semibold text-text-primary">Show Translation</h3>
                <p className="text-xs text-text-tertiary mt-1">Display English meaning below Arabic text</p>
              </div>
              <button
                role="switch"
                aria-checked={settings.showTranslation}
                onClick={() => updateSetting('showTranslation', !settings.showTranslation)}
                className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out ${
                  settings.showTranslation ? 'bg-theme-accent' : 'bg-theme-surface-input border border-theme-border'
                }`}
              >
                <motion.div
                  className={`w-6 h-6 rounded-full bg-white shadow-sm`}
                  layout
                  animate={{
                    x: settings.showTranslation ? 24 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
