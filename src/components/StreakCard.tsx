import React from 'react';
import { Flame, Trophy, CheckCircle, Diamond } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StreakCard: React.FC = () => {
  const { streakStats } = useApp();

  return (
    <div className="bg-white rounded-2xl p-3.5 border border-[#EEEDE9] shadow-xs">
      <div className="grid grid-cols-4 gap-2 text-center">
        {/* Current Streak */}
        <div className="flex flex-col items-center p-2 rounded-xl bg-[#F7F6F2] border border-[#EEEDE9]">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#DCEAF4] text-[#12324A] mb-1">
            <Flame className="w-4 h-4 stroke-[1.75]" />
          </div>
          <span className="text-base font-black text-[#0D1B2A] leading-tight">
            {streakStats.currentStreak}
          </span>
          <span className="text-[9px] font-bold text-[#68727D] uppercase tracking-tight">
            Streak
          </span>
        </div>

        {/* Best Streak */}
        <div className="flex flex-col items-center p-2 rounded-xl bg-[#F7F6F2] border border-[#EEEDE9]">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#DCEAF4] text-[#12324A] mb-1">
            <Trophy className="w-4 h-4 stroke-[1.75]" />
          </div>
          <span className="text-base font-black text-[#0D1B2A] leading-tight">
            {streakStats.longestStreak}
          </span>
          <span className="text-[9px] font-bold text-[#68727D] uppercase tracking-tight">
            Best
          </span>
        </div>

        {/* Conquered Days */}
        <div className="flex flex-col items-center p-2 rounded-xl bg-[#F7F6F2] border border-[#EEEDE9]">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#DCEAF4] text-[#12324A] mb-1">
            <CheckCircle className="w-4 h-4 stroke-[1.75]" />
          </div>
          <span className="text-base font-black text-[#0D1B2A] leading-tight">
            {streakStats.totalSuccessfulDays}
          </span>
          <span className="text-[9px] font-bold text-[#68727D] uppercase tracking-tight">
            Conquered
          </span>
        </div>

        {/* Perfect Days */}
        <div className="flex flex-col items-center p-2 rounded-xl bg-[#F7F6F2] border border-[#EEEDE9]">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#DCEAF4] text-[#12324A] mb-1">
            <Diamond className="w-4 h-4 stroke-[1.75]" />
          </div>
          <span className="text-base font-black text-[#0D1B2A] leading-tight">
            {streakStats.totalPerfectDays}
          </span>
          <span className="text-[9px] font-bold text-[#68727D] uppercase tracking-tight">
            100% Days
          </span>
        </div>
      </div>
    </div>
  );
};
