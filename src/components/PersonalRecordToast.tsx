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
          className="fixed left-4 right-4 z-50 max-w-md mx-auto bg-white border-2 border-[#12324A] rounded-2xl p-4 shadow-[0_10px_25px_rgba(0,0,0,0.15)] flex items-center justify-between gap-3 backdrop-blur-xl"
          style={{ top: 'calc(max(env(safe-area-inset-top, 0px), 62px) + 8px)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#12324A] text-white flex items-center justify-center font-black shrink-0">
              <Trophy className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-widest uppercase text-[#4A90C2] block">
                NEW PERSONAL RECORD!
              </span>
              <h4 className="text-sm font-black text-[#0D1B2A]">
                {newPersonalRecord.title}: {newPersonalRecord.displayValue}
              </h4>
              {newPersonalRecord.previousValue !== undefined && (
                <p className="text-[11px] text-[#68727D]">
                  Beating previous record of {newPersonalRecord.previousValue}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={dismissPersonalRecord}
            className="w-8 h-8 rounded-lg bg-[#F7F6F2] hover:bg-[#EEEDE9] text-[#68727D] hover:text-[#0D1B2A] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
