import React, { useState } from 'react';
import { Settings, ChevronRight, Scale, Footprints, Moon, Target, ArrowUpRight, Sparkles, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { XpRing } from '../XpRing';
import { LevelCard } from '../LevelCard';
import { QuestCard } from '../QuestCard';
import { ArcSeasonCard } from '../ArcSeasonCard';
import { DailyBonusCard } from '../DailyBonusCard';
import { StreakCard } from '../StreakCard';
import { SevenLogo } from '../SevenLogo';
import { ArcModal } from '../ArcModal';
import { CharacterCardModal } from '../CharacterCardModal';
import { PWAInstallButton } from '../PWAInstallButton';
import { DAILY_QUESTS } from '../../constants';
import { getGreetingMessage, parseDate } from '../../lib/calculations';
import { TabType } from '../BottomNavigation';

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
    currentArc,
    profile,
    dayNumber,
    activeTodayDate,
    todayXp,
    todayCorePerformance,
    currentLog,
    streakStats,
    weightStats,
    toggleBooleanQuest,
    toggleQuestNA,
    achievements,
  } = useApp();

  const [isArcModalOpen, setIsArcModalOpen] = useState(false);
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);

  const formattedDate = parseDate(activeTodayDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const greeting = getGreetingMessage(dayNumber, todayXp, streakStats.currentStreak);

  // Incomplete quests preview (first 3 incomplete boolean quests)
  const incompleteQuests = DAILY_QUESTS.filter(
    (q) => q.type === 'boolean' && !currentLog.completedQuestIds.includes(q.id) && !(currentLog.naQuestIds || []).includes(q.id)
  ).slice(0, 3);

  // Most recent unlocked achievement if any
  const recentUnlocked = [...achievements]
    .filter((a) => a.unlockedAt)
    .sort((a, b) => (b.unlockedAt || '').localeCompare(a.unlockedAt || ''))[0];

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      {/* Top Header */}
      <header className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <SevenLogo size="md" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white tracking-wider">
                SEVEN
              </h1>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-wide">
                Day {dayNumber}
              </span>
            </div>
            <p className="text-[11px] font-semibold text-zinc-400">
              {greeting} • {formattedDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* PWA Install Button if available */}
          <PWAInstallButton variant="badge" />

          {/* Character dossier button */}
          <button
            type="button"
            onClick={() => setIsCharacterModalOpen(true)}
            className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/[0.08] flex items-center justify-center text-zinc-300 hover:text-white hover:border-zinc-700 transition-all cursor-pointer"
            aria-label="Character Dossier"
            title="Character Dossier"
          >
            <User className="w-4 h-4" />
          </button>

          {/* Settings button */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/[0.08] flex items-center justify-center text-zinc-300 hover:text-white hover:border-zinc-700 transition-all cursor-pointer"
            aria-label="Settings"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Active Progression Arc Season Card */}
      <ArcSeasonCard onOpenArcModal={() => setIsArcModalOpen(true)} />

      {/* Character Progression Card */}
      <LevelCard />

      {/* Main Hero Card: TODAY'S CORE PERFORMANCE & XP */}
      <div className="bg-[#14171D] rounded-3xl p-5 border border-white/[0.08] shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="w-full flex items-center justify-between text-[10px] font-black tracking-widest uppercase text-zinc-400 mb-1">
          <span>TODAY'S DISCIPLINE</span>
          <span className="text-emerald-400">{todayCorePerformance}% CORE</span>
        </div>

        <div className="my-2">
          <XpRing
            currentXp={todayXp}
            goalXp={currentArc.dailyXpGoal}
            corePerformancePercent={todayCorePerformance}
            dailyRank={currentLog.dailyRank}
            isPerfectDay={currentLog.isPerfectDay}
            size={200}
            strokeWidth={14}
          />
        </div>

        {/* Quick action button to dive into quests */}
        <button
          type="button"
          onClick={() => onNavigateTab('quests')}
          className="w-full mt-2 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white text-xs font-black flex items-center justify-center gap-1.5 border border-zinc-700/80 transition-all cursor-pointer"
        >
          <span>Open Today's Quest Log</span>
          <ChevronRight className="w-4 h-4 text-emerald-400" />
        </button>
      </div>

      {/* Concise 4-Block Snapshot Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Steps */}
        <div
          onClick={() => onNavigateTab('quests')}
          className="bg-[#14171D] p-3 rounded-2xl border border-white/[0.07] shadow-xs cursor-pointer hover:border-emerald-500/30 transition-all"
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-1">
            <Footprints className="w-3.5 h-3.5" />
            <span>Steps</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-white">
              {currentLog.steps.toLocaleString()}
            </span>
            <span className="text-[10px] font-semibold text-zinc-500">/ 10k</span>
          </div>
        </div>

        {/* Sleep */}
        <div
          onClick={() => onNavigateTab('quests')}
          className="bg-[#14171D] p-3 rounded-2xl border border-white/[0.07] shadow-xs cursor-pointer hover:border-cyan-500/30 transition-all"
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 mb-1">
            <Moon className="w-3.5 h-3.5" />
            <span>Sleep</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-white">
              {currentLog.sleepHours > 0 ? currentLog.sleepHours : '—'}
            </span>
            <span className="text-xs font-semibold text-zinc-500">hrs</span>
          </div>
        </div>

        {/* Daily Focus */}
        <div
          onClick={() => onNavigateTab('quests')}
          className="bg-[#14171D] p-3 rounded-2xl border border-white/[0.07] shadow-xs cursor-pointer hover:border-amber-500/30 transition-all"
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1">
            <Target className="w-3.5 h-3.5" />
            <span>Focus</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-white">
              {currentLog.focusRating > 0 ? `${currentLog.focusRating} / 5` : '—'}
            </span>
          </div>
        </div>

        {/* Weight */}
        <div
          onClick={onOpenWeightModal}
          className="bg-[#14171D] p-3 rounded-2xl border border-white/[0.07] shadow-xs cursor-pointer hover:border-emerald-500/30 transition-all"
        >
          <div className="flex items-center justify-between text-xs font-bold text-emerald-400 mb-1">
            <div className="flex items-center gap-1">
              <Scale className="w-3.5 h-3.5" />
              <span>Weight</span>
            </div>
            <ArrowUpRight className="w-3 h-3 text-zinc-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-white">
              {weightStats.hasBaseline && weightStats.currentWeight > 0 ? weightStats.currentWeight : '—'}
            </span>
            <span className="text-xs font-semibold text-zinc-500">
              {weightStats.unit || profile.weightUnit || 'lb'}
            </span>
          </div>
          <div className="text-[10px] font-bold text-emerald-400/90 mt-0.5 truncate">
            {!weightStats.hasBaseline || weightStats.currentWeight === 0
              ? 'Tap to log baseline'
              : weightStats.weightLostArc > 0
              ? `-${weightStats.weightLostArc} ${weightStats.unit} in Arc`
              : 'Logged'}
          </div>
        </div>
      </div>

      {/* Daily Bonus Objective */}
      <DailyBonusCard />

      {/* Streak Summary Card */}
      <StreakCard />

      {/* Next Up Quests Preview */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black tracking-wider text-zinc-400 uppercase">
            Today's Quests Preview
          </h2>
          <button
            type="button"
            onClick={() => onNavigateTab('quests')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 cursor-pointer"
          >
            <span>View All ({DAILY_QUESTS.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-1.5">
          {incompleteQuests.length > 0 ? (
            incompleteQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                isCompleted={currentLog.completedQuestIds.includes(quest.id)}
                isNA={(currentLog.naQuestIds || []).includes(quest.id)}
                onToggle={() => toggleBooleanQuest(quest.id)}
                onToggleNA={quest.allowNA ? () => toggleQuestNA(quest.id) : undefined}
              />
            ))
          ) : (
            <div className="p-3.5 rounded-2xl bg-[#121E18] border border-emerald-500/30 text-center text-xs font-black text-emerald-400">
              ✓ All main daily routine quests completed for today!
            </div>
          )}
        </div>
      </section>

      {/* Recent Achievement Banner */}
      {recentUnlocked && (
        <div
          onClick={() => onNavigateTab('achievements')}
          className="bg-[#14171D] p-3.5 rounded-2xl border border-amber-500/20 shadow-xs flex items-center gap-3 cursor-pointer hover:border-amber-500/40 transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 block">
              RECENT ACHIEVEMENT UNLOCKED
            </span>
            <h4 className="text-xs font-black text-white truncate">
              {recentUnlocked.title}
            </h4>
            <p className="text-[11px] text-zinc-400 truncate">
              {recentUnlocked.description}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </div>
      )}

      {/* Modals */}
      <ArcModal isOpen={isArcModalOpen} onClose={() => setIsArcModalOpen(false)} />
      <CharacterCardModal isOpen={isCharacterModalOpen} onClose={() => setIsCharacterModalOpen(false)} />
    </div>
  );
};
