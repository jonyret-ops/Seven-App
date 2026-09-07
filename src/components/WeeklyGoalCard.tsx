import React from 'react';
import { Target, CheckCircle2, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WeeklyGoalCard: React.FC = () => {
  const {
    activeWeeklyGoal,
    weeklyGoalProgress,
    weeklyGoalTarget,
    weeklyGoalPercent,
    isWeeklyGoalCompleted,
  } = useApp();

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#EEEDE9] shadow-xs relative overflow-hidden transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 bg-[#DCEAF4] text-[#12324A]">
            {isWeeklyGoalCompleted ? (
              <CheckCircle2 className="w-4 h-4 stroke-[1.75]" />
            ) : (
              <Target className="w-4 h-4 stroke-[1.75]" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-widest uppercase text-[#68727D]">
                WEEKLY DIRECTIVE
              </span>
              {isWeeklyGoalCompleted && (
                <span className="px-2 py-0.5 rounded-full bg-[#DCEAF4] text-[#12324A] text-[9px] font-black tracking-wide">
                  ACHIEVED
                </span>
              )}
            </div>
            <h3 className="text-sm font-black text-[#0D1B2A] truncate mt-0.5">
              {activeWeeklyGoal.title}
            </h3>
          </div>
        </div>

        {/* XP Reward Badge */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#F7F6F2] border border-[#EEEDE9] text-[#12324A] text-xs font-black shrink-0">
          <Zap className="w-3.5 h-3.5 fill-[#12324A] stroke-[1.75]" />
          <span>+{activeWeeklyGoal.xpReward} XP</span>
        </div>
      </div>

      <p className="text-xs text-[#68727D] mt-2 leading-relaxed">
        {activeWeeklyGoal.description}
      </p>

      {/* Progress Bar & Stats */}
      <div className="mt-4 pt-3 border-t border-[#EEEDE9]">
        <div className="flex items-center justify-between text-xs font-bold mb-1.5">
          <span className="text-[#68727D]">Cycle Progress</span>
          <div className="flex items-baseline gap-1">
            <span className="text-[#0D1B2A] font-black">
              {weeklyGoalProgress.toLocaleString()}
            </span>
            <span className="text-[#68727D] text-[11px]">
              / {weeklyGoalTarget.toLocaleString()} {activeWeeklyGoal.unit}
            </span>
            <span className="text-[11px] ml-1 font-black text-[#4A90C2]">
              ({weeklyGoalPercent}%)
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-2 rounded-full bg-[#EEEDE9] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 bg-[#12324A]"
            style={{ width: `${weeklyGoalPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
