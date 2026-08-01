import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Clock } from 'lucide-react';
import { fiqhMainTopics } from '../data/fiqhTopics';
import type { FiqhMainTopic, FiqhSubTopic } from '../data/fiqhTopics';

interface FiqhTopicsLibraryProps {
  onSelectSubTopic: (sub: FiqhSubTopic, parent: FiqhMainTopic) => void;
  onOpenHaiz: (parent: FiqhMainTopic) => void;
  onOpenNifas: (parent: FiqhMainTopic) => void;
  onOpenIstihaza: (parent: FiqhMainTopic) => void;
  onOpenGhusl: (parent: FiqhMainTopic) => void;
  onOpenWuduTayammum: (parent: FiqhMainTopic) => void;
}

/* Accent colors for the left-border indicator on each topic card */
const ACCENT_COLORS: Record<string, string> = {
  'taharat-aur-paki': '#6BAF92',
  'ibaadaat': '#C9A66B',
  'parda-aur-haya': '#D98A5B',
  'nikah-aur-zindagi': '#E8919A',
  'talaq-khula-iddat': '#9CA3AF',
  'maliyati-maashi-huquq': '#6BAF92',
  'taleem-aur-tarbiyat': '#C9A66B',
};

export default function FiqhTopicsLibrary({
  onSelectSubTopic,
  onOpenHaiz,
  onOpenNifas,
  onOpenIstihaza,
  onOpenGhusl,
  onOpenWuduTayammum,
}: FiqhTopicsLibraryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleSubTopicClick = (sub: FiqhSubTopic, topic: FiqhMainTopic) => {
    if (sub.id === 'haiz') onOpenHaiz(topic);
    else if (sub.id === 'nifas') onOpenNifas(topic);
    else if (sub.id === 'istihaza') onOpenIstihaza(topic);
    else if (sub.id === 'ghusl') onOpenGhusl(topic);
    else if (sub.id === 'wudu-tayammum') onOpenWuduTayammum(topic);
    else onSelectSubTopic(sub, topic);
  };

  return (
    <div className="px-5 pb-36 nisa-slide-up-delay-1">
      {/* Section header */}
      <div className="mb-4">
        <h3 className="text-[17px] font-bold text-text-primary tracking-tight">
          Fiqh Library
        </h3>
        <p className="text-[12px] font-medium text-text-muted mt-0.5">
          Trusted summaries — read at your own pace
        </p>
      </div>

      {/* Topic cards */}
      <div className="flex flex-col gap-2.5">
        {fiqhMainTopics.map((topic) => {
          const Icon = topic.icon;
          const isExpanded = expandedId === topic.id;
          const hasSubTopics = topic.subTopics.length > 0;
          const accentColor = ACCENT_COLORS[topic.id] || '#C9A66B';

          const isComingSoon = topic.id !== 'taharat-aur-paki';

          return (
            <div key={topic.id} className="flex flex-col">
              {/* Topic Header Card */}
              <button
                type="button"
                disabled={isComingSoon}
                onClick={() => toggleExpand(topic.id)}
                className={`w-full text-left p-4 border transition-all duration-200 group ${
                  isComingSoon ? 'opacity-60 cursor-not-allowed' : 'active:scale-[0.98]'
                } ${
                  isExpanded
                    ? 'bg-theme-surface-card border-theme-border rounded-t-[20px] rounded-b-none shadow-[var(--nisa-shadow-card)]'
                    : 'bg-theme-surface-card border-theme-border rounded-[20px] hover:shadow-[var(--nisa-shadow-card)]'
                }`}
                style={{
                  borderLeftWidth: '3px',
                  borderLeftColor: accentColor,
                }}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl ${topic.iconBg} flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                      isExpanded ? 'scale-105' : ''
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${topic.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-[14px] font-bold text-text-primary tracking-tight">
                        {topic.title}
                      </h4>
                      {isComingSoon ? (
                        <span className="text-[9px] font-bold uppercase tracking-wide bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                          Coming Soon
                        </span>
                      ) : hasSubTopics && (
                        <span className="text-[10px] font-semibold text-text-muted bg-theme-surface-dark px-2 py-0.5 rounded-full">
                          {topic.subTopics.length}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-medium text-text-muted mt-0.5">
                      {topic.subtitle}
                    </p>
                  </div>
                  {!isComingSoon && (
                    <ChevronDown
                      className={`w-4 h-4 text-text-muted flex-shrink-0 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </div>
              </button>

              {/* Expandable Sub-Topics */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded ? 'opacity-100 mt-0' : 'max-h-0 opacity-0'
                }`}
              >
                <div
                  className="bg-theme-surface-card border border-t-0 border-theme-border rounded-b-[20px] px-2 pb-2"
                  style={{
                    borderLeftWidth: '3px',
                    borderLeftColor: accentColor,
                  }}
                >
                  {hasSubTopics ? (
                    <div className="pt-2 flex flex-col">
                      {topic.subTopics.map((sub) => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => handleSubTopicClick(sub, topic)}
                          className="w-full text-left flex items-center justify-between p-3 rounded-2xl hover:bg-theme-surface-alt transition-colors group/item"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-1 h-1 rounded-full bg-text-muted flex-shrink-0" />
                            <span className="text-[13px] font-medium text-text-secondary flex-1 min-w-0 truncate group-hover/item:text-text-primary transition-colors">
                              {sub.title}
                            </span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-text-muted group-hover/item:text-theme-accent flex-shrink-0 transition-all group-hover/item:translate-x-0.5" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-5 py-5 flex flex-col items-center text-center">
                      <Clock className="w-5 h-5 text-text-muted mb-2" />
                      <p className="text-[12px] font-semibold text-text-tertiary">
                        Coming soon
                      </p>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        Sub-topics will be added shortly
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
