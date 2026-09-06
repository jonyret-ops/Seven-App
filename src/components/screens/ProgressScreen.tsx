import React, { useState, useMemo } from 'react';
import {
  Scale,
  Plus,
  Flame,
  Footprints,
  Moon,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { addDays, calculateWeeklyReport, parseDate } from '../../lib/calculations';
import { DailyLog } from '../../types';

interface ProgressScreenProps {
  onOpenWeightModal: () => void;
  onSelectHistoricalDate: (date: string) => void;
}

type FilterRange = '7d' | '30d' | 'all';
type ChartTab = 'xp' | 'weight' | 'steps' | 'sleep';

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  onOpenWeightModal,
  onSelectHistoricalDate,
}) => {
  const {
    allLogs,
    weightEntries,
    streakStats,
    weightStats,
    currentArc,
    activeTodayDate,
    deleteWeightEntry,
    profile,
  } = useApp();

  const [rangeFilter, setRangeFilter] = useState<FilterRange>('7d');
  const [activeChartTab, setActiveChartTab] = useState<ChartTab>('xp');

  // Compute weekly report for the current week ending today
  const weeklyReport = useMemo(() => {
    return calculateWeeklyReport(allLogs, weightEntries, activeTodayDate);
  }, [allLogs, weightEntries, activeTodayDate]);

  // Compute logs for chosen date range
  const filteredLogs = useMemo(() => {
    const daysCount = rangeFilter === '7d' ? 7 : rangeFilter === '30d' ? 30 : 90;
    const result: DailyLog[] = [];

    for (let i = daysCount - 1; i >= 0; i--) {
      const dStr = addDays(activeTodayDate, -i);
      const found = allLogs.find((l) => l.date === dStr);
      if (found) {
        result.push(found);
      } else {
        result.push({
          date: dStr,
          completedQuestIds: [],
          naQuestIds: [],
          completedSideQuestIds: [],
          steps: 0,
          sleepHours: 0,
          focusRating: 0,
          energyDrinkConsumed: false,
          corePointsEarned: 0,
          corePointsAvailable: 15,
          corePerformancePercent: 0,
          baseXp: 0,
          bonusXp: 0,
          totalXp: 0,
          dailyRank: 'ROUGH DAY',
          isConqueredDay: false,
          isPerfectDay: false,
          createdAt: '',
          updatedAt: '',
        });
      }
    }
    return result;
  }, [allLogs, rangeFilter, activeTodayDate]);

  // Aggregated analytical statistics for the selected range
  const stats = useMemo(() => {
    const totalXp = filteredLogs.reduce((sum, l) => sum + l.totalXp, 0);
    const avgXp = Math.round(totalXp / Math.max(1, filteredLogs.length));
    const successfulDays = filteredLogs.filter((l) => l.totalXp >= 85).length;
    const totalSteps = filteredLogs.reduce((sum, l) => sum + (l.steps || 0), 0);
    const avgSteps = Math.round(totalSteps / Math.max(1, filteredLogs.length));
    const totalSleep = filteredLogs.reduce((sum, l) => sum + (l.sleepHours || 0), 0);
    const avgSleep = Number((totalSleep / Math.max(1, filteredLogs.length)).toFixed(1));
    const ratedFocusLogs = filteredLogs.filter((l) => l.focusRating > 0);
    const avgFocus = ratedFocusLogs.length > 0
      ? (ratedFocusLogs.reduce((sum, l) => sum + l.focusRating, 0) / ratedFocusLogs.length).toFixed(1)
      : '—';
    const gymSessions = filteredLogs.filter((l) => l.completedQuestIds.includes('hit_the_gym')).length;
    const sideQuestsCompleted = filteredLogs.reduce((sum, l) => sum + l.completedSideQuestIds.length, 0);

    return {
      totalXp,
      avgXp,
      successfulDays,
      totalSteps,
      avgSteps,
      avgSleep,
      avgFocus,
      gymSessions,
      sideQuestsCompleted,
    };
  }, [filteredLogs]);

  // Chart data formatting
  const chartData = useMemo(() => {
    return filteredLogs.map((log) => {
      const d = parseDate(log.date);
      const label = `${d.getMonth() + 1}/${d.getDate()}`;

      return {
        date: log.date,
        name: label,
        totalXp: log.totalXp,
        baseXp: log.baseXp,
        bonusXp: log.bonusXp,
        steps: log.steps || 0,
        sleep: log.sleepHours || 0,
      };
    });
  }, [filteredLogs]);

  const weightChartData = useMemo(() => {
    return weightEntries.map((w) => {
      const d = parseDate(w.date);
      return {
        date: w.date,
        name: `${d.getMonth() + 1}/${d.getDate()}`,
        weight: w.weight,
        goal: currentArc.goalWeight,
      };
    });
  }, [weightEntries, currentArc.goalWeight]);

  const gradeColors: Record<string, { bg: string; text: string; border: string }> = {
    S: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
    A: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    B: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
    C: { bg: 'bg-zinc-800', text: 'text-zinc-300', border: 'border-zinc-700' },
    D: { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' },
  };

  return (
    <div className="space-y-4 pb-28 animate-in fade-in duration-300">
      {/* Top Header */}
      <header className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[10px] font-black tracking-widest uppercase text-emerald-400 block">
            ANALYTICS & METRICS
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">
            PROGRESS & PERFORMANCE
          </h1>
        </div>

        {/* Range Selector Pills */}
        <div className="flex bg-zinc-900 border border-white/[0.08] p-1 rounded-xl">
          {(['7d', '30d', 'all'] as FilterRange[]).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setRangeFilter(range)}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                rangeFilter === range
                  ? 'bg-emerald-500 text-black shadow-xs font-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {range === '7d' ? '7D' : range === '30d' ? '30D' : 'All'}
            </button>
          ))}
        </div>
      </header>

      {/* SECTION: WEEKLY REPORT CARD */}
      <div className="bg-[#14171D] rounded-3xl p-4 border border-white/[0.08] shadow-sm relative overflow-hidden">
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-[10px] font-black tracking-wider uppercase text-zinc-400 block">
              Week {weeklyReport.weekNumber} Report
            </span>
            <h3 className="text-lg font-black text-white tracking-tight mt-0.5">
              CURRENT CYCLE PERFORMANCE
            </h3>
            <p className="text-[11px] text-zinc-400">
              {weeklyReport.startDate} to {weeklyReport.endDate}
            </p>
          </div>

          <div className="flex flex-col items-end">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xl border ${
                gradeColors[weeklyReport.grade]?.bg || 'bg-zinc-800'
              } ${gradeColors[weeklyReport.grade]?.text || 'text-white'} ${
                gradeColors[weeklyReport.grade]?.border || 'border-zinc-700'
              }`}
            >
              {weeklyReport.grade}
            </div>
            <span className="text-[9px] font-black tracking-wider uppercase text-emerald-400 mt-1">
              {weeklyReport.gradeTitle}
            </span>
          </div>
        </div>

        {/* Weekly Stats Grid */}
        <div className="grid grid-cols-3 gap-2 text-center my-3">
          <div className="bg-zinc-900/90 p-2.5 rounded-xl border border-white/[0.05]">
            <span className="text-[9px] font-bold text-zinc-400 uppercase block">Avg XP</span>
            <span className="text-base font-black text-white">{weeklyReport.avgXp}</span>
          </div>
          <div className="bg-zinc-900/90 p-2.5 rounded-xl border border-white/[0.05]">
            <span className="text-[9px] font-bold text-zinc-400 uppercase block">Conquered</span>
            <span className="text-base font-black text-emerald-400">{weeklyReport.successfulDays}/7</span>
          </div>
          <div className="bg-zinc-900/90 p-2.5 rounded-xl border border-white/[0.05]">
            <span className="text-[9px] font-bold text-zinc-400 uppercase block">Gym</span>
            <span className="text-base font-black text-white">{weeklyReport.gymSessions}</span>
          </div>
        </div>

        {/* Comparison vs Last Week */}
        {weeklyReport.comparisonVsLastWeek ? (
          <div className="mt-2 pt-2 border-t border-zinc-800 text-xs font-semibold text-zinc-300 flex flex-wrap items-center justify-between gap-2">
            <span className="text-zinc-500 text-[10px] font-black uppercase">VS LAST WEEK:</span>
            <span className={weeklyReport.comparisonVsLastWeek.xpDiffPercent >= 0 ? 'text-emerald-400 font-bold' : 'text-zinc-400'}>
              {weeklyReport.comparisonVsLastWeek.xpDiffPercent >= 0 ? '+' : ''}{weeklyReport.comparisonVsLastWeek.xpDiffPercent}% XP
            </span>
            <span className="text-zinc-300">
              {weeklyReport.comparisonVsLastWeek.successfulDaysDiff >= 0 ? '+' : ''}{weeklyReport.comparisonVsLastWeek.successfulDaysDiff} conquered days
            </span>
          </div>
        ) : (
          <div className="mt-2 pt-2 border-t border-zinc-800 text-[11px] text-zinc-500 text-center">
            Complete your first full week to see week-over-week comparisons!
          </div>
        )}
      </div>

      {/* SECTION: WEIGHT TRACKING SNAPSHOT */}
      <div className="bg-[#14171D] rounded-3xl p-4 border border-white/[0.08] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight">
                WEIGHT PROGRESS
              </h3>
              <span className="text-[11px] text-zinc-400">Current Arc: {currentArc.name}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenWeightModal}
            className="h-8 px-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black flex items-center gap-1 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Weight</span>
          </button>
        </div>

        {/* 5-part progress display */}
        {weightStats.hasBaseline && weightEntries.length > 0 ? (
          <>
            <div className="bg-zinc-900/90 p-3 rounded-2xl border border-white/[0.05] flex items-center justify-between text-center gap-1">
              <div>
                <span className="text-[9px] font-bold text-zinc-500 uppercase block">Start</span>
                <span className="text-xs font-black text-zinc-300">
                  {weightStats.arcStartingWeight} {weightStats.unit}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-[9px] font-bold text-emerald-400 uppercase">Lost</span>
                <span className="text-xs font-black text-emerald-400">
                  ↓ {weightStats.weightLostArc} {weightStats.unit}
                </span>
              </div>

              <div className="bg-[#181C23] px-3 py-1.5 rounded-xl border border-emerald-500/30">
                <span className="text-[9px] font-black text-emerald-400 uppercase block">Current</span>
                <span className="text-base font-black text-white">{weightStats.currentWeight} {weightStats.unit}</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-[9px] font-bold text-zinc-500 uppercase">To Go</span>
                <span className="text-xs font-black text-zinc-300">
                  {weightStats.weightRemainingToGoal} {weightStats.unit}
                </span>
              </div>

              <div>
                <span className="text-[9px] font-bold text-zinc-500 uppercase block">Goal</span>
                <span className="text-xs font-black text-zinc-300">
                  {currentArc.goalWeight > 0 ? `${currentArc.goalWeight} ${weightStats.unit}` : '—'}
                </span>
              </div>
            </div>

            {/* Progress toward goal */}
            {currentArc.goalWeight > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-zinc-400">
                  <span>Arc Goal Progress</span>
                  <span className="text-emerald-400 font-bold">{weightStats.percentToGoal}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                  <div
                    className="h-full bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.3)] transition-all duration-500"
                    style={{ width: `${weightStats.percentToGoal}%` }}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-zinc-900/90 p-4 rounded-2xl border border-white/[0.05] text-center space-y-1">
            <p className="text-xs font-bold text-zinc-300">No Weight Entries Yet</p>
            <p className="text-[11px] text-zinc-500">
              Record your first weigh-in to establish your lifetime baseline and track your progress.
            </p>
          </div>
        )}
      </div>

      {/* SECTION: SUMMARY STAT CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-[#14171D] p-3 rounded-2xl border border-white/[0.07] shadow-xs">
          <span className="text-[9px] font-bold text-zinc-400 uppercase block">Total XP</span>
          <span className="text-lg font-black text-white">{stats.totalXp.toLocaleString()}</span>
        </div>
        <div className="bg-[#14171D] p-3 rounded-2xl border border-white/[0.07] shadow-xs">
          <span className="text-[9px] font-bold text-zinc-400 uppercase block">Daily Avg XP</span>
          <span className="text-lg font-black text-white">{stats.avgXp}</span>
        </div>
        <div className="bg-[#14171D] p-3 rounded-2xl border border-white/[0.07] shadow-xs">
          <span className="text-[9px] font-bold text-zinc-400 uppercase block">Conquered Days</span>
          <span className="text-lg font-black text-emerald-400">{stats.successfulDays}</span>
        </div>
        <div className="bg-[#14171D] p-3 rounded-2xl border border-white/[0.07] shadow-xs">
          <span className="text-[9px] font-bold text-zinc-400 uppercase block">Gym Sessions</span>
          <span className="text-lg font-black text-white">{stats.gymSessions}</span>
        </div>
        <div className="bg-[#14171D] p-3 rounded-2xl border border-white/[0.07] shadow-xs">
          <span className="text-[9px] font-bold text-zinc-400 uppercase block">Avg Steps</span>
          <span className="text-lg font-black text-white">{stats.avgSteps.toLocaleString()}</span>
        </div>
        <div className="bg-[#14171D] p-3 rounded-2xl border border-white/[0.07] shadow-xs">
          <span className="text-[9px] font-bold text-zinc-400 uppercase block">Avg Sleep</span>
          <span className="text-lg font-black text-cyan-400">{stats.avgSleep}h</span>
        </div>
        <div className="bg-[#14171D] p-3 rounded-2xl border border-white/[0.07] shadow-xs">
          <span className="text-[9px] font-bold text-zinc-400 uppercase block">Avg Focus</span>
          <span className="text-lg font-black text-amber-400">{stats.avgFocus}</span>
        </div>
        <div className="bg-[#14171D] p-3 rounded-2xl border border-white/[0.07] shadow-xs">
          <span className="text-[9px] font-bold text-zinc-400 uppercase block">Side Quests</span>
          <span className="text-lg font-black text-white">{stats.sideQuestsCompleted}</span>
        </div>
      </div>

      {/* SECTION: INTERACTIVE CHARTS */}
      <div className="bg-[#14171D] rounded-3xl p-4 border border-white/[0.08] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white tracking-tight uppercase">
            PERFORMANCE GRAPHS
          </h3>

          <div className="flex bg-zinc-900 border border-white/[0.08] p-1 rounded-xl">
            {(['xp', 'weight', 'steps', 'sleep'] as ChartTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveChartTab(tab)}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                  activeChartTab === tab
                    ? 'bg-emerald-500 text-black font-black'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="h-60 w-full pt-2">
          {activeChartTab === 'xp' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#22272E" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#71717A' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#71717A' }} tickLine={false} axisLine={false} domain={[0, 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#181C23', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  formatter={(val: number) => [`${val} XP`, 'Daily XP']}
                />
                <ReferenceLine y={85} stroke="#22C55E" strokeDasharray="3 3" label={{ value: '85 Goal', fill: '#22C55E', fontSize: 10, position: 'top' }} />
                <Bar dataKey="totalXp" fill="#22C55E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeChartTab === 'weight' && (
            weightChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#22272E" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#71717A' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#71717A' }} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#181C23', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                    formatter={(val: number) => [`${val} ${weightStats.unit || 'lb'}`, 'Weight']}
                  />
                  {currentArc.goalWeight > 0 && (
                    <ReferenceLine y={currentArc.goalWeight} stroke="#22C55E" strokeDasharray="3 3" label={{ value: `${currentArc.goalWeight} ${weightStats.unit || 'lb'} Goal`, fill: '#22C55E', fontSize: 10, position: 'bottom' }} />
                  )}
                  <Line type="monotone" dataKey="weight" stroke="#34D399" strokeWidth={2.5} dot={{ r: 3, fill: '#34D399' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs font-bold text-zinc-500">
                Log weigh-ins to plot your weight trend line.
              </div>
            )
          )}

          {activeChartTab === 'steps' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#22272E" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#71717A' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#71717A' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#181C23', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  formatter={(val: number) => [`${val.toLocaleString()}`, 'Steps']}
                />
                <ReferenceLine y={10000} stroke="#22C55E" strokeDasharray="3 3" label={{ value: '10k Goal', fill: '#22C55E', fontSize: 10, position: 'top' }} />
                <Bar dataKey="steps" fill="#22C55E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeChartTab === 'sleep' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#22272E" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#71717A' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#71717A' }} tickLine={false} axisLine={false} domain={[0, 12]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#181C23', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  formatter={(val: number) => [`${val} hrs`, 'Sleep']}
                />
                <ReferenceLine y={8.0} stroke="#38BDF8" strokeDasharray="3 3" label={{ value: '8h Target', fill: '#38BDF8', fontSize: 10, position: 'top' }} />
                <Bar dataKey="sleep" fill="#38BDF8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* SECTION: HISTORICAL INSPECTION */}
      <section className="bg-[#14171D] rounded-3xl p-4 border border-white/[0.08] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-white tracking-tight uppercase">
              HISTORICAL DAYS
            </h3>
            <p className="text-[11px] text-zinc-400">
              Tap any date to inspect details or edit past logs
            </p>
          </div>
        </div>

        <div className="divide-y divide-zinc-800/80 max-h-72 overflow-y-auto no-scrollbar">
          {allLogs.length === 0 ? (
            <div className="py-6 text-center text-xs font-semibold text-zinc-500">
              No historical days logged yet. As you complete days, they will appear here permanently.
            </div>
          ) : (
            [...allLogs]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((log) => {
                const dateObj = parseDate(log.date);
                const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                const isConquered = log.isConqueredDay || log.totalXp >= 85;

                return (
                  <div
                    key={log.date}
                    onClick={() => onSelectHistoricalDate(log.date)}
                    className="py-3 px-1 flex items-center justify-between hover:bg-zinc-800/50 rounded-xl cursor-pointer transition-all"
                  >
                    <div>
                      <span className="text-sm font-bold text-white block">
                        {dayName}
                      </span>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                        <span>{log.completedQuestIds.length} routine</span>
                        <span>•</span>
                        <span>{log.steps ? `${log.steps.toLocaleString()} steps` : '0 steps'}</span>
                        <span>•</span>
                        <span>{log.sleepHours ? `${log.sleepHours}h sleep` : '0h sleep'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="text-right">
                        <span className="text-sm font-black text-white block">
                          {log.totalXp} XP
                        </span>
                        <span className={`text-[10px] font-bold uppercase ${
                          isConquered ? 'text-emerald-400' : 'text-zinc-500'
                        }`}>
                          {log.dailyRank}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-500" />
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </section>

      {/* SECTION: RECORDED WEIGHT HISTORY LOG */}
      <section className="bg-[#14171D] rounded-3xl p-4 border border-white/[0.08] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white tracking-tight uppercase">
            WEIGH-IN LOG
          </h3>
          <button
            type="button"
            onClick={onOpenWeightModal}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer"
          >
            + New Weigh-in
          </button>
        </div>

        <div className="divide-y divide-zinc-800/80 max-h-48 overflow-y-auto no-scrollbar">
          {weightEntries.length === 0 ? (
            <div className="py-6 text-center text-xs text-zinc-500 font-bold">
              No recorded weigh-ins yet. Tap "+ New Weigh-in" above to log your weight.
            </div>
          ) : (
            [...weightEntries]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((entry) => (
                <div key={entry.id} className="py-2.5 px-1 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-zinc-200 block">{entry.date}</span>
                    {entry.note && <span className="text-[11px] text-zinc-400">{entry.note}</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-emerald-400 text-sm">
                      {entry.weight} {weightStats.unit || 'lb'}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteWeightEntry(entry.id)}
                      className="text-zinc-500 hover:text-red-400 text-[11px] cursor-pointer"
                      title="Delete entry"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      </section>
    </div>
  );
};
