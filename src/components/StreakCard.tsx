import React from 'react';
import { Flame, Trophy, CheckCircle, Diamond } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StreakCard: React.FC = () => {
  const { streakStats } = useApp();

  return (
    <div className="bg-[#14171D] rounded-2xl p-3.5 border border-white/[0.08] shadow-sm">
      <div className="grid grid-cols-4 gap-2 text-center">
        {/* Current Streak */}
        <div className="flex flex-col items-center p-2 rounded-xl bg-zinc-900/90 border border-white/[0.05]">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/20 mb-1">
            <Flame className="w-4 h-4" />
          </div>
          <span className="text-base font-black text-white leading-tight">
            {streakStats.currentStreak}
          </span>
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">
            Streak
          </span>
        </div>

        {/* Best Streak */}
        <div className="flex flex-col items-center p-2 rounded-xl bg-zinc-900/90 border border-white/[0.05]">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 mb-1">
            <Trophy className="w-4 h-4" />
          </div>
          <span className="text-base font-black text-white leading-tight">
            {streakStats.longestStreak}
          </span>
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">
            Best
          </span>
        </div>

        {/* Conquered Days */}
        <div className="flex flex-col items-center p-2 rounded-xl bg-zinc-900/90 border border-white/[0.05]">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 mb-1">
            <CheckCircle className="w-4 h-4" />
          </div>
          <span className="text-base font-black text-white leading-tight">
            {streakStats.totalSuccessfulDays}
          </span>
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">
            Conquered
          </span>
        </div>

        {/* Perfect Days */}
        <div className="flex flex-col items-center p-2 rounded-xl bg-zinc-900/90 border border-white/[0.05]">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 mb-1">
            <Diamond className="w-4 h-4" />
          </div>
          <span className="text-base font-black text-white leading-tight">
            {streakStats.totalPerfectDays}
          </span>
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">
            100% Days
          </span>
        </div>
      </div>
    </div>
  );
};
