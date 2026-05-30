import React from 'react';
import { Heart, ChevronDown } from 'lucide-react';

const duas = [
  {
    id: 1,
    title: "Morning Dua",
    tag: "Morning",
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
    english: "O Allah, by Your leave we have reached the morning and by Your leave we have reached the evening, by Your leave we live and die and unto You is our resurrection.",
    saved: true,
    tagBg: "bg-muted-gold-light",
    tagColor: "text-muted-gold"
  },
  {
    id: 2,
    title: "For Relief from Anxiety",
    tag: "Anxiety",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ",
    english: "O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness.",
    saved: false,
    tagBg: "bg-soft-mint",
    tagColor: "text-[#2B604A]"
  }
];

export default function DuaList() {
  return (
    <div className="px-6 pb-36 flex flex-col gap-4">
      {duas.map((dua) => (
        <div key={dua.id} className="bg-white/50 rounded-[32px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-white/60 flex flex-col relative group">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h4 className="text-base font-bold text-gray-800 tracking-tight">{dua.title}</h4>
              <span className={`text-[9.5px] uppercase font-bold tracking-wider ${dua.tagColor} ${dua.tagBg} px-2.5 py-1 rounded-full mt-2 inline-block shadow-sm`}>
                {dua.tag}
              </span>
            </div>
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100/50 hover:bg-gray-50 transition-colors">
              <Heart className={`w-4 h-4 ${dua.saved ? 'fill-soft-pink-dark text-soft-pink-dark' : 'text-gray-300'}`} />
            </button>
          </div>
          
          <div className="mb-4">
            <p className="font-arabic text-[26px] leading-[2] text-gray-800 py-2 text-right" dir="rtl">
              {dua.arabic}
            </p>
          </div>
          
          <p className="text-[13.5px] text-gray-500 leading-relaxed font-medium mb-5 pr-2">
            "{dua.english}"
          </p>

          <div className="border-t border-gray-200/40 pt-4 flex justify-center">
            <button className="flex items-center gap-1.5 text-xs font-bold text-gray-400 group-hover:text-[#D98A5B] transition-colors">
              Read more
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
