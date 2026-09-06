import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PersonalRecordToast: React.FC = () => {
  const { newPersonalRecord, dismissPersonalRecord } = useApp();

  return (
    <AnimatePresence>
      {newPersonalRecord && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto bg-[#181E19] border-2 border-emerald-400/60 rounded-2xl p-4 shadow-[0_10px_25px_rgba(0,0,0,0.5)] flex items-center justify-between gap-3 text-white backdrop-blur-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-black flex items-center justify-center font-black shadow-[0_0_12px_rgba(52,211,153,0.5)] shrink-0">
              <Trophy className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-widest uppercase text-emerald-400 block">
                NEW PERSONAL RECORD!
              </span>
              <h4 className="text-sm font-black text-white">
                {newPersonalRecord.title}: {newPersonalRecord.displayValue}
              </h4>
              {newPersonalRecord.previousValue !== undefined && (
                <p className="text-[11px] text-zinc-400">
                  Beating previous record of {newPersonalRecord.previousValue}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={dismissPersonalRecord}
            className="w-8 h-8 rounded-lg bg-zinc-800/80 text-zinc-400 hover:text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
