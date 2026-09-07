import React, { useState } from 'react';
import {
  Award,
  Check,
  Lock,
  Sparkles,
  Flame,
  ShieldAlert,
  Trees,
  Footprints,
  Compass,
  Dumbbell,
  Sun,
  BookOpen,
  TrendingDown,
  Crown,
  Droplets,
  Moon,
  Shield,
  Target,
  Crosshair,
  Pill
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatOrdinalDate } from '../../lib/calculations';

export const AchievementsScreen: React.FC = () => {
  const { achievements } = useApp();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const unlockedCount = achievements.filter((a) => !!a.unlockedAt).length;
  const totalCount = achievements.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  const filteredAchievements = achievements.filter((ach) => {
    if (filter === 'unlocked') return !!ach.unlockedAt;
    if (filter === 'locked') return !ach.unlockedAt;
    return true;
  });

  // Icon lookup map
  const getIcon = (iconName: string, isUnlocked: boolean) => {
    const props = { className: `w-5 h-5 ${isUnlocked ? 'stroke-[2.5]' : 'stroke-[1.8]'}` };
    switch (iconName) {
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'ShieldAlert': return <ShieldAlert {...props} />;
      case 'Trees': return <Trees {...props} />;
      case 'Footprints': return <Footprints {...props} />;
      case 'Compass': return <Compass {...props} />;
      case 'Dumbbell': return <Dumbbell {...props} />;
      case 'Sun': return <Sun {...props} />;
      case 'BookOpen': return <BookOpen {...props} />;
      case 'TrendingDown': return <TrendingDown {...props} />;
      case 'Crown': return <Crown {...props} />;
      case 'Droplets': return <Droplets {...props} />;
      case 'Moon': return <Moon {...props} />;
      case 'Shield': return <Shield {...props} />;
      case 'Target': return <Target {...props} />;
      case 'Crosshair': return <Crosshair {...props} />;
      case 'Pill': return <Pill {...props} />;
      default: return <Award {...props} />;
    }
  };

  return (
    <div className="space-y-4 select-none">
      {/* Top Header */}
      <header className="flex items-center justify-between pt-1 pb-1">
        <div>
          <h1 className="text-2xl font-black text-[#0D1B2A] tracking-tight">
            Achievements
          </h1>
          <p className="text-xs font-semibold text-[#68727D] mt-0.5">
            Milestones unlocked through physical & mental discipline
          </p>
        </div>
      </header>

      {/* Overview Progress Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#EEEDE9] shadow-xs flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black text-[#68727D] uppercase tracking-wider block mb-1">
            UNLOCKED MILESTONES
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-[#0D1B2A]">
              {unlockedCount}
            </span>
            <span className="text-sm font-bold text-[#68727D]">
              / {totalCount}
            </span>
          </div>
          <span className="text-xs font-black text-[#12324A] mt-1 block">
            {progressPercent}% Completed
          </span>
        </div>

        <div className="w-16 h-16 relative flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-[#EEEDE9]"
              strokeWidth="3.6"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-[#4A90C2] transition-all duration-700 ease-out"
              strokeDasharray={`${progressPercent}, 100`}
              strokeWidth="3.6"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <Award className="w-6 h-6 text-[#12324A] absolute" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-white border border-[#EEEDE9] p-1 rounded-2xl shadow-xs">
        {(['all', 'unlocked', 'locked'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 text-xs font-bold capitalize rounded-xl transition-all cursor-pointer ${
              filter === f
                ? 'bg-[#12324A] text-white font-black shadow-xs'
                : 'text-[#68727D] hover:text-[#0D1B2A]'
            }`}
          >
            {f} {f === 'unlocked' ? `(${unlockedCount})` : f === 'locked' ? `(${totalCount - unlockedCount})` : `(${totalCount})`}
          </button>
        ))}
      </div>

      {/* Achievement Cards Grid */}
      <div className="grid grid-cols-1 gap-2.5">
        {filteredAchievements.map((ach) => {
          const isUnlocked = !!ach.unlockedAt;
          const unlockDateFormatted = ach.unlockedAt
            ? formatOrdinalDate(ach.unlockedAt.split('T')[0], { shortMonth: true })
            : null;

          return (
            <div
              key={ach.id}
              className={`p-4 rounded-3xl border transition-all flex items-start justify-between gap-3 ${
                isUnlocked
                  ? 'bg-white border-[#EEEDE9] shadow-xs'
                  : 'bg-[#F7F6F2] border-[#EEEDE9] opacity-65'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                {/* Icon Container */}
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-2xl shrink-0 mt-0.5 ${
                    isUnlocked
                      ? 'bg-[#DCEAF4] text-[#12324A] shadow-xs'
                      : 'bg-[#EEEDE9] text-[#68727D]'
                  }`}
                >
                  {getIcon(ach.icon, isUnlocked)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`text-sm font-black tracking-tight truncate ${
                        isUnlocked ? 'text-[#0D1B2A]' : 'text-[#68727D]'
                      }`}
                    >
                      {ach.title}
                    </h3>
                    {isUnlocked && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded-md bg-[#DCEAF4] text-[#12324A] text-[9px] font-black uppercase shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                        <span>UNLOCKED</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#68727D] mt-0.5 font-medium leading-relaxed">
                    {ach.description}
                  </p>

                  {isUnlocked && unlockDateFormatted && (
                    <span className="text-[10px] font-bold text-[#4A90C2] mt-1 block">
                      Unlocked {unlockDateFormatted}
                    </span>
                  )}
                </div>
              </div>

              {!isUnlocked && (
                <div className="shrink-0 pt-1 text-[#68727D]" title="Locked">
                  <Lock className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
