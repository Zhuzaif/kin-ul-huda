import React from 'react';
import { Search, DownloadCloud } from 'lucide-react';

interface QuranHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
  onDownload?: () => void;
}

export default function QuranHeader({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onDownload,
}: QuranHeaderProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearchSubmit?.(searchQuery);
    }
  };

  return (
    <div className="pt-8 pb-4 px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          Quran
        </h1>
        <button
          type="button"
          onClick={onDownload}
          className="w-10 h-10 bg-white/60 rounded-full flex items-center justify-center shadow-sm text-gray-600 transition-colors hover:bg-white/80"
          aria-label="Download list"
        >
          <DownloadCloud className="w-5 h-5" />
        </button>
      </div>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input 
          type="text" 
          placeholder="Search surah or verse..."
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-white/70 backdrop-blur-sm pl-11 pr-4 py-3.5 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2B604A]/30 shadow-sm transition-all text-gray-800 placeholder:text-gray-400 border border-white/60"
        />
      </div>
    </div>
  );
}
