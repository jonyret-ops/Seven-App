import React from 'react';
import { Mountain, ChevronRight, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getDaysDifference, formatHumanDateRange } from '../lib/calculations';

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
      className="bg-white rounded-2xl p-3.5 border border-[#EEEDE9] shadow-xs hover:border-[#4A90C2] transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#DCEAF4] text-[#12324A] flex items-center justify-center">
            <Mountain className="w-4 h-4 stroke-[1.75]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black tracking-widest uppercase text-[#68727D]">
                ACTIVE ARC
              </span>
              <span className="text-[10px] text-[#68727D]">•</span>
              <span className="text-[10px] font-bold text-[#4A90C2]">
                {percentComplete}% Complete
              </span>
            </div>
            <h3 className="text-sm font-black text-[#0D1B2A] tracking-tight group-hover:text-[#12324A] transition-colors">
              {currentArc.name}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[#68727D] group-hover:text-[#0D1B2A]">
          <span className="text-[11px] font-bold">
            Day {daysPassed}/{totalDays}
          </span>
          <ChevronRight className="w-4 h-4 stroke-[1.75] transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>

      {/* Progress track */}
      <div className="w-full bg-[#EEEDE9] rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full bg-[#12324A] transition-all duration-500"
          style={{ width: `${percentComplete}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[10px] font-medium text-[#68727D] mt-1.5">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3 stroke-[1.75]" />
          <span>{formatHumanDateRange(currentArc.startDate, currentArc.endDate)}</span>
        </span>
        <span className="text-[#4A90C2] font-bold">
          {daysLeft} days remaining
        </span>
      </div>
    </div>
  );
};
