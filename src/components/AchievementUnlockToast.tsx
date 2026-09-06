import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AchievementUnlockToast: React.FC = () => {
  const { recentAchievement, dismissAchievement } = useApp();

  useEffect(() => {
    if (recentAchievement) {
      const timer = setTimeout(() => {
        dismissAchievement();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [recentAchievement, dismissAchievement]);

  if (!recentAchievement) return null;

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <AnimatePresence>
        <motion.div
          initial={{ y: -50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -30, opacity: 0, scale: 0.95 }}
          className="pointer-events-auto bg-[#181E19] rounded-2xl p-3.5 border-2 border-emerald-400/60 shadow-[0_10px_25px_rgba(0,0,0,0.6)] flex items-center gap-3 max-w-sm w-full text-white backdrop-blur-md"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500 text-black border border-emerald-400 font-black shrink-0">
            <Award className="w-5 h-5 stroke-[2.5]" />
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-black tracking-wider uppercase text-emerald-400 block">
              Achievement Unlocked!
            </span>
            <h4 className="text-xs font-black text-white tracking-tight truncate">
              {recentAchievement.title}
            </h4>
            <p className="text-[11px] text-zinc-400 truncate">
              {recentAchievement.description}
            </p>
          </div>

          <button
            type="button"
            onClick={dismissAchievement}
            className="w-7 h-7 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
