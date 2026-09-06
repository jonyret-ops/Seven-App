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
        ? 'bg-[#151D18] border-emerald-500/30 shadow-sm'
        : 'bg-[#14171D] border-white/[0.07] shadow-xs'
    }`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/25 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black tracking-widest uppercase text-amber-400">
                DAILY BONUS OBJECTIVE
              </span>
              <span className="text-[9px] font-bold text-zinc-500">•</span>
              <span className="text-[10px] font-bold text-amber-400/90">
                +{todayBonusObjective.xp} BONUS XP
              </span>
            </div>
            <h4 className="text-sm font-bold text-white tracking-tight truncate">
              {todayBonusObjective.title}
            </h4>
            <p className="text-[11px] text-zinc-400 line-clamp-1">
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
              ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(52,211,153,0.3)]'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
          } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isCompleted ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
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
