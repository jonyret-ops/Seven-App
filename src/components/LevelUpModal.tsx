import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LevelUpModal: React.FC = () => {
  const { levelUpModalData, dismissLevelUpModal } = useApp();

  if (!levelUpModalData) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="bg-white rounded-3xl w-full max-w-xs p-6 text-center border border-[#EEEDE9] shadow-2xl relative overflow-hidden text-[#0D1B2A]"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#DCEAF4] text-[#12324A] flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Trophy className="w-7 h-7 stroke-[2.2]" />
          </div>

          <span className="text-[10px] font-black tracking-widest uppercase text-[#4A90C2] block mb-1">
            LEVEL UP ACHIEVED
          </span>

          <h2 className="text-3xl font-black text-[#0D1B2A] tracking-tight mb-1">
            LEVEL {levelUpModalData.newLevel}
          </h2>

          <div className="inline-block px-3 py-1 rounded-full bg-[#DCEAF4] text-[#12324A] text-xs font-black uppercase tracking-wider mb-4">
            {levelUpModalData.title}
          </div>

          <p className="text-xs text-[#68727D] mb-5 px-2 leading-relaxed font-medium">
            Your real-life discipline continues to compound. Level up the character by leveling up yourself.
          </p>

          <button
            type="button"
            onClick={dismissLevelUpModal}
            className="w-full h-11 rounded-2xl bg-[#12324A] hover:bg-[#0D1B2A] text-white text-xs font-black uppercase tracking-wider shadow-xs transition-all cursor-pointer"
          >
            Claim & Continue
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
