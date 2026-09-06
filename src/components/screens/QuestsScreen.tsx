import React from 'react';
import { DateNavigator } from '../DateNavigator';
import { QuestCard } from '../QuestCard';
import { StepsCard, SleepCard } from '../NumericQuestCard';
import { FocusSelectorCard } from '../FocusSelectorCard';
import { SideQuestCard } from '../SideQuestCard';
import { DailyBonusCard } from '../DailyBonusCard';
import { DAILY_QUESTS, SIDE_QUESTS } from '../../constants';
import { useApp } from '../../context/AppContext';
import { Sparkles, CheckCircle2, AlertCircle, Diamond } from 'lucide-react';

export const QuestsScreen: React.FC = () => {
  const {
    currentLog,
    selectedDate,
    selectedDateXp,
    toggleBooleanQuest,
    toggleQuestNA,
    setDailyFocus,
    setSteps,
    setSleep,
    toggleSideQuest,
    isDateFuture,
  } = useApp();

  const isFuture = isDateFuture(selectedDate);
  const isPerfect = currentLog.isPerfectDay;
  const isConquered = currentLog.isConqueredDay;

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      {/* Date Navigator Header */}
      <DateNavigator />

      {/* Floating Daily Performance & XP Status Bar */}
      <div className="bg-[#14171D] rounded-2xl p-4 border border-white/[0.08] shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black tracking-widest uppercase text-zinc-400 block">
            CORE PERFORMANCE & XP
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">
              {currentLog.corePerformancePercent}%
            </span>
            <span className="text-xs font-bold text-zinc-400">
              ({selectedDateXp} / 100 XP)
            </span>
          </div>
        </div>

        <div>
          {isPerfect ? (
            <div className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black tracking-wide flex items-center gap-1 border border-emerald-400/40 shadow-[0_0_10px_rgba(52,211,153,0.3)]">
              <Diamond className="w-3.5 h-3.5" />
              <span>PERFECT DAY</span>
            </div>
          ) : isConquered ? (
            <div className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black tracking-wide flex items-center gap-1 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>CONQUERED</span>
            </div>
          ) : (
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-400">
                {Math.max(0, 85 - currentLog.corePerformancePercent)}% to Conquer
              </span>
            </div>
          )}
        </div>
      </div>

      {isFuture && (
        <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center gap-2.5 text-xs text-amber-300 font-semibold">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>This is a future date. Quests cannot be completed ahead of time.</span>
        </div>
      )}

      {/* Daily Bonus Objective for Selected Date */}
      <DailyBonusCard />

      {/* SECTION 1: DAILY ROUTINE QUESTS */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              Daily Core Quests
            </h2>
            <p className="text-xs text-zinc-400">Master checklist in chronological routine</p>
          </div>
          <span className="text-xs font-bold text-zinc-400">
            {currentLog.completedQuestIds.length} / {DAILY_QUESTS.length} Done
          </span>
        </div>

        <div className="space-y-2">
          {DAILY_QUESTS.map((quest) => {
            // Quest #14: Focus Selector
            if (quest.id === 'daily_focus') {
              return (
                <FocusSelectorCard
                  key={quest.id}
                  currentRating={currentLog.focusRating}
                  disabled={isFuture}
                  onSelect={setDailyFocus}
                />
              );
            }

            // Quest #18: Steps
            if (quest.id === 'steps') {
              return (
                <StepsCard
                  key={quest.id}
                  currentSteps={currentLog.steps}
                  disabled={isFuture}
                  onSave={setSteps}
                />
              );
            }

            // Quest #19: Sleep
            if (quest.id === 'sleep') {
              return (
                <SleepCard
                  key={quest.id}
                  currentHours={currentLog.sleepHours}
                  disabled={isFuture}
                  onSave={setSleep}
                />
              );
            }

            // Boolean quests
            const isDone = currentLog.completedQuestIds.includes(quest.id);
            const isNA = (currentLog.naQuestIds || []).includes(quest.id);

            return (
              <QuestCard
                key={quest.id}
                quest={quest}
                isCompleted={isDone}
                isNA={isNA}
                disabled={isFuture}
                onToggle={() => toggleBooleanQuest(quest.id)}
                onToggleNA={quest.allowNA ? () => toggleQuestNA(quest.id) : undefined}
              />
            );
          })}
        </div>
      </section>

      {/* SECTION 2: SIDE QUESTS (Bonus Only) */}
      <section className="space-y-2.5 pt-4">
        <div className="flex items-center justify-between px-1 border-t border-zinc-800 pt-4">
          <div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-black uppercase tracking-wider text-white">
                Side Quests
              </h2>
            </div>
            <p className="text-xs text-zinc-400">Optional challenges • Bonus XP only</p>
          </div>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/15 border border-amber-500/25 px-2 py-0.5 rounded-lg">
            +{currentLog.bonusXp} Bonus XP
          </span>
        </div>

        <div className="space-y-2">
          {SIDE_QUESTS.map((quest) => (
            <SideQuestCard
              key={quest.id}
              quest={quest}
              isCompleted={currentLog.completedSideQuestIds.includes(quest.id)}
              disabled={isFuture}
              onToggle={() => toggleSideQuest(quest.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
