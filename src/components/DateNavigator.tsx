import React from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { addDays, parseDate, getDaysDifference } from '../lib/calculations';

export const DateNavigator: React.FC = () => {
  const { selectedDate, setSelectedDate, activeTodayDate, isDateFuture, currentArc } = useApp();

  const handlePrevDay = () => {
    setSelectedDate(addDays(selectedDate, -1));
  };

  const handleNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const handleJumpToToday = () => {
    setSelectedDate(activeTodayDate);
  };

  const dateObj = parseDate(selectedDate);
  const formattedDayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  const formattedMonthDay = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const isToday = selectedDate === activeTodayDate;
  const isFuture = isDateFuture(selectedDate);

  const arcDayDiff = getDaysDifference(currentArc.startDate, selectedDate);
  const arcDayLabel = arcDayDiff >= 0 ? `Day ${arcDayDiff + 1}` : 'Pre-Arc';

  return (
    <div className="bg-[#14171D] rounded-2xl p-3 border border-white/[0.08] shadow-sm flex items-center justify-between gap-2">
      <button
        type="button"
        onClick={handlePrevDay}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer"
        aria-label="Previous day"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-extrabold tracking-wider uppercase text-emerald-400">
            {arcDayLabel}
          </span>
          {isToday && (
            <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
              TODAY
            </span>
          )}
          {isFuture && (
            <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
              LOCKED
            </span>
          )}
        </div>

        <span className="text-sm font-extrabold text-white tracking-tight">
          {formattedDayOfWeek}, {formattedMonthDay}
        </span>
      </div>

      <div className="flex items-center gap-1">
        {!isToday && (
          <button
            type="button"
            onClick={handleJumpToToday}
            className="h-8 px-2 rounded-xl flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all cursor-pointer"
            title="Jump to Today"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Today</span>
          </button>
        )}
        <button
          type="button"
          onClick={handleNextDay}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer"
          aria-label="Next day"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
