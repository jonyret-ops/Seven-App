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
  colorClass = 'bg-[#12324A]',
  heightClass = 'h-2',
}) => {
  const percent = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  return (
    <div className="w-full">
      {(label || subLabel) && (
        <div className="flex justify-between items-baseline mb-1.5 text-xs font-semibold text-[#68727D]">
          <span>{label}</span>
          <span className="text-[#0D1B2A] font-bold">{subLabel}</span>
        </div>
      )}
      <div className={`w-full bg-[#EEEDE9] rounded-full overflow-hidden ${heightClass}`}>
        <motion.div
          className={`${heightClass} rounded-full ${colorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
