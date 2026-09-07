import React, { useState } from 'react';
import { 
  X, 
  Check, 
  User, 
  Mountain, 
  Flame, 
  Trophy, 
  Target, 
  Award, 
  Calendar,
  Zap,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProfileIcon } from './ProfileIcon';
import { getDaysDifference } from '../lib/calculations';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: any) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onNavigateTab }) => {
  const { 
    profile, 
    updateProfile, 
    currentArc, 
    dayNumber, 
    daysRemaining, 
    levelInfo, 
    statusSnapshot, 
    totalCumulativeXp,
    achievements,
    streakStats,
    allLogs
  } = useApp();

  if (!isOpen) return null;

  const displayName = profile.name?.trim() || 'Athlete';

  // Level & XP calculations
  const userLevel = levelInfo?.currentLevel ?? 1;
  const userTitle = levelInfo?.currentTitle ?? 'INITIATE';
  const xpInCurrent = levelInfo?.xpInCurrentLevel ?? 0;
  const bracketXp = (levelInfo?.nextLevelXpRequired && levelInfo?.currentLevelXpRequired)
    ? (levelInfo.nextLevelXpRequired - levelInfo.currentLevelXpRequired)
    : 500;
  const xpNeeded = levelInfo?.xpNeededForNextLevel ?? (bracketXp - xpInCurrent);
  const xpProgressPercent = levelInfo?.progressPercent ?? Math.min(100, Math.round((xpInCurrent / bracketXp) * 100));

  // 100-level long-term progress
  const max100Progress = Math.min(100, Math.round((userLevel / 100) * 100));

  // Arc calculation
  const arcTotalDays = (currentArc?.startDate && currentArc?.endDate)
    ? getDaysDifference(currentArc.startDate, currentArc.endDate) + 1
    : 90;
  const currentArcDay = Math.min(arcTotalDays, dayNumber || 1);
  const arcPercent = Math.min(100, Math.round((currentArcDay / arcTotalDays) * 100));
  const arcDaysLeft = daysRemaining !== undefined ? daysRemaining : Math.max(0, arcTotalDays - currentArcDay);

  // Lifetime Stats
  const currentStreak = streakStats?.currentStreak ?? 0;
  const longestStreak = streakStats?.longestStreak ?? 0;
  const perfectDaysCount = allLogs.filter((l) => l.isPerfectDay).length;
  const conqueredDaysCount = allLogs.filter((l) => l.isConqueredDay).length;
  const achievementsCount = achievements.filter((a) => Boolean(a.unlockedAt)).length;
  const memberSinceStr = profile.memberSince ? new Date(profile.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in select-none">
      <div className="bg-[#F7F6F2] rounded-3xl w-full max-w-md max-h-[92vh] overflow-y-auto border border-[#EEEDE9] shadow-2xl text-[#0D1B2A] no-scrollbar">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-[#F7F6F2]/95 backdrop-blur-md p-4 border-b border-[#EEEDE9] flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#DCEAF4] text-[#12324A] flex items-center justify-center font-black text-sm">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-[#0D1B2A] tracking-wider uppercase">
                Profile & Progression
              </h2>
              <p className="text-[10px] text-[#68727D] font-semibold">
                SEVEN Discipline Record
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white border border-[#EEEDE9] hover:bg-[#EEEDE9] flex items-center justify-center text-[#68727D] hover:text-[#0D1B2A] transition-colors cursor-pointer"
            aria-label="Close profile"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Container */}
        <div className="p-4 space-y-4">
          {/* 1. USER IDENTITY */}
          <section className="bg-white rounded-3xl p-5 border border-[#EEEDE9] shadow-xs text-center space-y-3">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#F7F6F2] border border-[#EEEDE9] flex items-center justify-center shadow-xs">
                <ProfileIcon size="xl" />
              </div>

              <h2 className="text-lg font-black text-[#0D1B2A] mt-2">
                {displayName}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="px-2 py-0.5 rounded-full bg-[#DCEAF4] text-[#12324A] text-[10px] font-black tracking-wider uppercase">
                  LEVEL {userLevel} · {userTitle}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#EEEDE9] text-[#68727D] text-[10px] font-black tracking-wider uppercase">
                  {statusSnapshot?.currentStatus || 'BUILDING STATUS'}
                </span>
              </div>
            </div>
          </section>

          {/* 2. LEVEL & LIFETIME XP */}
          <section className="bg-white rounded-3xl p-5 border border-[#EEEDE9] shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black text-[#68727D] tracking-wider uppercase">
                  CURRENT PROGRESSION
                </span>
                <div className="text-base font-black text-[#0D1B2A] tracking-tight mt-0.5">
                  Level {userLevel} · {userTitle}
                </div>
                <div className="text-xs font-bold text-[#68727D]">
                  Lifetime XP: {totalCumulativeXp.toLocaleString()}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-black text-[#68727D] tracking-wider uppercase">
                  NEXT LEVEL
                </span>
                <div className="text-xs font-black text-[#12324A] mt-0.5">
                  {xpNeeded.toLocaleString()} XP to Lvl {userLevel + 1}
                </div>
              </div>
            </div>

            {/* Current Level XP Progress Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#68727D]">
                <span>{xpInCurrent.toLocaleString()} / {bracketXp.toLocaleString()} XP</span>
                <span>{xpProgressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#EEEDE9] overflow-hidden">
                <div
                  className="h-full bg-[#12324A] rounded-full transition-all duration-500"
                  style={{ width: `${xpProgressPercent}%` }}
                />
              </div>
            </div>

            {/* 100-Level Grand Horizon Bar */}
            <div className="pt-2 border-t border-[#EEEDE9] space-y-1">
              <div className="flex items-center justify-between text-[10px] font-bold text-[#68727D]">
                <span>THE 100-LEVEL JOURNEY</span>
                <span>Level {userLevel} / 100</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#EEEDE9] overflow-hidden">
                <div
                  className="h-full bg-[#4A90C2] rounded-full"
                  style={{ width: `${max100Progress}%` }}
                />
              </div>
            </div>
          </section>

          {/* 3. ACTIVE ARC PRESENTATION */}
          <section className="bg-white rounded-3xl p-5 border border-[#EEEDE9] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-[#68727D] tracking-wider uppercase">
                  ACTIVE ARC
                </span>
                <h3 className="text-base font-black text-[#0D1B2A] tracking-tight mt-0.5">
                  {currentArc?.name || 'WINTER ARC'}
                </h3>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-[#DCEAF4] text-[#12324A] text-[11px] font-black">
                {arcPercent}% COMPLETE
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-[#68727D]">
                <span>Day {currentArcDay} of {arcTotalDays}</span>
                <span>{arcDaysLeft} Days Remaining</span>
              </div>

              <div className="w-full h-2 rounded-full bg-[#EEEDE9] overflow-hidden">
                <div
                  className="h-full bg-[#4A90C2] rounded-full transition-all duration-500"
                  style={{ width: `${arcPercent}%` }}
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-medium text-[#68727D] border-t border-[#EEEDE9]">
              <div className="flex items-center gap-1.5">
                <Mountain className="w-3.5 h-3.5 text-[#4A90C2]" />
                <span>{currentArc?.startDate || 'Sep 6'} – {currentArc?.endDate || 'Dec 5'}</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onNavigateTab) onNavigateTab('progress');
                }}
                className="text-xs font-black text-[#12324A] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>View Arc</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </section>

          {/* 4. LIFETIME STATS */}
          <section className="bg-white rounded-3xl p-5 border border-[#EEEDE9] shadow-xs space-y-3">
            <span className="text-[10px] font-black text-[#68727D] tracking-wider uppercase block">
              LIFETIME DISCIPLINE STATS
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-[#F7F6F2] p-3 rounded-2xl border border-[#EEEDE9]">
                <div className="text-[10px] font-bold text-[#68727D] uppercase">Current Streak</div>
                <div className="text-base font-black text-[#0D1B2A] mt-0.5">{currentStreak} Days</div>
              </div>

              <div className="bg-[#F7F6F2] p-3 rounded-2xl border border-[#EEEDE9]">
                <div className="text-[10px] font-bold text-[#68727D] uppercase">Longest Streak</div>
                <div className="text-base font-black text-[#0D1B2A] mt-0.5">{longestStreak} Days</div>
              </div>

              <div className="bg-[#F7F6F2] p-3 rounded-2xl border border-[#EEEDE9]">
                <div className="text-[10px] font-bold text-[#68727D] uppercase">Perfect Days 💎</div>
                <div className="text-base font-black text-[#0D1B2A] mt-0.5">{perfectDaysCount} Days</div>
              </div>

              <div className="bg-[#F7F6F2] p-3 rounded-2xl border border-[#EEEDE9]">
                <div className="text-[10px] font-bold text-[#68727D] uppercase">Conquered Days</div>
                <div className="text-base font-black text-[#0D1B2A] mt-0.5">{conqueredDaysCount} Days</div>
              </div>

              <div className="bg-[#F7F6F2] p-3 rounded-2xl border border-[#EEEDE9]">
                <div className="text-[10px] font-bold text-[#68727D] uppercase">Achievements</div>
                <div className="text-base font-black text-[#0D1B2A] mt-0.5">{achievementsCount} Unlocked</div>
              </div>

              <div className="bg-[#F7F6F2] p-3 rounded-2xl border border-[#EEEDE9]">
                <div className="text-[10px] font-bold text-[#68727D] uppercase">Member Since</div>
                <div className="text-base font-black text-[#0D1B2A] mt-0.5">{memberSinceStr}</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
