import React, { useMemo } from 'react';
import { 
  User, 
  Settings, 
  Footprints, 
  Moon, 
  Target, 
  Scale, 
  ChevronRight, 
  Check, 
  Sparkles, 
  Utensils, 
  ClipboardCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TabType } from '../BottomNavigation';
import { DAILY_QUESTS } from '../../constants';
import { QuestDefinition } from '../../types';
import { getDaysDifference, formatOrdinalDate } from '../../lib/calculations';
import { ProfileIcon } from '../ProfileIcon';
import { SevenLogo } from '../SevenLogo';

interface HomeScreenProps {
  onNavigateTab: (tab: TabType) => void;
  onOpenSettings: () => void;
  onOpenWeightModal: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateTab,
  onOpenSettings,
  onOpenWeightModal,
}) => {
  const {
    profile,
    currentArc,
    dayNumber,
    levelInfo,
    statusSnapshot,
    todayLog,
    activeTodayDate,
    weightStats,
    todayBonusObjective,
    toggleBonusObjective,
    activeWeeklyGoal,
    weeklyGoalProgress,
    weeklyGoalTarget,
    weeklyGoalPercent,
    todayMacros,
    nutritionSettings,
    toggleBooleanQuest,
  } = useApp();

  const userDisplayName = profile.name?.trim();
  const greeting = userDisplayName ? `Hey, ${userDisplayName}` : 'Hey there';

  // 7-day strip format e.g. Mon, Sep 7th
  const { formattedDateString, weekDays } = useMemo(() => {
    let dateObj = new Date();
    try {
      const parts = activeTodayDate.split('-');
      if (parts.length === 3) {
        dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      }
    } catch {}

    const formattedDate = formatOrdinalDate(activeTodayDate, { includeWeekday: true, shortMonth: true, omitYear: true });

    // Calculate Monday of this week
    const dayOfWeek = (dateObj.getDay() + 6) % 7; // 0 for Mon, 6 for Sun
    const monday = new Date(dateObj);
    monday.setDate(dateObj.getDate() - dayOfWeek);

    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((letter, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      return {
        letter,
        dateStr,
        dayNum: d.getDate(),
        isToday: dateStr === activeTodayDate,
      };
    });

    return { formattedDateString: formattedDate, weekDays: days };
  }, [activeTodayDate]);

  // Arc calculation for compact header
  const arcTotalDays = (currentArc?.startDate && currentArc?.endDate)
    ? getDaysDifference(currentArc.startDate, currentArc.endDate) + 1
    : 90;
  const currentArcDay = Math.min(arcTotalDays, dayNumber || 1);

  // Level & Status (Starts cleanly at Level 1 Initiate)
  const userLevel = levelInfo?.currentLevel ?? 1;
  const userTitle = levelInfo?.currentTitle || 'INITIATE';

  // Today's Discipline / Core Performance
  const corePerf = todayLog?.corePerformancePercent ?? 0;
  const coreEarned = todayLog?.corePointsEarned ?? 0;
  const coreAvailable = todayLog?.corePointsAvailable && todayLog.corePointsAvailable > 0
    ? todayLog.corePointsAvailable
    : 100;

  const coreRatingLabel = (() => {
    if (corePerf >= 85) return 'CONQUERED DAY';
    if (corePerf >= 70) return 'SOLID DAY';
    if (corePerf >= 40) return 'ROUGH DAY';
    if (corePerf > 0) return 'IN PROGRESS';
    return 'NOT STARTED';
  })();

  // 2x2 Metric values (Clean starting state from zero; display '—' if not recorded)
  const stepCount = todayLog?.steps !== undefined && todayLog.steps > 0 ? todayLog.steps : null;
  const sleepHours = todayLog?.sleepHours !== undefined && todayLog.sleepHours > 0 ? todayLog.sleepHours : null;
  const focusRating = todayLog?.focusRating !== undefined && todayLog.focusRating > 0 ? todayLog.focusRating : null;
  const currentWeightVal = weightStats?.currentWeight > 0 ? weightStats.currentWeight : null;
  const weightUnitStr = weightStats?.unit || 'lb';

  const isQuestDone = (quest: QuestDefinition): boolean => {
    if (quest.type === 'boolean') {
      return Boolean(todayLog?.completedQuestIds?.includes(quest.id));
    }
    if (quest.type === 'focus') {
      return Boolean(todayLog?.focusRating && todayLog.focusRating > 0);
    }
    if (quest.id === 'steps') {
      return Boolean(todayLog?.steps && todayLog.steps >= (currentArc?.stepTarget || 10000));
    }
    if (quest.id === 'sleep') {
      return Boolean(todayLog?.sleepHours && todayLog.sleepHours >= 7);
    }
    if (quest.id === 'drink_energy_drink') {
      return Boolean(todayLog?.energyDrinkConsumed);
    }
    return false;
  };

  // Next 3 upcoming/incomplete quests, ordered according to their position in the day
  const nextThreeQuests = useMemo(() => {
    const naSet = new Set(todayLog?.naQuestIds || []);
    return DAILY_QUESTS
      .filter((q) => !naSet.has(q.id) && !isQuestDone(q))
      .sort((a, b) => a.order - b.order)
      .slice(0, 3);
  }, [todayLog, currentArc?.stepTarget]);

  const totalDailyQuestsCount = useMemo(() => {
    const naSet = new Set(todayLog?.naQuestIds || []);
    return DAILY_QUESTS.filter((q) => !naSet.has(q.id)).length;
  }, [todayLog?.naQuestIds]);

  return (
    <div className="space-y-4 select-none">
      {/* 1. HEADER: Compact Identity at Top */}
      <header className="flex items-center justify-between pt-0 pb-1">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 shrink-0">
            <SevenLogo size="sm" />
            <span className="text-xs font-black tracking-widest text-[#0D1B2A]">
              SEVEN
            </span>
          </div>
          <div className="h-6 w-px bg-[#EEEDE9] shrink-0 mx-0.5" />
          <div>
            <div className="text-sm font-black text-[#0D1B2A] tracking-tight leading-tight">
              {greeting}
            </div>
            <div className="text-[11px] font-bold text-[#68727D] leading-tight">
              Day {currentArcDay} · {formattedDateString}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Settings"
            className="w-9 h-9 rounded-xl bg-white border border-[#EEEDE9] flex items-center justify-center text-[#68727D] hover:text-[#0D1B2A] hover:bg-[#F2F1ED] transition-colors cursor-pointer shadow-2xs"
          >
            <Settings className="w-4 h-4 stroke-[1.75]" />
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('more')}
            aria-label="Profile"
            className="w-9 h-9 rounded-xl bg-white border border-[#EEEDE9] flex items-center justify-center text-[#12324A] hover:bg-[#F2F1ED] transition-colors cursor-pointer shadow-2xs"
          >
            <ProfileIcon size="sm" />
          </button>
        </div>
      </header>

      {/* Date 7-Day Navigation Strip */}
      <section className="bg-white rounded-2xl p-3 border border-[#EEEDE9] shadow-xs">
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((item) => (
            <div
              key={item.dateStr}
              className={`flex flex-col items-center justify-center py-2 rounded-xl transition-all ${
                item.isToday
                  ? 'bg-[#12324A] text-white font-bold shadow-xs'
                  : 'text-[#68727D] hover:bg-[#F2F1ED]'
              }`}
            >
              <span className={`text-[10px] font-bold ${item.isToday ? 'text-white' : 'text-[#68727D]'}`}>
                {item.letter}
              </span>
              <span className={`text-xs mt-0.5 font-bold ${item.isToday ? 'text-white' : 'text-[#0D1B2A]'}`}>
                {item.dayNum}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. TODAY'S DISCIPLINE: Promoted to the TOP immediately after header/date! */}
      <section className="bg-white rounded-3xl p-5 border border-[#EEEDE9] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#68727D] tracking-wider uppercase">
            TODAY'S DISCIPLINE
          </span>
          <span className="text-xs font-black text-[#12324A]">
            {todayLog?.totalXp ?? coreEarned} / 100 XP
          </span>
        </div>

        <div className="flex items-center gap-5 py-1">
          {/* Muted Blue Circular Progress Ring */}
          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#EEEDE9]"
                strokeWidth="3.2"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#4A90C2] transition-all duration-700 ease-out"
                strokeDasharray={`${Math.min(100, Math.round(((todayLog?.totalXp ?? coreEarned) / 100) * 100))}, 100`}
                strokeWidth="3.2"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-black text-[#0D1B2A] leading-none">
                {Math.min(100, Math.round(((todayLog?.totalXp ?? coreEarned) / 100) * 100))}%
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-1">
            <div className="text-sm font-black text-[#0D1B2A] tracking-tight">
              {(todayLog?.totalXp ?? coreEarned) >= 100 ? 'PERFECT DAY 💎' : 'PROGRESS TO PERFECT DAY'}
            </div>
            <div className="text-xs font-semibold text-[#68727D]">
              {todayLog?.totalXp ?? coreEarned} of 100 XP target earned
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded-md bg-[#F2F1ED] text-[10px] font-black text-[#12324A] tracking-wider uppercase mt-1">
              {(todayLog?.totalXp ?? coreEarned) >= 100 
                ? '100 XP ACHIEVED' 
                : `${Math.max(0, 100 - (todayLog?.totalXp ?? coreEarned))} XP TO PERFECT DAY`}
            </div>
          </div>
        </div>

        {/* Action Button: OPEN TODAY'S QUEST LOG */}
        <button
          type="button"
          onClick={() => onNavigateTab('quests')}
          className="w-full py-3 px-4 rounded-2xl bg-[#12324A] hover:bg-[#0D1B2A] text-white text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs min-h-[44px]"
        >
          <ClipboardCheck className="w-4 h-4 text-[#DCEAF4]" />
          <span>Open Today's Quest Log</span>
        </button>
      </section>

      {/* 3. DAILY METRICS (2x2 Structure) */}
      <section className="grid grid-cols-2 gap-3">
        {/* STEPS */}
        <div 
          onClick={() => onNavigateTab('quests')}
          className="bg-white p-4 rounded-2xl border border-[#EEEDE9] shadow-xs flex items-center gap-3 cursor-pointer hover:border-[#4A90C2] transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-[#DCEAF4] text-[#12324A] flex items-center justify-center shrink-0">
            <Footprints className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-[#68727D] uppercase tracking-wider">
              STEPS
            </div>
            <div className="text-xs font-black text-[#0D1B2A] truncate mt-0.5">
              {stepCount !== null ? `${stepCount.toLocaleString()} / 10,000` : '—'}
            </div>
          </div>
        </div>

        {/* SLEEP */}
        <div 
          onClick={() => onNavigateTab('quests')}
          className="bg-white p-4 rounded-2xl border border-[#EEEDE9] shadow-xs flex items-center gap-3 cursor-pointer hover:border-[#4A90C2] transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-[#DCEAF4] text-[#12324A] flex items-center justify-center shrink-0">
            <Moon className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-[#68727D] uppercase tracking-wider">
              SLEEP
            </div>
            <div className="text-xs font-black text-[#0D1B2A] truncate mt-0.5">
              {sleepHours !== null ? `${sleepHours}h` : '—'}
            </div>
          </div>
        </div>

        {/* FOCUS */}
        <div 
          onClick={() => onNavigateTab('quests')}
          className="bg-white p-4 rounded-2xl border border-[#EEEDE9] shadow-xs flex items-center gap-3 cursor-pointer hover:border-[#4A90C2] transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-[#DCEAF4] text-[#12324A] flex items-center justify-center shrink-0">
            <Target className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-[#68727D] uppercase tracking-wider">
              FOCUS
            </div>
            <div className="text-xs font-black text-[#0D1B2A] truncate mt-0.5">
              {focusRating !== null ? `${focusRating} / 5` : '—'}
            </div>
          </div>
        </div>

        {/* WEIGHT */}
        <div 
          onClick={onOpenWeightModal}
          className="bg-white p-4 rounded-2xl border border-[#EEEDE9] shadow-xs flex items-center gap-3 cursor-pointer hover:border-[#4A90C2] transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-[#DCEAF4] text-[#12324A] flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-[#68727D] uppercase tracking-wider">
              WEIGHT
            </div>
            <div className="text-xs font-black text-[#0D1B2A] truncate mt-0.5">
              {currentWeightVal !== null ? `${currentWeightVal} ${weightUnitStr}` : '—'}
            </div>
          </div>
        </div>
      </section>

      {/* 4. TODAY'S TIMELINE: Displays ONLY the next 3 upcoming/incomplete quests */}
      <section className="bg-white rounded-3xl p-5 border border-[#EEEDE9] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#68727D] uppercase tracking-wider">
              TODAY'S TIMELINE
            </div>
            <div className="text-xs font-semibold text-[#12324A] mt-0.5">
              {nextThreeQuests.length > 0
                ? `${nextThreeQuests.length} upcoming quest${nextThreeQuests.length > 1 ? 's' : ''}`
                : 'All quests complete'}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('quests')}
            className="text-xs font-bold text-[#4A90C2] hover:underline cursor-pointer flex items-center gap-0.5"
          >
            <span>View All ({totalDailyQuestsCount})</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[1.75]" />
          </button>
        </div>

        {nextThreeQuests.length > 0 ? (
          <div className="space-y-2">
            {nextThreeQuests.map((quest, index) => {
              return (
                <div
                  key={quest.id}
                  onClick={() => {
                    if (quest.type === 'boolean') {
                      toggleBooleanQuest(quest.id);
                    } else {
                      onNavigateTab('quests');
                    }
                  }}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#F7F6F2] hover:bg-[#EEEDE9] border border-[#EEEDE9] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#12324A] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-[#0D1B2A] truncate block group-hover:text-[#12324A]">
                        {quest.title}
                      </span>
                      <span className="text-[10px] font-semibold text-[#68727D] capitalize">
                        {quest.timePeriod === 'all_day' ? 'All Day' : quest.timePeriod} · {quest.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="text-[10px] font-bold text-[#4A90C2]">
                      {quest.baseXp > 0 ? `+${quest.baseXp} XP` : 'Track'}
                    </span>
                    <div className="w-6 h-6 rounded-full border border-[#68727D]/40 bg-white flex items-center justify-center group-hover:border-[#12324A] group-hover:bg-[#12324A] group-hover:text-white transition-all shadow-2xs">
                      <Check className="w-3.5 h-3.5 stroke-[2.2]" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-6 px-4 text-center bg-[#F7F6F2] rounded-2xl border border-[#EEEDE9] space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#DCEAF4] text-[#12324A] mx-auto flex items-center justify-center shadow-xs">
              <Check className="w-5 h-5 stroke-[2.2]" />
            </div>
            <h4 className="text-sm font-black text-[#0D1B2A]">Today's Quests Completed</h4>
            <p className="text-xs text-[#68727D] font-medium max-w-xs mx-auto leading-relaxed">
              You have completed all scheduled discipline quests for today. Outstanding execution.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => onNavigateTab('quests')}
          className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-[#F2F1ED] border border-[#EEEDE9] text-xs font-bold text-[#12324A] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>Open Full Quest Log</span>
          <ChevronRight className="w-3.5 h-3.5 stroke-[1.75]" />
        </button>
      </section>

      {/* 5. DAILY BONUS OBJECTIVE: 1 persistent objective */}
      {todayBonusObjective && (
        <section className="bg-white rounded-3xl p-5 border border-[#EEEDE9] shadow-xs space-y-3">
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

          <div>
            <h3 className="text-sm font-black text-[#0D1B2A]">
              {todayBonusObjective.title}
            </h3>
            <p className="text-xs text-[#68727D] mt-0.5 font-medium leading-relaxed">
              {todayBonusObjective.description}
            </p>
            {todayBonusObjective.quote && (
              <p className="text-[11px] text-[#4A90C2] italic mt-1 font-semibold">
                "{todayBonusObjective.quote}"
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={toggleBonusObjective}
            className={`w-full py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              todayLog?.completedBonusObjectiveId
                ? 'bg-[#EEEDE9] text-[#12324A]'
                : 'bg-[#12324A] hover:bg-[#0D1B2A] text-white shadow-xs'
            }`}
          >
            {todayLog?.completedBonusObjectiveId ? 'Bonus Claimed (+15 XP)' : 'Claim Daily Bonus'}
          </button>
        </section>
      )}

      {/* 6. WEEKLY GOAL */}
      {activeWeeklyGoal && (
        <section className="bg-white rounded-3xl p-5 border border-[#EEEDE9] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#68727D] uppercase tracking-wider">
              THIS WEEK'S GOAL
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#DCEAF4] text-[#12324A] text-[10px] font-black">
              +{activeWeeklyGoal.xpReward} XP
            </span>
          </div>

          <div>
            <h3 className="text-sm font-black text-[#0D1B2A]">
              {activeWeeklyGoal.title}
            </h3>
            <p className="text-xs text-[#68727D] font-medium mt-0.5">
              {activeWeeklyGoal.description}
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-[#68727D]">
              <span>
                {(weeklyGoalProgress ?? 0).toLocaleString()} / {(weeklyGoalTarget || 70000).toLocaleString()} {activeWeeklyGoal.unit}
              </span>
              <span>{weeklyGoalPercent ?? 0}%</span>
            </div>

            <div className="w-full h-2 rounded-full bg-[#EEEDE9] overflow-hidden">
              <div
                className="h-full bg-[#4A90C2] rounded-full transition-all duration-500"
                style={{ width: `${weeklyGoalPercent ?? 0}%` }}
              />
            </div>
          </div>
        </section>
      )}

      {/* 7. COMPACT NUTRITION SNAPSHOT */}
      <section 
        onClick={() => onNavigateTab('nutrition')}
        className="bg-white rounded-3xl p-5 border border-[#EEEDE9] shadow-xs space-y-3 cursor-pointer hover:border-[#4A90C2] transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-[#4A90C2]" />
            <span className="text-[10px] font-black text-[#68727D] uppercase tracking-wider">
              NUTRITION SNAPSHOT
            </span>
          </div>
          <span className="text-xs font-bold text-[#4A90C2] flex items-center gap-0.5">
            <span>Log Meals</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#F7F6F2] p-2.5 rounded-xl">
            <div className="text-[10px] font-bold text-[#68727D] uppercase">Calories</div>
            <div className="text-xs font-black text-[#0D1B2A] mt-0.5">
              {todayMacros?.calories || 0} / {nutritionSettings?.caloriesTarget || 2200}
            </div>
          </div>

          <div className="bg-[#F7F6F2] p-2.5 rounded-xl">
            <div className="text-[10px] font-bold text-[#68727D] uppercase">Protein</div>
            <div className="text-xs font-black text-[#0D1B2A] mt-0.5">
              {todayMacros?.protein || 0}g / {nutritionSettings?.proteinTarget || 180}g
            </div>
          </div>

          <div className="bg-[#F7F6F2] p-2.5 rounded-xl">
            <div className="text-[10px] font-bold text-[#68727D] uppercase">Carbs & Fat</div>
            <div className="text-xs font-black text-[#0D1B2A] mt-0.5">
              {todayMacros?.carbs || 0}C · {todayMacros?.fat || 0}F
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
