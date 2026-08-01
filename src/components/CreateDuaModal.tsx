import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Dua } from '../types';

interface CreateDuaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dua: Dua) => void;
}

export default function CreateDuaModal({ isOpen, onClose, onSave }: CreateDuaModalProps) {
  const [title, setTitle] = useState('');
  const [arabic, setArabic] = useState('');
  const [translation, setTranslation] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title || !arabic) return;
    
    const newDua: Dua = {
      id: `custom-${Date.now()}`,
      title,
      arabic,
      translation,
      tags: ['Personal'],
      isCustom: true
    };
    
    onSave(newDua);
    setTitle('');
    setArabic('');
    setTranslation('');
    onClose();
  };

  return (
    <div className="absolute inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div 
        className="absolute inset-0 bg-theme-surface-alt backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-[400px] bg-theme-surface rounded-t-[32px] sm:rounded-[32px] shadow-2xl p-6 sm:p-8 animate-in slide-in-from-bottom-full duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-primary tracking-tight">Add Your Own Dua</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-theme-surface-alt hover:bg-theme-surface-input text-text-tertiary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. My Morning Prayer"
              className="w-full bg-theme-surface-card px-4 py-3 rounded-xl border border-theme-border focus:border-theme-accent focus:ring-2 focus:ring-theme-accent-soft outline-none transition-all text-sm font-medium text-text-secondary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Arabic Text</label>
            <textarea
              value={arabic}
              onChange={(e) => setArabic(e.target.value)}
              placeholder="Enter dua in Arabic"
              dir="rtl"
              rows={4}
              className="w-full bg-theme-surface-card px-4 py-3 rounded-xl border border-theme-border focus:border-theme-accent focus:ring-2 focus:ring-theme-accent-soft outline-none transition-all font-arabic text-lg text-right text-text-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Translation (Optional)</label>
            <textarea
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="Meaning in English"
              rows={3}
              className="w-full bg-theme-surface-card px-4 py-3 rounded-xl border border-theme-border focus:border-theme-accent focus:ring-2 focus:ring-theme-accent-soft outline-none transition-all text-sm font-medium text-text-secondary"
            />
          </div>
        </div>

        <div className="mt-8">
          <button 
            onClick={handleSave}
            disabled={!title || !arabic}
            className="w-full bg-theme-accent hover:bg-theme-accent-strong disabled:bg-theme-surface-input disabled:text-text-muted disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            Save Dua
          </button>
        </div>
      </div>
    </div>
  );
}
