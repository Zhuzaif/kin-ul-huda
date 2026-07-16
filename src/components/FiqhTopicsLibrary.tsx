import React, { useState } from 'react';
import { ChevronRight, BookMarked } from 'lucide-react';
import { fiqhTopics, FIQH_CATEGORIES } from '../data/fiqhTopics';
import type { FiqhTopic } from '../data/fiqhTopics';
import FiqhTopicDetail from './FiqhTopicDetail';

export default function FiqhTopicsLibrary() {
  const [selectedTopic, setSelectedTopic] = useState<FiqhTopic | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered =
    activeCategory === null
      ? fiqhTopics
      : fiqhTopics.filter((t) => t.category === activeCategory);

  return (
    <>
      <div className="px-6 pb-36">
        <div className="mb-5">
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

        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-4 mb-4">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 px-4 py-2 rounded-full text-[11px] font-bold transition-all ${
              activeCategory === null
                ? 'bg-[#2B604A] text-white shadow-sm'
                : 'bg-white/70 text-gray-600 border border-white/60'
            }`}
          >
            All topics
          </button>
          {FIQH_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-full text-[11px] font-bold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-[#D98A5B] text-white shadow-sm'
                  : 'bg-white/70 text-gray-600 border border-white/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {filtered.map((topic) => {
            const Icon = topic.icon;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => setSelectedTopic(topic)}
                className="w-full text-left bg-white/70 backdrop-blur-sm rounded-[24px] p-4 border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] active:scale-[0.98] transition-all hover:bg-white/90 group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-[18px] ${topic.iconBg} flex items-center justify-center flex-shrink-0 shadow-sm`}
                  >
                    <Icon className={`w-6 h-6 ${topic.iconColor} stroke-[2]`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#D98A5B]">
                      {topic.category}
                    </span>
                    <h4 className="text-[15px] font-bold text-gray-800 tracking-tight mt-0.5 mb-1">
                      {topic.title}
                    </h4>
                    <p className="text-[12px] font-medium text-gray-500 leading-relaxed line-clamp-2">
                      {topic.summary}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] font-semibold text-gray-400 flex items-center gap-1">
                        <BookMarked className="w-3 h-3" />
                        {topic.readMinutes} min read
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#D98A5B] flex-shrink-0 mt-1 transition-colors" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedTopic && (
        <FiqhTopicDetail topic={selectedTopic} onBack={() => setSelectedTopic(null)} />
      )}
    </>
  );
}
