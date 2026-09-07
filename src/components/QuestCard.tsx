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
          ? 'bg-[#F7F6F2] border-[#EEEDE9] opacity-85'
          : isNA
          ? 'bg-[#F7F6F2]/60 border-[#EEEDE9] opacity-60'
          : 'bg-white border-[#EEEDE9] hover:border-[#4A90C2] shadow-xs'
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
              ? 'bg-[#12324A] border-[#12324A] text-white shadow-2xs'
              : isNA
              ? 'border-[#EEEDE9] bg-[#F7F6F2] text-[#68727D] cursor-not-allowed'
              : 'border-[#68727D]/40 bg-white group-hover:border-[#12324A] text-transparent'
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
            <Check className="w-4 h-4 stroke-[3]" />
          </motion.div>
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#68727D] shrink-0">
              #{quest.order}
            </span>
            <h3
              className={`text-[14px] font-bold tracking-tight truncate transition-colors ${
                isCompleted ? 'line-through text-[#68727D]' : isNA ? 'text-[#68727D] line-through' : 'text-[#0D1B2A]'
              }`}
            >
              {quest.title}
            </h3>
          </div>
          {quest.description && (
            <p className="text-[11px] text-[#68727D] mt-0.5 truncate">
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
                ? 'bg-[#EEEDE9] text-[#12324A] border border-[#EEEDE9]'
                : 'text-[#68727D] hover:text-[#0D1B2A] hover:bg-[#F2F1ED]'
            }`}
            title="Mark Not Applicable for today"
          >
            N/A
          </button>
        )}

        {isZeroXp ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-[#F7F6F2] text-[10px] font-bold text-[#68727D]">
            0 XP
          </span>
        ) : (
          <span
            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-xs font-black tracking-wide transition-colors ${
              isCompleted
                ? 'bg-[#DCEAF4] text-[#12324A]'
                : 'bg-[#F7F6F2] text-[#68727D] group-hover:text-[#12324A]'
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
