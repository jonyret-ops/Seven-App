import React from 'react';
import { Sparkles, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DailyBonusCard: React.FC = () => {
  const { todayBonusObjective, currentLog, toggleBonusObjective, isDateFuture, selectedDate } = useApp();

  const isCompleted = currentLog.completedBonusObjectiveId === todayBonusObjective.id;
  const isLocked = isDateFuture(selectedDate);

  return (
    <div className={`p-3.5 rounded-2xl border transition-all ${
      isCompleted
        ? 'bg-[#F7F6F2] border-[#EEEDE9] opacity-90'
        : 'bg-white border-[#EEEDE9] shadow-xs'
    }`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#DCEAF4] text-[#12324A] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 stroke-[1.75]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black tracking-widest uppercase text-[#68727D]">
                DAILY BONUS OBJECTIVE
              </span>
              <span className="text-[9px] font-bold text-[#68727D]">•</span>
              <span className="text-[10px] font-bold text-[#4A90C2]">
                +{todayBonusObjective.xp} BONUS XP
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#0D1B2A] tracking-tight truncate">
              {todayBonusObjective.title}
            </h4>
            <p className="text-[11px] text-[#68727D] line-clamp-1">
              {todayBonusObjective.description}
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={isLocked}
          onClick={toggleBonusObjective}
          className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
            isCompleted
              ? 'bg-[#12324A] text-white'
              : 'bg-[#F7F6F2] hover:bg-[#EEEDE9] text-[#12324A] border border-[#EEEDE9]'
          } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isCompleted ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>CLAIMED</span>
            </>
          ) : (
            <span>CLAIM</span>
          )}
        </button>
      </div>
    </div>
  );
};
