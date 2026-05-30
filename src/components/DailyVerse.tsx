import React, { useState, useRef } from 'react';
import { Sparkles, Heart, Share2 } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';

export default function DailyVerse() {
  const [isSaved, setIsSaved] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Daily Verse',
          text: '"Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire." (Al-Baqarah 2:201)',
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="px-6 mb-6" ref={containerRef}>
      <div className="bg-muted-gold-light rounded-[32px] p-6 shadow-sm relative overflow-hidden group">
        {/* Subtle geometric pattern with parallax */}
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute inset-0 -inset-y-20 opacity-[0.03] pointer-events-none transition-opacity group-hover:opacity-[0.06]"
        >
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z' fill='%23C9A66B' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`
            }}
          />
        </motion.div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 mt-1">
              <Sparkles className="w-4 h-4 text-muted-gold" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-gold">Dua of the Day</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleShare}
                className="w-9 h-9 rounded-full bg-white/60 flex items-center justify-center text-muted-gold hover:bg-white/80 transition-colors shadow-sm"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsSaved(!isSaved)}
                className="w-9 h-9 rounded-full bg-white/60 flex items-center justify-center text-muted-gold hover:bg-white/80 transition-colors shadow-sm relative"
              >
                <AnimatePresence>
                  {isSaved && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Heart className="w-4 h-4 text-soft-pink-dark fill-current" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.div
                  animate={{ scale: isSaved ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Heart className="w-4 h-4" />
                </motion.div>
              </button>
            </div>
          </div>

          <div className="text-center mb-6">
            <p 
              className="font-arabic text-3xl leading-relaxed text-gray-800/90 py-2"
              dir="rtl"
            >
              رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ
            </p>
          </div>

          <p className="text-sm text-gray-600/90 text-center leading-relaxed font-medium">
            "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire."
          </p>
          <p className="text-[10px] text-gray-400 text-center mt-3 uppercase tracking-wider font-semibold">
            Al-Baqarah 2:201
          </p>
        </div>
      </div>
    </div>
  );
}
