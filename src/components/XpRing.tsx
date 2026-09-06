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
      <svg className="transform -rotate-90 drop-shadow-[0_0_12px_rgba(34,197,94,0.15)]" width={size} height={size}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#181D24"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Primary Progress Ring in Vivid Emerald Green */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isPerfectDay ? '#4ADE80' : isConquered ? '#22C55E' : '#38BDF8'}
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
        <span className="text-[10px] font-extrabold tracking-widest uppercase text-zinc-400">
          CORE PERFORMANCE
        </span>

        {/* Big percentage display */}
        <div className="flex items-baseline justify-center gap-0.5 my-0.5">
          <motion.span
            key={percent}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-black tracking-tight text-white"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {percent}%
          </motion.span>
        </div>

        {/* XP sub-stat */}
        <span className="text-[11px] font-semibold text-zinc-400">
          {currentXp} / {goalXp} XP
        </span>

        {/* Status Pill Badge */}
        {isPerfectDay ? (
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 mt-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black tracking-wide shadow-[0_0_10px_rgba(52,211,153,0.3)]">
            <span>PERFECT DAY</span>
            <span>💎</span>
          </div>
        ) : isConquered ? (
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 mt-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 text-[10px] font-black tracking-wide">
            <span>DAY CONQUERED</span>
            <span>✓</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1 px-2 py-0.5 mt-1.5 rounded-full bg-zinc-800/80 text-zinc-400 text-[10px] font-bold tracking-wide">
            <span>{dailyRank}</span>
          </div>
        )}
      </div>
    </div>
  );
};
