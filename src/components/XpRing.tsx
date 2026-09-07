import React from 'react';
import { motion } from 'motion/react';
import { DailyRank } from '../types';

interface XpRingProps {
  currentXp: number;
  goalXp?: number;
  corePerformancePercent?: number;
  dailyRank?: DailyRank;
  isPerfectDay?: boolean;
  size?: number;
  strokeWidth?: number;
}

export const XpRing: React.FC<XpRingProps> = ({
  currentXp,
  goalXp = 100,
  corePerformancePercent = 0,
  dailyRank = 'ROUGH DAY',
  isPerfectDay = false,
  size = 210,
  strokeWidth = 14,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Progress based on core performance percent or XP percent
  const percent = Math.min(100, Math.max(0, corePerformancePercent > 0 ? corePerformancePercent : (currentXp / goalXp) * 100));
  const progressRatio = percent / 100;
  const strokeDashoffset = circumference - progressRatio * circumference;

  const isConquered = percent >= 85;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#EEEDE9"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Primary Progress Ring in Navy/Blue */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isPerfectDay ? '#12324A' : isConquered ? '#12324A' : '#4A90C2'}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </svg>

      {/* Center Information */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3">
        <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#68727D]">
          CORE PERFORMANCE
        </span>

        {/* Big percentage display */}
        <div className="flex items-baseline justify-center gap-0.5 my-0.5">
          <motion.span
            key={percent}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-black tracking-tight text-[#0D1B2A]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {percent}%
          </motion.span>
        </div>

        {/* XP sub-stat */}
        <span className="text-[11px] font-semibold text-[#68727D]">
          {currentXp} / {goalXp} XP
        </span>

        {/* Status Pill Badge */}
        {isPerfectDay ? (
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 mt-1.5 rounded-full bg-[#DCEAF4] text-[#12324A] text-[10px] font-black tracking-wide">
            <span>PERFECT DAY</span>
          </div>
        ) : isConquered ? (
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 mt-1.5 rounded-full bg-[#DCEAF4] text-[#12324A] text-[10px] font-black tracking-wide">
            <span>DAY CONQUERED</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 mt-1.5 rounded-full bg-[#F7F6F2] text-[#68727D] text-[10px] font-bold tracking-wide">
            <span>{dailyRank}</span>
          </div>
        )}
      </div>
    </div>
  );
};
