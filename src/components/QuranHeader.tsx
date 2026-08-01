import React from 'react';
import { Search, DownloadCloud, Bookmark } from 'lucide-react';
import { useProfile } from '../contexts/ProfileContext';

interface QuranHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
  onDownload?: () => void;
  isDownloading?: boolean;
  downloadProgress?: number;
  onBookmarks?: () => void;
}

export default function QuranHeader({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onDownload,
  isDownloading = false,
  downloadProgress = 0,
  onBookmarks,
}: QuranHeaderProps) {
  const { profile } = useProfile();
  const displayName = profile?.name?.trim() || 'Reader';

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearchSubmit?.(searchQuery);
    }
  };

  return (
    <div className="pt-3 pb-3 px-6">
      {/* Greeting row */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1
            className="text-[26px] font-bold text-text-primary tracking-tight leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Al-Quran
          </h1>
          <p className="text-[13px] text-text-muted mt-0.5">
            Assalamu Alaikum, {displayName}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onBookmarks}
            className="w-11 h-11 bg-theme-surface-card rounded-[14px] flex items-center justify-center shadow-sm text-theme-accent transition-colors hover:bg-theme-surface-alt"
            aria-label="Bookmarks"
          >
            <Bookmark className="w-[18px] h-[18px]" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={onDownload}
            disabled={isDownloading}
            className="relative w-11 h-11 bg-theme-surface-card rounded-[14px] flex items-center justify-center shadow-sm text-theme-accent transition-colors hover:bg-theme-surface-alt overflow-hidden disabled:opacity-70"
            aria-label="Download all audio"
          >
            {isDownloading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0B4D3C]/10 text-[10px] font-bold text-[#0B4D3C]">
                {downloadProgress}%
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 44 44">
                  <circle cx="22" cy="22" r="20" fill="none" stroke="rgba(11,77,60,0.1)" strokeWidth="2.5" />
                  <circle cx="22" cy="22" r="20" fill="none" stroke="#0B4D3C" strokeWidth="2.5" strokeDasharray="125.6" strokeDashoffset={125.6 - (125.6 * downloadProgress) / 100} className="transition-all duration-300" />
                </svg>
              </div>
            ) : (
              <DownloadCloud className="w-[18px] h-[18px]" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-[18px] h-[18px] text-text-muted" strokeWidth={2} />
        </div>
        <input
          type="text"
          placeholder="Search Surah, Juz, or Verse..."
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-theme-surface-card pl-11 pr-4 py-3.5 rounded-[15px] text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-theme-accent/20 shadow-[var(--nisa-shadow-card)] transition-all text-text-primary placeholder:text-text-muted"
        />
      </div>
    </div>
  );
}
