import React, { useState } from 'react';
import { 
  Flame, 
  Trophy, 
  ChevronRight, 
  User, 
  Target, 
  Settings, 
  Award,
  Mountain
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProfileModal } from '../ProfileModal';
import { ProfileIcon } from '../ProfileIcon';

interface MoreScreenProps {
  onOpenSettings: () => void;
  onNavigateTab: (tab: any) => void;
}

export const MoreScreen: React.FC<MoreScreenProps> = ({
  onOpenSettings,
  onNavigateTab,
}) => {
  const {
    profile,
    levelInfo,
    achievements,
    streakStats,
    allLogs,
    currentArc,
  } = useApp();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const displayName = profile.name?.trim() || 'Athlete';
  const userLevel = levelInfo?.currentLevel ?? 1;
  const userTitle = levelInfo?.currentTitle ?? 'INITIATE';
  const currentXp = levelInfo?.xpInCurrentLevel ?? 0;
  const bracketXp = (levelInfo?.nextLevelXpRequired && levelInfo?.currentLevelXpRequired)
    ? (levelInfo.nextLevelXpRequired - levelInfo.currentLevelXpRequired)
    : 500;
  const xpPercent = levelInfo?.progressPercent ?? Math.min(100, Math.round((currentXp / bracketXp) * 100));

  const unlockedCount = achievements.filter((a) => Boolean(a.unlockedAt)).length;
  const streakCount = streakStats?.currentStreak ?? 0;
  const gymCount = allLogs.filter((l) => l.completedQuestIds?.includes('hit_the_gym')).length;

  const menuItems = [
    {
      id: 'view_profile',
      label: 'Full Profile & Lifetime Stats',
      icon: User,
      action: () => setIsProfileOpen(true),
    },
    {
      id: 'macro_targets',
      label: 'Macro & Nutrition Targets',
      icon: Target,
      action: onOpenSettings,
    },
    {
      id: 'achievements',
      label: 'Achievements & Badges',
      icon: Award,
      action: () => onNavigateTab('achievements'),
    },
    {
      id: 'active_arc',
      label: `${currentArc?.name || 'Active Arc'} Progress`,
      icon: Mountain,
      action: () => setIsProfileOpen(true),
    },
    {
      id: 'app_settings',
      label: 'Preferences, Backup & Schedule',
      icon: Settings,
      action: onOpenSettings,
    },
  ];

  return (
    <div className="space-y-4 select-none">
      {/* Top Header */}
      <header className="flex items-center justify-between pt-1 pb-1">
        <div>
          <h1 className="text-2xl font-black text-[#0D1B2A] tracking-tight">
            Account & More
          </h1>
          <p className="text-xs font-semibold text-[#68727D] mt-0.5">
            Identity, progression & app configuration
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenSettings}
          className="text-xs font-bold text-[#4A90C2] hover:underline cursor-pointer"
        >
          Settings
        </button>
      </header>

      {/* User Identity Card with prominent "VIEW PROFILE →" Button (Requirement 15) */}
      <div className="bg-white rounded-3xl p-6 border border-[#EEEDE9] shadow-xs flex flex-col items-center text-center space-y-3">
        {/* Profile Icon */}
        <div className="w-18 h-18 rounded-full bg-[#F7F6F2] border border-[#EEEDE9] flex items-center justify-center shadow-xs">
          <ProfileIcon size="lg" />
        </div>

        <div>
          <h2 className="text-lg font-black text-[#0D1B2A]">
            {displayName}
          </h2>
          <div className="text-xs font-bold text-[#68727D] mt-0.5">
            Level {userLevel} · {userTitle}
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="w-full max-w-xs space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#68727D]">
            <span>{currentXp.toLocaleString()} / {bracketXp.toLocaleString()} XP</span>
            <span>{xpPercent}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-[#EEEDE9] overflow-hidden">
            <div
              className="h-full bg-[#12324A] rounded-full transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>

        {/* Prominent VIEW PROFILE action button */}
        <button
          type="button"
          onClick={() => setIsProfileOpen(true)}
          className="w-full mt-2 py-3 px-4 rounded-2xl bg-[#12324A] hover:bg-[#0D1B2A] text-white text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs min-h-[44px]"
        >
          <span>View Profile</span>
          <ChevronRight className="w-4 h-4 text-[#DCEAF4]" />
        </button>
      </div>

      {/* 3 Stat Badges */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Streak */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#EEEDE9] shadow-xs flex flex-col items-center justify-center text-center">
          <div className="w-7 h-7 rounded-xl bg-[#DCEAF4] text-[#12324A] flex items-center justify-center mb-1">
            <Flame className="w-4 h-4" />
          </div>
          <span className="text-base font-black text-[#0D1B2A]">
            {streakCount}
          </span>
          <span className="text-[10px] font-bold text-[#68727D] uppercase">
            Day Streak
          </span>
        </div>

        {/* Gym Sessions */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#EEEDE9] shadow-xs flex flex-col items-center justify-center text-center">
          <div className="w-7 h-7 rounded-xl bg-[#DCEAF4] text-[#12324A] flex items-center justify-center mb-1">
            <Trophy className="w-4 h-4" />
          </div>
          <span className="text-base font-black text-[#0D1B2A]">
            {gymCount}
          </span>
          <span className="text-[10px] font-bold text-[#68727D] uppercase">
            Gym Logs
          </span>
        </div>

        {/* Achievements */}
        <div 
          onClick={() => onNavigateTab('achievements')}
          className="bg-white p-3.5 rounded-2xl border border-[#EEEDE9] shadow-xs flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#4A90C2] transition-colors"
        >
          <div className="w-7 h-7 rounded-xl bg-[#DCEAF4] text-[#12324A] flex items-center justify-center mb-1">
            <Award className="w-4 h-4" />
          </div>
          <span className="text-base font-black text-[#0D1B2A]">
            {unlockedCount}
          </span>
          <span className="text-[10px] font-bold text-[#68727D] uppercase">
            Badges
          </span>
        </div>
      </div>

      {/* Options List */}
      <div className="bg-white rounded-3xl border border-[#EEEDE9] shadow-xs divide-y divide-[#EEEDE9] overflow-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={item.action}
              className="p-4 flex items-center justify-between hover:bg-[#F7F6F2] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#F2F1ED] text-[#12324A] flex items-center justify-center">
                  <Icon className="w-4 h-4 stroke-[2]" />
                </div>
                <span className="text-xs font-bold text-[#0D1B2A]">
                  {item.label}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#68727D]" />
            </div>
          );
        })}
      </div>

      {/* Version Footer */}
      <div className="text-center pt-2">
        <span className="text-[10px] font-black tracking-widest text-[#68727D] uppercase">
          SEVEN · DISCIPLINE OPERATING SYSTEM
        </span>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onNavigateTab={onNavigateTab}
      />
    </div>
  );
};
