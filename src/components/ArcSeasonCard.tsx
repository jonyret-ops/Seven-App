import React from 'react';
import { Mountain, ChevronRight, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getDaysDifference } from '../lib/calculations';

interface ArcSeasonCardProps {
  onOpenArcModal: () => void;
}

export const ArcSeasonCard: React.FC<ArcSeasonCardProps> = ({ onOpenArcModal }) => {
  const { currentArc, activeTodayDate } = useApp();

  const totalDays = Math.max(1, getDaysDifference(currentArc.startDate, currentArc.endDate));
  const daysPassed = Math.max(1, Math.min(totalDays, getDaysDifference(currentArc.startDate, activeTodayDate) + 1));
  const daysLeft = Math.max(0, totalDays - daysPassed);
  const percentComplete = Math.min(100, Math.round((daysPassed / totalDays) * 100));

  return (
    <div
      onClick={onOpenArcModal}
      className="bg-[#14171D] rounded-2xl p-3.5 border border-white/[0.08] shadow-sm hover:border-emerald-500/40 transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 flex items-center justify-center">
            <Mountain className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black tracking-widest uppercase text-emerald-400">
                ACTIVE ARC
              </span>
              <span className="text-[10px] text-zinc-500">•</span>
              <span className="text-[10px] font-bold text-zinc-400">
                {percentComplete}% Complete
              </span>
            </div>
            <h3 className="text-sm font-black text-white tracking-tight group-hover:text-emerald-300 transition-colors">
              {currentArc.name}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1 text-zinc-500 group-hover:text-zinc-300">
          <span className="text-[11px] font-bold text-zinc-400">
            Day {daysPassed}/{totalDays}
          </span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>

      {/* Progress track */}
      <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-zinc-800">
        <div
          className="h-full rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.3)] transition-all duration-500"
          style={{ width: `${percentComplete}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[10px] font-medium text-zinc-400 mt-1.5">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-zinc-500" />
          <span>{currentArc.startDate} to {currentArc.endDate}</span>
        </span>
        <span className="text-emerald-400 font-bold">
          {daysLeft} days remaining
        </span>
      </div>
    </div>
  );
};
