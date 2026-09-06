import React from 'react';
import { motion } from 'motion/react';
import { Check, Sparkles } from 'lucide-react';
import { SideQuestDefinition } from '../types';

interface SideQuestCardProps {
  quest: SideQuestDefinition;
  isCompleted: boolean;
  disabled?: boolean;
  onToggle: () => void;
}

export const SideQuestCard: React.FC<SideQuestCardProps> = ({
  quest,
  isCompleted,
  disabled = false,
  onToggle,
}) => {
  return (
    <motion.div
      layout
      className={`group relative flex items-center justify-between p-3.5 rounded-2xl border transition-all select-none ${
        isCompleted
          ? 'bg-[#1D1912] border-amber-500/30 shadow-sm'
          : 'bg-[#14171D] border-white/[0.07] hover:border-white/[0.14] shadow-xs'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={() => {
        if (!disabled) onToggle();
      }}
    >
      <div className="flex items-center gap-3 pr-2 flex-1 min-w-0">
        <button
          type="button"
          disabled={disabled}
          aria-label={`Mark ${quest.title} as ${isCompleted ? 'incomplete' : 'complete'}`}
          className={`flex items-center justify-center w-7 h-7 rounded-xl border-2 transition-all shrink-0 cursor-pointer ${
            isCompleted
              ? 'bg-amber-500 border-amber-400 text-black shadow-[0_0_10px_rgba(245,158,11,0.3)]'
              : 'border-zinc-700 bg-zinc-900/80 group-hover:border-zinc-500 text-transparent'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) onToggle();
          }}
        >
          <motion.div
            initial={false}
            animate={{ scale: isCompleted ? 1 : 0.6, opacity: isCompleted ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
          >
            <Check className="w-4 h-4 stroke-[3.5]" />
          </motion.div>
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <h3
              className={`text-[14px] font-bold tracking-tight truncate transition-colors ${
                isCompleted ? 'text-amber-300' : 'text-zinc-100'
              }`}
            >
              {quest.title}
            </h3>
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
            {quest.description}
          </p>
        </div>
      </div>

      <div className="shrink-0 pl-2">
        <span
          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-xs font-black tracking-wide transition-colors ${
            isCompleted
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : 'bg-zinc-800 text-amber-400/80 group-hover:bg-amber-500/15 group-hover:text-amber-300'
          }`}
        >
          <span>+{quest.xp}</span>
          <span className="text-[9px] font-bold">XP</span>
        </span>
      </div>
    </motion.div>
  );
};
