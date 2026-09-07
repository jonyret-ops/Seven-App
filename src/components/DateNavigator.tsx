import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { addDays, getDaysDifference, formatOrdinalDate } from '../lib/calculations';

interface DateNavigatorProps {
  date?: string;
  onDateChange?: (newDate: string) => void;
  minDate?: string;
  maxDate?: string;
}

export const DateNavigator: React.FC<DateNavigatorProps> = ({
  date,
  onDateChange,
  minDate,
  maxDate,
}) => {
  const {
    selectedDate: appSelectedDate,
    setSelectedDate: setAppSelectedDate,
    activeTodayDate,
    currentArc,
    isDateFuture,
  } = useApp();

  const activeDate = date ?? appSelectedDate;
  const setActiveDate = onDateChange ?? setAppSelectedDate;

  const isViewingToday = activeDate === activeTodayDate;
  const isViewingYesterday = activeDate === addDays(activeTodayDate, -1);
  const isTomorrow = activeDate === addDays(activeTodayDate, 1);
  const isFuture = isDateFuture(activeDate);

  // Dynamic Arc boundaries determine navigation limits:
  // Earliest Arc date = currentArc.startDate
  // Latest Arc date = currentArc.endDate
  const minBackwardDate = minDate || currentArc?.startDate;
  const maxForwardDate = maxDate || currentArc?.endDate;

  const canGoBack = minBackwardDate ? activeDate > minBackwardDate : true;
  const canGoForward = maxForwardDate ? activeDate < maxForwardDate : true;

  const handlePrevDay = () => {
    if (canGoBack) {
      setActiveDate(addDays(activeDate, -1));
    }
  };

  const handleNextDay = () => {
    if (canGoForward) {
      setActiveDate(addDays(activeDate, 1));
    }
  };

  // Day number relative to current Arc start
  const arcDayNumber = useMemo(() => {
    if (!currentArc?.startDate) return 1;
    const diff = getDaysDifference(currentArc.startDate, activeDate) + 1;
    return Math.max(1, diff);
  }, [currentArc?.startDate, activeDate]);

  // Formatted date string with ordinal suffix (e.g. "Mon, Sep 7th")
  const formattedDate = useMemo(() => {
    return formatOrdinalDate(activeDate, { includeWeekday: true, shortMonth: true, omitYear: true });
  }, [activeDate]);

  return (
    <section className="bg-white rounded-3xl p-3 border border-[#EEEDE9] shadow-xs flex items-center justify-between select-none">
      <button
        type="button"
        onClick={handlePrevDay}
        disabled={!canGoBack}
        aria-label="Previous day"
        className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
          canGoBack
            ? 'text-[#12324A] hover:bg-[#F2F1ED] cursor-pointer'
            : 'text-[#EEEDE9] cursor-not-allowed opacity-40'
        }`}
      >
        <ChevronLeft className="w-5 h-5 stroke-[1.75]" />
      </button>

      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black text-[#68727D] tracking-wider uppercase">
            DAY {arcDayNumber}
          </span>

          {isViewingToday && (
            <span className="px-2 py-0.2 rounded-full bg-[#DCEAF4] text-[#12324A] text-[10px] font-black tracking-wider uppercase">
              TODAY
            </span>
          )}

          {isViewingYesterday && (
            <span className="px-2 py-0.2 rounded-full bg-[#EEEDE9] text-[#68727D] text-[10px] font-black tracking-wider uppercase">
              YESTERDAY
            </span>
          )}

          {isTomorrow && (
            <span className="px-2 py-0.2 rounded-full bg-[#DCEAF4] text-[#12324A] text-[10px] font-black tracking-wider uppercase">
              TOMORROW
            </span>
          )}

          {isFuture && !isTomorrow && (
            <span className="px-2 py-0.2 rounded-full bg-[#EEEDE9] text-[#68727D] text-[10px] font-black tracking-wider uppercase">
              PREVIEW
            </span>
          )}
        </div>

        <span className="text-sm font-black text-[#0D1B2A] mt-0.5">
          {formattedDate}
        </span>
      </div>

      <button
        type="button"
        onClick={handleNextDay}
        disabled={!canGoForward}
        aria-label="Next day"
        className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
          canGoForward
            ? 'text-[#12324A] hover:bg-[#F2F1ED] cursor-pointer'
            : 'text-[#EEEDE9] cursor-not-allowed opacity-40'
        }`}
      >
        <ChevronRight className="w-5 h-5 stroke-[1.75]" />
      </button>
    </section>
  );
};
