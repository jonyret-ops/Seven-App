import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Sparkles, 
  Footprints, 
  Moon, 
  Target, 
  Lock,
  Flame,
  Dumbbell,
  Clock,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { DAILY_QUESTS, SIDE_QUESTS } from '../../constants';
import { useApp } from '../../context/AppContext';
import { QuestDefinition } from '../../types';
import { addDays, getDaysDifference, calculateStepXp, calculateSleepXp, formatOrdinalDate } from '../../lib/calculations';
import { DateNavigator } from '../DateNavigator';

export type PrimaryQuestTab = 'all' | 'core' | 'side' | 'bonus';

export type SecondaryCategoryFilter = 
  | 'morning' 
  | 'afternoon' 
  | 'evening' 
  | 'nutrition' 
  | 'fitness' 
  | 'faith' 
  | 'discipline' 
  | 'trackers';

export const QuestsScreen: React.FC = () => {
  const {
    currentLog,
    selectedDate,
    setSelectedDate,
    activeTodayDate,
    currentArc,
    todayBonusObjective,
    toggleBooleanQuest,
    toggleQuestNA,
    toggleSideQuest,
    toggleBonusObjective,
    setSteps,
    setSleep,
    setDailyFocus,
    isDateFuture,
  } = useApp();

  const [primaryTab, setPrimaryTab] = useState<PrimaryQuestTab>('all');
  const [secondaryFilter, setSecondaryFilter] = useState<SecondaryCategoryFilter | null>(null);
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);
  const [expandedQuestId, setExpandedQuestId] = useState<string | null>(null);

  // Local state for numeric inputs to allow seamless freeform typing
  const [stepsInputValue, setStepsInputValue] = useState<string>(
    currentLog.steps && currentLog.steps > 0 ? String(currentLog.steps) : ''
  );
  const [sleepInputValue, setSleepInputValue] = useState<string>(
    currentLog.sleepHours && currentLog.sleepHours > 0 ? String(currentLog.sleepHours) : ''
  );

  useEffect(() => {
    setStepsInputValue(currentLog.steps && currentLog.steps > 0 ? String(currentLog.steps) : '');
  }, [currentLog.steps, selectedDate]);

  useEffect(() => {
    setSleepInputValue(currentLog.sleepHours && currentLog.sleepHours > 0 ? String(currentLog.sleepHours) : '');
  }, [currentLog.sleepHours, selectedDate]);

  const isFuture = isDateFuture(selectedDate);
  const isViewingToday = selectedDate === activeTodayDate;
  const isViewingYesterday = selectedDate === addDays(activeTodayDate, -1);
  const isTomorrow = selectedDate === addDays(activeTodayDate, 1);

  // Allow forward navigation up to 14 days ahead
  const maxFutureDate = addDays(activeTodayDate, 14);
  const canGoForward = selectedDate < maxFutureDate;

  // Date Navigation handlers
  const handlePrevDay = () => {
    setSelectedDate(addDays(selectedDate, -1));
  };

  const handleNextDay = () => {
    if (canGoForward) {
      setSelectedDate(addDays(selectedDate, 1));
    }
  };

  // Day number in arc
  const arcDayNumber = useMemo(() => {
    if (!currentArc?.startDate) return 1;
    const diff = getDaysDifference(currentArc.startDate, selectedDate) + 1;
    return Math.max(1, diff);
  }, [currentArc?.startDate, selectedDate]);

  // Formatted date string with ordinal suffix
  const formattedDate = useMemo(() => {
    return formatOrdinalDate(selectedDate, { includeWeekday: true, shortMonth: true, omitYear: true });
  }, [selectedDate]);

  // Side quests completion count
  const completedSideCount = (currentLog.completedSideQuestIds || []).length;

  const primaryTabs: { id: PrimaryQuestTab; label: string }[] = [
    { id: 'all', label: 'All Quests' },
    { id: 'core', label: 'Core' },
    { id: 'side', label: `Side Quests ${completedSideCount}/${SIDE_QUESTS.length}` },
    { id: 'bonus', label: 'Bonus' },
  ];

  const secondaryFilterOptions: { id: SecondaryCategoryFilter; label: string }[] = [
    { id: 'morning', label: 'Morning' },
    { id: 'afternoon', label: 'Afternoon' },
    { id: 'evening', label: 'Evening' },
    { id: 'nutrition', label: 'Nutrition' },
    { id: 'fitness', label: 'Fitness' },
    { id: 'faith', label: 'Faith' },
    { id: 'discipline', label: 'Discipline' },
    { id: 'trackers', label: 'Trackers' },
  ];

  // Quests filtered based on primary tab and secondary filter
  const filteredQuests = useMemo(() => {
    let baseList = DAILY_QUESTS;
    if (primaryTab === 'core') {
      baseList = DAILY_QUESTS.filter((q) => !q.isOptional);
    }

    if (!secondaryFilter) {
      return baseList;
    }

    if (secondaryFilter === 'trackers') {
      return baseList.filter((q) => q.type === 'numeric' || q.type === 'focus');
    }
    if (secondaryFilter === 'morning') {
      return baseList.filter((q) => q.timePeriod === 'morning');
    }
    if (secondaryFilter === 'afternoon') {
      return baseList.filter((q) => q.timePeriod === 'afternoon');
    }
    if (secondaryFilter === 'evening') {
      return baseList.filter((q) => q.timePeriod === 'evening');
    }
    if (secondaryFilter === 'nutrition') {
      return baseList.filter((q) => q.category === 'nutrition');
    }
    if (secondaryFilter === 'fitness') {
      return baseList.filter((q) => q.category === 'fitness');
    }
    if (secondaryFilter === 'faith') {
      return baseList.filter((q) => q.category === 'faith');
    }
    if (secondaryFilter === 'discipline') {
      return baseList.filter((q) => q.category === 'discipline');
    }

    return baseList;
  }, [primaryTab, secondaryFilter]);

  // Core metrics
  const corePerf = currentLog?.corePerformancePercent ?? 0;
  const coreEarned = currentLog?.corePointsEarned ?? 0;
  const coreAvailable = currentLog?.corePointsAvailable && currentLog.corePointsAvailable > 0
    ? currentLog.corePointsAvailable
    : 100;

  const currentStepVal = currentLog?.steps || 0;
  const currentSleepVal = currentLog?.sleepHours || 0;

  return (
    <div className="space-y-4 select-none">
      {/* Header */}
      <header className="flex items-center justify-between pt-1 pb-1">
        <div>
          <h1 className="text-2xl font-black text-[#0D1B2A] tracking-tight">
            Quest Log
          </h1>
          <p className="text-xs font-semibold text-[#68727D] mt-0.5">
            Execute the standard daily discipline
          </p>
        </div>
      </header>

      {/* Date Navigation (Consistent Reusable Component) */}
      <DateNavigator />

      {/* Future Day Read-Only Indicator Banner */}
      {isFuture && (
        <div className="bg-[#DCEAF4]/60 border border-[#4A90C2]/30 rounded-2xl p-3.5 text-center space-y-0.5">
          <div className="flex items-center justify-center gap-1.5 text-xs font-black text-[#12324A] tracking-wider uppercase">
            <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>FUTURE DAY — PREVIEW ONLY</span>
          </div>
          <p className="text-[11px] text-[#68727D] font-medium">
            Viewing future quest schedule. Actions and check-ins remain locked until this day arrives.
          </p>
        </div>
      )}

      {/* Core Performance Summary Card */}
      <section className="bg-white rounded-3xl p-4 border border-[#EEEDE9] shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[#0D1B2A] uppercase tracking-wider">
              CORE DISCIPLINE
            </span>
            <span className="px-2 py-0.2 rounded-full bg-[#DCEAF4] text-[#12324A] text-[10px] font-black">
              {corePerf}%
            </span>
          </div>

          <span className="text-xs font-bold text-[#68727D]">
            {coreEarned} / {coreAvailable} XP
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-[#EEEDE9] overflow-hidden">
          <div
            className="h-full bg-[#4A90C2] rounded-full transition-all duration-500"
            style={{ width: `${corePerf}%` }}
          />
        </div>
      </section>

      {/* 1. Primary Navigation Tabs & Secondary Filter Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          {/* 4 Primary Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 flex-1">
            {primaryTabs.map((tab) => {
              const isActive = primaryTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPrimaryTab(tab.id)}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
                    isActive
                      ? 'bg-[#12324A] text-white shadow-xs'
                      : 'bg-white text-[#68727D] border border-[#EEEDE9] hover:text-[#0D1B2A] hover:bg-[#F7F6F2]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Secondary Filter Control Button */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className={`min-h-[36px] px-3 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                secondaryFilter
                  ? 'bg-[#12324A] text-white border-[#12324A] shadow-xs'
                  : showFilterDrawer
                  ? 'bg-[#F2F1ED] text-[#0D1B2A] border-[#EEEDE9]'
                  : 'bg-white text-[#68727D] border-[#EEEDE9] hover:text-[#0D1B2A] hover:bg-[#F7F6F2]'
              }`}
              title="Filter quests by category or time"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2]" />
              <span>{secondaryFilter ? secondaryFilterOptions.find((o) => o.id === secondaryFilter)?.label : 'Filter'}</span>
              {secondaryFilter && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#4A90C2]" />
              )}
            </button>

            {secondaryFilter && (
              <button
                type="button"
                onClick={() => setSecondaryFilter(null)}
                aria-label="Clear filter"
                className="w-8 h-8 rounded-full bg-white border border-[#EEEDE9] text-[#68727D] hover:text-[#0D1B2A] flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                title="Clear filter"
              >
                <X className="w-3.5 h-3.5 stroke-[2.2]" />
              </button>
            )}
          </div>
        </div>

        {/* Secondary Filter Options (Expandable) */}
        {showFilterDrawer && (
          <div className="bg-white p-3 rounded-2xl border border-[#EEEDE9] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-[#68727D] uppercase tracking-wider">
                Filter Quests
              </span>
              {secondaryFilter && (
                <button
                  type="button"
                  onClick={() => setSecondaryFilter(null)}
                  className="text-[11px] font-bold text-[#4A90C2] hover:underline cursor-pointer"
                >
                  Clear filter
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {secondaryFilterOptions.map((opt) => {
                const isSelected = secondaryFilter === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSecondaryFilter(isSelected ? null : opt.id);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#12324A] text-white shadow-xs'
                        : 'bg-[#F7F6F2] text-[#68727D] hover:text-[#0D1B2A] hover:bg-[#EEEDE9]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Quests List */}
      <div className="space-y-2.5">
        {primaryTab === 'side' ? (
          // Side Quests
          SIDE_QUESTS.map((side) => {
            const isCompleted = (currentLog.completedSideQuestIds || []).includes(side.id);

            return (
              <div
                key={side.id}
                onClick={() => !isFuture && toggleSideQuest(side.id)}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                  isFuture
                    ? 'bg-[#F7F6F2] border-[#EEEDE9] opacity-75 cursor-not-allowed'
                    : isCompleted
                    ? 'bg-[#F7F6F2] border-[#EEEDE9] cursor-pointer'
                    : 'bg-white border-[#EEEDE9] hover:border-[#4A90C2] cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 transition-all ${
                      isCompleted
                        ? 'bg-[#12324A] border-[#12324A] text-white'
                        : 'border-[#68727D]/40 bg-white'
                    }`}
                  >
                    {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="min-w-0">
                    <h3
                      className={`text-xs font-black truncate ${
                        isCompleted ? 'line-through text-[#68727D]' : 'text-[#0D1B2A]'
                      }`}
                    >
                      {side.title}
                    </h3>
                    <p className="text-[11px] text-[#68727D] font-medium truncate mt-0.5">
                      {side.description}
                    </p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-md bg-[#DCEAF4] text-[#12324A] text-[10px] font-black shrink-0">
                  +{side.xp} XP
                </span>
              </div>
            );
          })
        ) : primaryTab === 'bonus' ? (
          <div className="space-y-3">
            {todayBonusObjective && (
              <div className="bg-white rounded-3xl p-5 border border-[#EEEDE9] shadow-xs space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#4A90C2]" />
                    <span className="text-[10px] font-black text-[#68727D] uppercase tracking-wider">
                      DAILY BONUS OBJECTIVE
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#DCEAF4] text-[#12324A] text-[10px] font-black">
                    +{todayBonusObjective.xp} XP
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-black text-[#0D1B2A] tracking-tight">
                    {todayBonusObjective.title}
                  </h3>
                  <p className="text-xs text-[#68727D] font-medium leading-relaxed">
                    {todayBonusObjective.description}
                  </p>
                  {todayBonusObjective.quote && (
                    <p className="text-[11px] font-semibold text-[#4A90C2] italic pt-1">
                      "{todayBonusObjective.quote}"
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  disabled={isFuture}
                  onClick={toggleBonusObjective}
                  className={`w-full py-3 px-4 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px] ${
                    isFuture
                      ? 'bg-[#F7F6F2] text-[#68727D] cursor-not-allowed'
                      : currentLog.completedBonusObjectiveId === todayBonusObjective.id
                      ? 'bg-[#DCEAF4] text-[#12324A] border border-[#4A90C2]/30'
                      : 'bg-[#12324A] hover:bg-[#0D1B2A] text-white shadow-xs'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>
                    {currentLog.completedBonusObjectiveId === todayBonusObjective.id
                      ? 'Bonus Completed (+15 XP Earned)'
                      : 'Mark Bonus Objective Completed'}
                  </span>
                </button>
              </div>
            )}

            {/* Optional Quests that award bonus XP */}
            {DAILY_QUESTS.filter((q) => q.isOptional).map((quest) => {
              const isCompleted = (currentLog.completedQuestIds || []).includes(quest.id);
              return (
                <div
                  key={quest.id}
                  onClick={() => !isFuture && toggleBooleanQuest(quest.id)}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    isFuture
                      ? 'bg-[#F7F6F2] border-[#EEEDE9] opacity-75 cursor-not-allowed'
                      : isCompleted
                      ? 'bg-[#F7F6F2] border-[#EEEDE9] cursor-pointer'
                      : 'bg-white border-[#EEEDE9] hover:border-[#4A90C2] cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 transition-all ${
                        isCompleted
                          ? 'bg-[#12324A] border-[#12324A] text-white'
                          : 'border-[#68727D]/40 bg-white'
                      }`}
                    >
                      {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div className="min-w-0">
                      <h3
                        className={`text-xs font-black truncate ${
                          isCompleted ? 'line-through text-[#68727D]' : 'text-[#0D1B2A]'
                        }`}
                      >
                        {quest.title}
                      </h3>
                      <p className="text-[11px] text-[#68727D] font-medium truncate mt-0.5">
                        {quest.description}
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-md bg-[#DCEAF4] text-[#12324A] text-[10px] font-black shrink-0">
                    +{quest.baseXp} XP
                  </span>
                </div>
              );
            })}
          </div>
        ) : filteredQuests.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-[#EEEDE9] space-y-2">
            <p className="text-xs font-bold text-[#68727D]">No quests match this filter.</p>
            {secondaryFilter && (
              <button
                type="button"
                onClick={() => setSecondaryFilter(null)}
                className="text-xs font-black text-[#4A90C2] hover:underline cursor-pointer"
              >
                Clear filter to view all {primaryTab === 'core' ? 'core' : ''} quests
              </button>
            )}
          </div>
        ) : (
          // Standard / Daily Core Quests
          filteredQuests.map((quest) => {
            const isCompleted = (currentLog.completedQuestIds || []).includes(quest.id);
            const isNA = (currentLog.naQuestIds || []).includes(quest.id);
            const isExpanded = expandedQuestId === quest.id;

            // Handle Exact Numeric Steps Tracker (No presets!)
            if (quest.id === 'steps') {
              const stepXp = calculateStepXp(currentStepVal);
              const isBonus = currentStepVal >= 12000;

              return (
                <div
                  key={quest.id}
                  className="bg-white rounded-2xl p-4 border border-[#EEEDE9] shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#DCEAF4] text-[#12324A] flex items-center justify-center">
                        <Footprints className="w-4 h-4 stroke-[2]" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-[#0D1B2A]">Daily Steps</h3>
                        <div className="text-[10px] text-[#68727D] font-semibold">
                          10,000 target (+10 XP) · 12,000+ Extra Mile (+12 XP)
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-black ${
                        isBonus
                          ? 'bg-[#12324A] text-white'
                          : stepXp >= 10
                          ? 'bg-[#DCEAF4] text-[#12324A]'
                          : stepXp > 0
                          ? 'bg-[#F2F1ED] text-[#12324A]'
                          : 'bg-[#F7F6F2] text-[#68727D]'
                      }`}>
                        +{stepXp} XP {isBonus ? '⚡ Bonus' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Freeform Numeric Input for Exact Step Count */}
                  <div className="space-y-1">
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        disabled={isFuture}
                        value={stepsInputValue}
                        placeholder="e.g. 10,432"
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/[^0-9]/g, '');
                          setStepsInputValue(cleaned);
                          const parsed = parseInt(cleaned, 10);
                          if (!isNaN(parsed) && !isFuture) {
                            setSteps(parsed);
                          } else if (cleaned === '' && !isFuture) {
                            setSteps(0);
                          }
                        }}
                        className="w-full h-11 px-3.5 bg-[#F7F6F2] border border-[#EEEDE9] rounded-xl text-sm font-black text-[#0D1B2A] placeholder:text-[#68727D]/60 focus:outline-none focus:border-[#4A90C2] disabled:opacity-60"
                      />
                      <span className="absolute right-3.5 top-3 text-xs font-bold text-[#68727D] pointer-events-none">
                        steps
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-semibold text-[#68727D] px-1">
                      <span>&lt;5k: 0 XP · 5k: 2 XP · 8k: 4 XP</span>
                      <span>10k: 10 XP · 12k+: 12 XP</span>
                    </div>
                  </div>
                </div>
              );
            }

            // Handle Exact Decimal Sleep Tracker (No presets!)
            if (quest.id === 'sleep') {
              const sleepXp = calculateSleepXp(currentSleepVal);

              return (
                <div
                  key={quest.id}
                  className="bg-white rounded-2xl p-4 border border-[#EEEDE9] shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#DCEAF4] text-[#12324A] flex items-center justify-center">
                        <Moon className="w-4 h-4 stroke-[2]" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-[#0D1B2A]">Hours Slept</h3>
                        <div className="text-[10px] text-[#68727D] font-semibold">
                          Actual sleep: 7.0–7.9h (+7 XP) · 8.0h+ (+10 XP)
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-black ${
                        sleepXp >= 10
                          ? 'bg-[#12324A] text-white'
                          : sleepXp >= 7
                          ? 'bg-[#DCEAF4] text-[#12324A]'
                          : sleepXp > 0
                          ? 'bg-[#F2F1ED] text-[#12324A]'
                          : 'bg-[#F7F6F2] text-[#68727D]'
                      }`}>
                        +{sleepXp} XP
                      </span>
                    </div>
                  </div>

                  {/* Decimal Numeric Input for Exact Hours Slept */}
                  <div className="space-y-1">
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="24"
                        inputMode="decimal"
                        disabled={isFuture}
                        value={sleepInputValue}
                        placeholder="e.g. 7.5"
                        onChange={(e) => {
                          setSleepInputValue(e.target.value);
                          const parsed = parseFloat(e.target.value);
                          if (!isNaN(parsed) && !isFuture) {
                            setSleep(parsed);
                          } else if (e.target.value === '' && !isFuture) {
                            setSleep(0);
                          }
                        }}
                        className="w-full h-11 px-3.5 bg-[#F7F6F2] border border-[#EEEDE9] rounded-xl text-sm font-black text-[#0D1B2A] placeholder:text-[#68727D]/60 focus:outline-none focus:border-[#4A90C2] disabled:opacity-60"
                      />
                      <span className="absolute right-3.5 top-3 text-xs font-bold text-[#68727D] pointer-events-none">
                        hours
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-semibold text-[#68727D] px-1">
                      <span>&lt;5h: 0 XP · 5-5.9h: 2 XP · 6-6.9h: 4 XP</span>
                      <span>7-7.9h: 7 XP · 8h+: 10 XP</span>
                    </div>
                  </div>
                </div>
              );
            }

            // Handle Daily Focus Rating
            if (quest.id === 'daily_focus') {
              const currentFocusVal = currentLog.focusRating || 0;
              return (
                <div
                  key={quest.id}
                  className="bg-white rounded-2xl p-4 border border-[#EEEDE9] shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#DCEAF4] text-[#12324A] flex items-center justify-center">
                        <Target className="w-4 h-4 stroke-[2]" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-[#0D1B2A]">Daily Focus Rating</h3>
                        <div className="text-[10px] text-[#68727D] font-semibold">
                          Discipline & mental clarity (1–5) · up to +8 XP
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-black text-[#12324A]">
                      {currentFocusVal > 0 ? `${currentFocusVal} / 5` : 'Not rated'}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        disabled={isFuture}
                        onClick={() => !isFuture && setDailyFocus(rating as 1 | 2 | 3 | 4 | 5)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                          currentFocusVal === rating
                            ? 'bg-[#12324A] text-white border-[#12324A]'
                            : 'bg-[#F7F6F2] text-[#0D1B2A] border-[#EEEDE9] hover:bg-[#EEEDE9]'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }

            // Standard Boolean Quests
            return (
              <div
                key={quest.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isCompleted
                    ? 'bg-[#F7F6F2] border-[#EEEDE9]'
                    : isNA
                    ? 'bg-[#F7F6F2] border-[#EEEDE9] opacity-60'
                    : 'bg-white border-[#EEEDE9] hover:border-[#4A90C2]'
                }`}
              >
                <div
                  onClick={() => !isFuture && !isNA && toggleBooleanQuest(quest.id)}
                  className={`p-3.5 flex items-center justify-between ${
                    isFuture || isNA ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 transition-all ${
                        isCompleted
                          ? 'bg-[#12324A] border-[#12324A] text-white shadow-xs'
                          : isNA
                          ? 'bg-[#EEEDE9] border-[#68727D]/40 text-[#68727D]'
                          : isFuture
                          ? 'border-[#68727D]/30 bg-[#F7F6F2]'
                          : 'border-[#68727D]/40 bg-white hover:border-[#4A90C2]'
                      }`}
                    >
                      {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      {isNA && <span className="text-[9px] font-black">NA</span>}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3
                          className={`text-xs font-black truncate transition-all ${
                            isCompleted
                              ? 'line-through text-[#68727D]'
                              : isNA
                              ? 'line-through text-[#68727D]'
                              : 'text-[#0D1B2A]'
                          }`}
                        >
                          {quest.title}
                        </h3>
                        {quest.timePeriod && (
                          <span className="text-[9px] font-bold text-[#68727D]/80 uppercase px-1.5 py-0.2 rounded bg-[#F2F1ED] shrink-0">
                            {quest.timePeriod === 'all_day' ? 'all day' : quest.timePeriod}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#68727D] font-medium truncate mt-0.5">
                        {quest.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-black text-[#68727D]">
                      {quest.baseXp > 0 ? `+${quest.baseXp} XP` : '0 XP'}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedQuestId(isExpanded ? null : quest.id);
                      }}
                      className="p-1 text-[#68727D] hover:text-[#0D1B2A] transition-colors cursor-pointer"
                    >
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-3 pt-1 border-t border-[#EEEDE9] bg-[#F7F6F2] flex items-center justify-between text-xs">
                    <p className="text-[#68727D] text-[11px] max-w-[70%]">
                      {quest.description}
                    </p>

                    {!isFuture && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleQuestNA(quest.id);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white border border-[#EEEDE9] text-[#12324A] text-[11px] font-bold hover:bg-[#EEEDE9] transition-colors cursor-pointer"
                      >
                        {isNA ? 'Mark Active' : 'Mark N/A'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
