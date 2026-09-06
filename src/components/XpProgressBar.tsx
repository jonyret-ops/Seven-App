import React from 'react';
import { motion } from 'motion/react';

interface XpProgressBarProps {
  current: number;
  total: number;
  label?: string;
  subLabel?: string;
  colorClass?: string;
  heightClass?: string;
}

export const XpProgressBar: React.FC<XpProgressBarProps> = ({
  current,
  total,
  label,
  subLabel,
  colorClass = 'bg-emerald-400',
  heightClass = 'h-2',
}) => {
  const percent = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  return (
    <div className="w-full">
      {(label || subLabel) && (
        <div className="flex justify-between items-baseline mb-1.5 text-xs font-semibold text-zinc-400">
          <span>{label}</span>
          <span className="text-zinc-300 font-bold">{subLabel}</span>
        </div>
      )}
      <div className={`w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 ${heightClass}`}>
        <motion.div
          className={`${heightClass} rounded-full ${colorClass} shadow-[0_0_8px_rgba(52,211,153,0.3)]`}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
