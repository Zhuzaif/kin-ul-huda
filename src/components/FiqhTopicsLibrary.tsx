import React, { useState } from 'react';
import { ChevronDown, ChevronRight, BookMarked, Clock } from 'lucide-react';
import { fiqhMainTopics } from '../data/fiqhTopics';
import type { FiqhMainTopic, FiqhSubTopic } from '../data/fiqhTopics';

interface FiqhTopicsLibraryProps {
  onSelectSubTopic: (sub: FiqhSubTopic, parent: FiqhMainTopic) => void;
  onOpenHaiz: (parent: FiqhMainTopic) => void;
}

export default function FiqhTopicsLibrary({ onSelectSubTopic, onOpenHaiz }: FiqhTopicsLibraryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <div className="px-6 pb-36">
        <div className="mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-gold block mb-1">
            Knowledge Library
          </span>
          <h3 className="text-lg font-bold text-gray-800 tracking-tight">
            Women&apos;s Fiqh Topics
          </h3>
          <p className="text-[13px] font-medium text-gray-500 mt-1 leading-relaxed">
            Trusted summaries on purity, worship, and daily life — read at your own pace.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {fiqhMainTopics.map((topic) => {
            const Icon = topic.icon;
            const isExpanded = expandedId === topic.id;
            const hasSubTopics = topic.subTopics.length > 0;

            return (
              <div key={topic.id} className="flex flex-col">
                {/* Main Heading Card */}
                <button
                  type="button"
                  onClick={() => toggleExpand(topic.id)}
                  className={`w-full text-left backdrop-blur-sm p-4 border shadow-[0_4px_20px_rgba(0,0,0,0.03)] active:scale-[0.98] transition-all duration-300 group ${
                    isExpanded
                      ? 'bg-white/90 border-white/80 rounded-t-[24px] rounded-b-none'
                      : 'bg-white/70 border-white/60 rounded-[24px] hover:bg-white/90'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-[18px] ${topic.iconBg} flex items-center justify-center flex-shrink-0 shadow-sm transition-transform duration-300 ${
                        isExpanded ? 'scale-110' : ''
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${topic.iconColor} stroke-[2]`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[15px] font-bold text-gray-800 tracking-tight">
                        {topic.title}
                      </h4>
                      <p className="text-[12px] font-medium text-gray-400 mt-0.5">
                        {topic.subtitle}
                      </p>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        isExpanded
                          ? 'bg-[#2B604A] rotate-180'
                          : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-colors duration-300 ${
                          isExpanded ? 'text-white' : 'text-gray-400'
                        }`}
                      />
                    </div>
                  </div>
                </button>

                {/* Expandable Sub-Topics Section */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="bg-white/60 backdrop-blur-sm border border-t-0 border-white/60 rounded-b-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                    {hasSubTopics ? (
                      <div className="px-4 py-3 flex flex-col gap-1">
                        {topic.subTopics.map((sub, idx) => (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => {
                              if (sub.id === 'haiz') {
                                onOpenHaiz(topic);
                              } else {
                                onSelectSubTopic(sub, topic);
                              }
                            }}
                            className="w-full text-left flex items-center gap-3 px-3 py-3 rounded-[16px] hover:bg-white/80 active:scale-[0.98] transition-all duration-200 group/sub"
                          >
                            <div
                              className={`w-7 h-7 rounded-full ${topic.iconBg} flex items-center justify-center flex-shrink-0`}
                            >
                              <span
                                className={`text-[11px] font-bold ${topic.iconColor}`}
                              >
                                {idx + 1}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-semibold text-gray-700 truncate">
                                {sub.title}
                              </p>
                              {sub.summary && (
                                <p className="text-[11px] text-gray-400 truncate mt-0.5">
                                  {sub.summary}
                                </p>
                              )}
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover/sub:text-[#D98A5B] flex-shrink-0 transition-colors" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-6 py-6 flex flex-col items-center text-center">
                        <div className={`w-10 h-10 rounded-full ${topic.iconBg} flex items-center justify-center mb-3`}>
                          <Clock className={`w-5 h-5 ${topic.iconColor}`} />
                        </div>
                        <p className="text-[13px] font-semibold text-gray-500">
                          Jald aane wali hain
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1 leading-relaxed max-w-[220px]">
                          Is topic ki sub-headings jald hi add ki jayengi. Stay tuned!
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
    </>
  );
}
