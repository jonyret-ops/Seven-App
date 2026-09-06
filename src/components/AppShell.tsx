import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BottomNavigation, TabType } from './BottomNavigation';
import { HomeScreen } from './screens/HomeScreen';
import { QuestsScreen } from './screens/QuestsScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { AchievementsScreen } from './screens/AchievementsScreen';
import { SettingsModal } from './SettingsModal';
import { WeightEntryModal } from './WeightEntryModal';
import { LevelUpModal } from './LevelUpModal';
import { OnboardingModal } from './OnboardingModal';
import { AchievementUnlockToast } from './AchievementUnlockToast';
import { PersonalRecordToast } from './PersonalRecordToast';
import { DAILY_QUESTS } from '../constants';

export const AppShell: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const { currentLog, setSelectedDate } = useApp();

  // Count uncompleted boolean quests for today badge
  const uncompletedCount = DAILY_QUESTS.filter(
    (q) => q.type === 'boolean' && !currentLog.completedQuestIds.includes(q.id) && !(currentLog.naQuestIds || []).includes(q.id)
  ).length;

  const handleSelectHistoricalDate = (date: string) => {
    setSelectedDate(date);
    setActiveTab('quests');
  };

  return (
    <div className="min-h-screen bg-[#0B0E11] text-zinc-100 flex justify-center selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Mobile-first centered frame with adaptive max width for desktop / tablet */}
      <div className="w-full max-w-md md:max-w-xl min-h-screen px-4 pt-3 flex flex-col relative">
        {/* Active Screen View */}
        <main className="flex-1">
          {activeTab === 'home' && (
            <HomeScreen
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenWeightModal={() => setIsWeightModalOpen(true)}
            />
          )}

          {activeTab === 'quests' && <QuestsScreen />}

          {activeTab === 'progress' && (
            <ProgressScreen
              onOpenWeightModal={() => setIsWeightModalOpen(true)}
              onSelectHistoricalDate={handleSelectHistoricalDate}
            />
          )}

          {activeTab === 'achievements' && <AchievementsScreen />}
        </main>

        {/* Bottom Navigation */}
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          uncompletedQuestsCount={uncompletedCount}
        />

        {/* Global Modals & Notifications */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />

        <WeightEntryModal
          isOpen={isWeightModalOpen}
          onClose={() => setIsWeightModalOpen(false)}
        />

        <LevelUpModal />
        <OnboardingModal />
        <AchievementUnlockToast />
        <PersonalRecordToast />
      </div>
    </div>
  );
};
