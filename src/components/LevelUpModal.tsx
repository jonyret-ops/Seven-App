import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SevenLogo } from './SevenLogo';

export const LevelUpModal: React.FC = () => {
  const { levelUpModalData, dismissLevelUpModal } = useApp();

  if (!levelUpModalData) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="bg-[#14171D] rounded-3xl w-full max-w-xs p-6 text-center border border-emerald-500/40 shadow-2xl relative overflow-hidden text-white"
        >
          <div className="inline-flex items-center justify-center mb-3">
            <SevenLogo size="lg" />
          </div>

          <span className="text-[10px] font-black tracking-widest uppercase text-emerald-400 block mb-1">
            LEVEL UP ACHIEVED
          </span>

          <h2 className="text-3xl font-black text-white tracking-tight mb-1">
            LEVEL {levelUpModalData.newLevel}
          </h2>

          <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider mb-4">
            {levelUpModalData.title}
          </div>

          <p className="text-xs text-zinc-400 mb-5 px-2 leading-relaxed">
            Your real-life discipline continues to compound. Level up the character by leveling up yourself.
          </p>

          <button
            type="button"
            onClick={dismissLevelUpModal}
            className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black shadow-xs transition-all cursor-pointer"
          >
            Claim & Continue
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
