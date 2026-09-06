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
    const props = { className: `w-5 h-5 ${isUnlocked ? 'stroke-[2.5]' : 'stroke-[1.5]'}` };
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
    <div className="space-y-4 pb-28 animate-in fade-in duration-300">
      {/* Header */}
      <header className="pt-1">
        <span className="text-[10px] font-black tracking-widest uppercase text-emerald-400 block">
          MILESTONES & TROPHIES
        </span>
        <h1 className="text-2xl font-black text-white tracking-tight">
          ACHIEVEMENTS
        </h1>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          Milestones unlocked by physical, mental, and personal discipline.
        </p>
      </header>

      {/* Overview Progress Card */}
      <div className="bg-[#14171D] rounded-3xl p-4 border border-white/[0.08] shadow-sm flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">
            UNLOCKED MILESTONES
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white">
              {unlockedCount}
            </span>
            <span className="text-sm font-bold text-zinc-500">
              / {totalCount}
            </span>
          </div>
          <span className="text-xs font-bold text-emerald-400 mt-1 block">
            {progressPercent}% completed
          </span>
        </div>

        <div className="w-18 h-18 relative flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="36"
              cy="36"
              r="28"
              stroke="#22272E"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="36"
              cy="36"
              r="28"
              stroke="#22C55E"
              strokeWidth="6"
              strokeDasharray={2 * Math.PI * 28}
              strokeDashoffset={2 * Math.PI * 28 - (progressPercent / 100) * (2 * Math.PI * 28)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <Award className="w-6 h-6 text-emerald-400 absolute" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-zinc-900 border border-white/[0.08] p-1 rounded-xl">
        {(['all', 'unlocked', 'locked'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`flex-1 py-1.5 text-xs font-bold capitalize rounded-lg transition-all cursor-pointer ${
              filter === f
                ? 'bg-emerald-500 text-black font-black shadow-xs'
                : 'text-zinc-400 hover:text-white'
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
            ? new Date(ach.unlockedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : null;

          return (
            <div
              key={ach.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                isUnlocked
                  ? 'bg-[#14171D] border-white/[0.09] shadow-xs hover:border-emerald-500/30'
                  : 'bg-zinc-900/60 border-white/[0.04] opacity-55'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon Container */}
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 mt-0.5 ${
                    isUnlocked
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-xs'
                      : 'bg-zinc-800 text-zinc-500 border border-zinc-700/50'
                  }`}
                >
                  {getIcon(ach.icon, isUnlocked)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3
                      className={`text-sm font-black tracking-tight ${
                        isUnlocked ? 'text-white' : 'text-zinc-400'
                      }`}
                    >
                      {ach.title}
                    </h3>
                    {isUnlocked && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                        <span>UNLOCKED</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                    {ach.description}
                  </p>

                  {isUnlocked && unlockDateFormatted && (
                    <span className="text-[10px] font-semibold text-zinc-500 mt-1 block">
                      Unlocked {unlockDateFormatted}
                    </span>
                  )}
                </div>
              </div>

              {!isUnlocked && (
                <div className="shrink-0 pt-1 text-zinc-600" title="Locked">
                  <Lock className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
