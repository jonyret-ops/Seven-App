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
    <div 
      className="fixed left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
      style={{ top: 'calc(max(env(safe-area-inset-top, 0px), 62px) + 8px)' }}
    >
      <AnimatePresence>
        <motion.div
          initial={{ y: -50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -30, opacity: 0, scale: 0.95 }}
          className="pointer-events-auto bg-white rounded-2xl p-3.5 border-2 border-[#12324A] shadow-[0_10px_25px_rgba(0,0,0,0.15)] flex items-center gap-3 max-w-sm w-full backdrop-blur-md"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#12324A] text-white font-black shrink-0">
            <Award className="w-5 h-5 stroke-[2]" />
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-black tracking-wider uppercase text-[#4A90C2] block">
              Achievement Unlocked!
            </span>
            <h4 className="text-xs font-black text-[#0D1B2A] tracking-tight truncate">
              {recentAchievement.title}
            </h4>
            <p className="text-[11px] text-[#68727D] truncate">
              {recentAchievement.description}
            </p>
          </div>

          <button
            type="button"
            onClick={dismissAchievement}
            className="w-7 h-7 rounded-lg bg-[#F7F6F2] hover:bg-[#EEEDE9] text-[#68727D] hover:text-[#0D1B2A] flex items-center justify-center shrink-0 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
