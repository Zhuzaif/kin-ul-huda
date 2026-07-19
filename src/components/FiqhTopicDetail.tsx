import React from 'react';
import { ChevronLeft } from 'lucide-react';
import type { FiqhSubTopic, FiqhMainTopic } from '../data/fiqhTopics';

interface FiqhSubTopicDetailProps {
  subTopic: FiqhSubTopic;
  parentTopic: FiqhMainTopic;
  onBack: () => void;
}

export default function FiqhSubTopicDetail({ subTopic, parentTopic, onBack }: FiqhSubTopicDetailProps) {
  const Icon = parentTopic.icon;

  return (
    <div className="absolute inset-0 bg-warm-beige z-50 flex flex-col animate-in fade-in duration-300">
      <div className="sticky top-0 z-10 bg-warm-beige/90 backdrop-blur-md px-6 py-4 flex items-center gap-3 border-b border-gray-200/40">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100/50 active:scale-95 transition-all"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#D98A5B]">
            {parentTopic.title}
          </span>
          <h1 className="text-lg font-bold text-gray-800 tracking-tight truncate">{subTopic.title}</h1>
        </div>
        <div className={`w-10 h-10 rounded-full ${parentTopic.iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${parentTopic.iconColor}`} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar px-6 py-6 pb-28">
        <p className="text-[14px] font-medium text-gray-600 leading-relaxed mb-6">{subTopic.summary}</p>
        <div className="flex flex-col gap-4">
          {subTopic.content.map((paragraph, i) => (
            <p
              key={i}
              className="text-[13px] text-gray-700 leading-relaxed bg-white/60 rounded-[20px] p-4 border border-white/70"
            >
              {paragraph}
            </p>
          ))}
        </div>
        <p className="text-[11px] text-gray-400 text-center mt-8 leading-relaxed px-4">
          General guidance only. For personal rulings, consult a qualified Aalima or scholar in your madhab.
        </p>
      </div>
    </div>
  );
}
