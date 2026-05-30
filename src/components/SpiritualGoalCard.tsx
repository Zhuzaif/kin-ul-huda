import React, { useState } from 'react';

export default function SpiritualGoalCard() {
  const [goal, setGoal] = useState('');

  return (
    <div className="px-6 mb-8">
      <div className="bg-white/60 backdrop-blur-sm rounded-[24px] p-5 shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-white/60">
        <h3 className="text-sm font-bold text-gray-800 tracking-tight mb-3">My Spiritual Goal</h3>
        <div className="relative">
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value.slice(0, 200))}
            placeholder="What is your spiritual goal?"
            className="w-full bg-[#FAF8F5] rounded-2xl p-4 text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-muted-gold/30 border border-transparent focus:border-muted-gold/20 resize-none h-24 transition-all"
          />
          <span className="absolute bottom-3 right-4 text-[10px] font-semibold text-gray-400">
            {goal.length}/200
          </span>
        </div>
      </div>
    </div>
  );
}
