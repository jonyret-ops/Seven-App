import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { QuestDefinition } from '../types';

interface QuestCardProps {
  quest: QuestDefinition;
  isCompleted: boolean;
  isNA?: boolean;
  disabled?: boolean;
  onToggle: () => void;
  onToggleNA?: () => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  isCompleted,
  isNA = false,
  disabled = false,
  onToggle,
  onToggleNA,
}) => {
  const isZeroXp = quest.baseXp === 0;

  return (
    <motion.div
      layout
      className={`group relative flex items-center justify-between p-3.5 rounded-2xl border transition-all select-none ${
        isCompleted
          ? 'bg-[#121E18] border-emerald-500/30 shadow-sm'
          : isNA
          ? 'bg-[#13151A]/60 border-zinc-800/80 opacity-60'
          : 'bg-[#14171D] border-white/[0.07] hover:border-white/[0.14] shadow-xs'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={() => {
        if (!disabled && !isNA) onToggle();
      }}
    >
      <div className="flex items-center gap-3 pr-2 flex-1 min-w-0">
        {/* Custom rounded checkbox button */}
        <button
          type="button"
          disabled={disabled || isNA}
          aria-label={`Mark ${quest.title} as ${isCompleted ? 'incomplete' : 'complete'}`}
          className={`flex items-center justify-center w-7 h-7 rounded-xl border-2 transition-all shrink-0 cursor-pointer ${
            isCompleted
              ? 'bg-emerald-500 border-emerald-400 text-black shadow-[0_0_10px_rgba(52,211,153,0.3)]'
              : isNA
              ? 'border-zinc-700 bg-zinc-800 text-zinc-500 cursor-not-allowed'
              : 'border-zinc-700 bg-zinc-900/80 group-hover:border-zinc-500 text-transparent'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled && !isNA) onToggle();
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
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-zinc-500 shrink-0">
              #{quest.order}
            </span>
            <h3
              className={`text-[14px] font-bold tracking-tight truncate transition-colors ${
                isCompleted ? 'text-emerald-300' : isNA ? 'text-zinc-500 line-through' : 'text-zinc-100'
              }`}
            >
              {quest.title}
            </h3>
          </div>
          {quest.description && (
            <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
              {quest.description}
            </p>
          )}
        </div>
      </div>

      {/* Action / XP Tag */}
      <div className="shrink-0 flex items-center gap-1.5 pl-2">
        {/* If quest allows N/A */}
        {quest.allowsNA && onToggleNA && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleNA();
            }}
            className={`px-2 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-colors cursor-pointer ${
              isNA
                ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60'
            }`}
            title="Mark Not Applicable for today"
          >
            N/A
          </button>
        )}

        {isZeroXp ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-zinc-800/80 text-[10px] font-bold text-zinc-400">
            0 XP
          </span>
        ) : (
          <span
            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-xs font-black tracking-wide transition-colors ${
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-zinc-800/80 text-zinc-300 group-hover:bg-zinc-800 group-hover:text-emerald-400'
            }`}
          >
            <span>+{quest.baseXp}</span>
            <span className="text-[9px] font-bold">XP</span>
          </span>
        )}
      </div>
    </motion.div>
  );
};
