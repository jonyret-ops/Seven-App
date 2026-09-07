import React, { useState, useMemo } from 'react';
import {
  ClipboardCheck,
  Plus,
  TrendingDown,
  TrendingUp,
  BarChart2,
  Calendar,
  ChevronRight,
  Flame,
  Footprints,
  Dumbbell,
  Scale
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { BodyMeasurementsCard } from '../BodyMeasurementsCard';

interface ProgressScreenProps {
  onOpenWeightModal: () => void;
  onSelectHistoricalDate: (date: string) => void;
}

type TabCategory = 'weight' | 'workouts' | 'steps' | 'habits';
type TimeRange = '1W' | '1M' | '3M' | 'All';

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  onOpenWeightModal,
  onSelectHistoricalDate,
}) => {
  const {
    weightEntries,
    allLogs,
    currentArc,
    weightStats,
    profile,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<TabCategory>('weight');
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');

  const currentWeight = weightStats?.currentWeight && weightStats.currentWeight > 0 ? weightStats.currentWeight : null;
  const startingWeight = weightStats?.arcStartingWeight && weightStats.arcStartingWeight > 0 ? weightStats.arcStartingWeight : null;
  const goalWeight = currentArc?.goalWeight && currentArc.goalWeight > 0 ? currentArc.goalWeight : null;
  const weightChange = currentWeight !== null && startingWeight !== null ? Number((currentWeight - startingWeight).toFixed(1)) : null;

  // Chart data from real weight entries only
  const chartData = useMemo(() => {
    if (!weightEntries || weightEntries.length === 0) return [];
    return [...weightEntries]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((e) => {
        const parts = e.date.split('-');
        const monthStr = parts.length === 3 ? ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(parts[1]) - 1] : '';
        return {
          date: `${monthStr} ${parseInt(parts[2]) || ''}`,
          weight: e.weight,
        };
      });
  }, [weightEntries]);

  // Steps chart data from real daily logs
  const stepsData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    if (!allLogs || allLogs.length === 0) return [];
    return allLogs.slice(-7).map((l) => {
      const d = new Date(l.date + 'T12:00:00');
      return {
        day: days[d.getDay()],
        steps: l.steps || 0,
      };
    });
  }, [allLogs]);

  const dailyAverageSteps = useMemo(() => {
    const logsWithSteps = allLogs.filter((l) => (l.steps || 0) > 0);
    if (logsWithSteps.length === 0) return null;
    const sum = logsWithSteps.reduce((acc, l) => acc + (l.steps || 0), 0);
    return Math.round(sum / logsWithSteps.length);
  }, [allLogs]);

  const gymSessionCount = useMemo(() => {
    return allLogs.filter((l) => l.completedQuestIds?.includes('hit_the_gym')).length;
  }, [allLogs]);

  const avgRoutinePerf = useMemo(() => {
    if (!allLogs || allLogs.length === 0) return null;
    const sum = allLogs.reduce((acc, l) => acc + (l.corePerformancePercent || 0), 0);
    return Math.round(sum / allLogs.length);
  }, [allLogs]);

  return (
    <div className="space-y-4 select-none">
      {/* Top Header */}
      <header className="flex items-center justify-between pt-1 pb-1">
        <div>
          <h1 className="text-2xl font-black text-[#0D1B2A] tracking-tight">
            Progress
          </h1>
          <p className="text-xs font-semibold text-[#68727D] mt-0.5">
            Discipline compounds over time
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenWeightModal}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#12324A] bg-white border border-[#EEEDE9] shadow-xs hover:bg-[#F2F1ED] transition-colors cursor-pointer"
          title="Log Weight"
        >
          <Scale className="w-5 h-5 stroke-[1.9]" />
        </button>
      </header>

      {/* Segmented Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: 'weight', label: 'Weight' },
          { id: 'workouts', label: 'Workouts' },
          { id: 'steps', label: 'Steps' },
          { id: 'habits', label: 'Habits' },
        ].map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
                isActive
                  ? 'bg-[#12324A] text-white shadow-xs'
                  : 'bg-white text-[#68727D] border border-[#EEEDE9] hover:bg-[#F2F1ED]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeCategory === 'weight' && (
        <div className="space-y-4">
          {/* Main Current Weight Card */}
          <div className="bg-white rounded-3xl p-5 border border-[#EEEDE9] shadow-xs space-y-4">
            {/* Weight Value & Delta */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#68727D] uppercase tracking-wider block">
                  Current Weight
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-3xl font-black text-[#0D1B2A] tracking-tight">
                    {currentWeight !== null ? currentWeight : '—'}
                  </span>
                  {currentWeight !== null && (
                    <span className="text-xs font-bold text-[#68727D]">
                      {weightStats?.unit || 'lbs'}
                    </span>
                  )}
                </div>
              </div>

              {weightChange !== null ? (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#DCEAF4] text-[#12324A] text-xs font-black">
                  <TrendingDown className="w-3.5 h-3.5 stroke-[1.75]" />
                  <span>{weightChange > 0 ? `+${weightChange}` : weightChange} {weightStats?.unit || 'lbs'} since start</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F7F6F2] text-[#68727D] text-xs font-bold">
                  <span>No change recorded</span>
                </div>
              )}
            </div>

            {/* Interactive Weight Chart or Empty State */}
            {chartData.length >= 2 ? (
              <div className="h-44 w-full -ml-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEEDE9" />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#68727D', fontSize: 10, fontWeight: 600 }}
                    />
                    <YAxis
                      domain={['dataMin - 4', 'dataMax + 4']}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#68727D', fontSize: 10, fontWeight: 600 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#12324A',
                        borderRadius: '12px',
                        color: '#FFF',
                        fontSize: '11px',
                        border: 'none',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#4A90C2"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#4A90C2', strokeWidth: 2, stroke: '#FFFFFF' }}
                      activeDot={{ r: 6, fill: '#12324A' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : chartData.length === 1 ? (
              <div className="py-6 px-4 text-center rounded-2xl bg-[#F7F6F2] border border-[#EEEDE9] space-y-1">
                <span className="text-xs font-black text-[#0D1B2A] block">1 Weigh-In Recorded: {chartData[0].weight} {weightStats?.unit || 'lbs'}</span>
                <p className="text-[11px] text-[#68727D]">Log at least one more weigh-in to generate your progress trend graph.</p>
              </div>
            ) : (
              <div className="py-8 px-4 text-center rounded-2xl bg-[#F7F6F2] border border-[#EEEDE9] space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-[#DCEAF4] text-[#12324A] mx-auto flex items-center justify-center">
                  <Scale className="w-5 h-5 stroke-[1.75]" />
                </div>
                <h4 className="text-xs font-black text-[#0D1B2A]">No Weigh-In Entries Recorded</h4>
                <p className="text-[11px] text-[#68727D] max-w-xs mx-auto">
                  Log your first weigh-in to begin charting your weight change and progression towards your goal.
                </p>
              </div>
            )}

            {/* Time Range Pills */}
            <div className="flex items-center justify-between border-t border-[#EEEDE9] pt-3">
              {(['1W', '1M', '3M', 'All'] as TimeRange[]).map((r) => {
                const isActive = timeRange === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setTimeRange(r)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#12324A] text-white'
                        : 'text-[#68727D] hover:text-[#0D1B2A]'
                    }`}
                  >
                    {r}
                  </button>
                );
              })}
            </div>

            {/* 3 Stat Boxes: Start, Goal, Change */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="bg-[#F7F6F2] p-3 rounded-2xl text-center border border-[#EEEDE9]">
                <span className="text-sm font-black text-[#0D1B2A] block">
                  {startingWeight !== null ? startingWeight : '—'}
                </span>
                <span className="text-[10px] font-bold text-[#68727D] uppercase">
                  Start
                </span>
              </div>

              <div className="bg-[#F7F6F2] p-3 rounded-2xl text-center border border-[#EEEDE9]">
                <span className="text-sm font-black text-[#0D1B2A] block">
                  {goalWeight !== null ? goalWeight : '—'}
                </span>
                <span className="text-[10px] font-bold text-[#68727D] uppercase">
                  Goal
                </span>
              </div>

              <div className="bg-[#F7F6F2] p-3 rounded-2xl text-center border border-[#EEEDE9]">
                <span className="text-sm font-black text-[#4A90C2] block">
                  {weightChange !== null ? (weightChange > 0 ? `+${weightChange}` : weightChange) : '—'}
                </span>
                <span className="text-[10px] font-bold text-[#68727D] uppercase">
                  Change
                </span>
              </div>
            </div>
          </div>

          {/* Body Measurements Card */}
          <BodyMeasurementsCard />

          {/* Quick Weight Entry Trigger */}
          <button
            type="button"
            onClick={onOpenWeightModal}
            className="w-full py-3.5 rounded-2xl bg-[#12324A] hover:bg-[#0D1B2A] text-white text-xs font-black uppercase tracking-wider shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all min-h-[44px]"
          >
            <Plus className="w-4 h-4 stroke-[2]" />
            <span>Log Today's Weight</span>
          </button>
        </div>
      )}

      {activeCategory === 'steps' && (
        <div className="bg-white rounded-3xl p-5 border border-[#EEEDE9] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#68727D] uppercase block">Daily Average</span>
              <span className="text-xl font-black text-[#0D1B2A]">
                {dailyAverageSteps !== null ? `${dailyAverageSteps.toLocaleString()} steps` : '—'}
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#DCEAF4] text-[#12324A] flex items-center justify-center">
              <Footprints className="w-5 h-5 stroke-[1.75]" />
            </div>
          </div>

          {stepsData.length > 0 ? (
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stepsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEEDE9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#68727D', fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#68727D', fontSize: 10 }} />
                  <Bar dataKey="steps" fill="#4A90C2" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="py-8 px-4 text-center rounded-2xl bg-[#F7F6F2] border border-[#EEEDE9] space-y-1">
              <span className="text-xs font-black text-[#0D1B2A] block">No Step Logs Yet</span>
              <p className="text-[11px] text-[#68727D]">Log your daily steps in the Quests tab to generate your weekly graph.</p>
            </div>
          )}
        </div>
      )}

      {activeCategory === 'workouts' && (
        <div className="bg-white rounded-3xl p-5 border border-[#EEEDE9] shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DCEAF4] text-[#12324A] flex items-center justify-center">
              <Dumbbell className="w-5 h-5 stroke-[1.75]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#0D1B2A]">Training Frequency</h3>
              <p className="text-xs text-[#68727D] font-medium">
                {gymSessionCount > 0 
                  ? `${gymSessionCount} gym session${gymSessionCount > 1 ? 's' : ''} logged`
                  : 'No gym sessions logged yet'}
              </p>
            </div>
          </div>
        </div>
      )}

      {activeCategory === 'habits' && (
        <div className="bg-white rounded-3xl p-5 border border-[#EEEDE9] shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DCEAF4] text-[#12324A] flex items-center justify-center">
              <Flame className="w-5 h-5 text-[#4A90C2] stroke-[1.75]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#0D1B2A]">Daily Habit Execution</h3>
              <p className="text-xs text-[#68727D] font-medium">
                {avgRoutinePerf !== null 
                  ? `${avgRoutinePerf}% average routine completion`
                  : 'No habit logs recorded yet'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
