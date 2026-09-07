import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BottomNavigation, TabType } from './BottomNavigation';
import { HomeScreen } from './screens/HomeScreen';
import { QuestsScreen } from './screens/QuestsScreen';
import { NutritionScreen } from './screens/NutritionScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { MoreScreen } from './screens/MoreScreen';
import { AchievementsScreen } from './screens/AchievementsScreen';
import { SettingsModal } from './SettingsModal';
import { WeightEntryModal } from './WeightEntryModal';
import { LevelUpModal } from './LevelUpModal';
import { OnboardingModal } from './OnboardingModal';
import { AchievementUnlockToast } from './AchievementUnlockToast';
import { PersonalRecordToast } from './PersonalRecordToast';
import { LaunchScreen } from './LaunchScreen';
import { DAILY_QUESTS } from '../constants';

export const AppShell: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const { currentLog, setSelectedDate, profile, updateProfile } = useApp();

  const isUserOnboarded = profile.onboardingCompleted || localStorage.getItem('seven_onboarding_completed') === 'true';

  // Show launch/opening screen if not launched in this session OR if user hasn't completed onboarding yet
  const [showLaunch, setShowLaunch] = useState<boolean>(() => {
    const hasLaunched = sessionStorage.getItem('seven_app_launched') === 'true';
    const onboarded = localStorage.getItem('seven_onboarding_completed') === 'true';
    return !hasLaunched || !onboarded;
  });

  // Handle "Get Started" tap on SEVEN Opening Screen
  const handleGetStarted = () => {
    sessionStorage.setItem('seven_app_launched', 'true');
    setShowLaunch(false);

    // If user hasn't onboarded yet, show setup questions; otherwise, go to Home
    if (!isUserOnboarded) {
      setIsOnboardingOpen(true);
    }
  };

  // Return to opening screen if user backs out of question 1
  const handleBackToOpeningScreen = () => {
    setIsOnboardingOpen(false);
    setShowLaunch(true);
  };

  // Count uncompleted boolean quests for today badge
  const uncompletedCount = DAILY_QUESTS.filter(
    (q) => q.type === 'boolean' && !currentLog.completedQuestIds.includes(q.id) && !(currentLog.naQuestIds || []).includes(q.id)
  ).length;

  const handleSelectHistoricalDate = (date: string) => {
    setSelectedDate(date);
    setActiveTab('quests');
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#0D1B2A] flex justify-center selection:bg-[#4A90C2]/20 selection:text-[#12324A]">
      {/* SEVEN Opening Screen */}
      {showLaunch && (
        <LaunchScreen 
          onGetStarted={handleGetStarted}
        />
      )}

      {/* Mobile-first centered frame with adaptive width for 375px–430px+ iPhone viewports */}
      <div 
        className="w-full max-w-md md:max-w-xl min-h-screen px-4 flex flex-col relative"
        style={{
          paddingTop: 'max(env(safe-area-inset-top, 0px), 62px)',
          paddingLeft: 'max(env(safe-area-inset-left, 0px), 16px)',
          paddingRight: 'max(env(safe-area-inset-right, 0px), 16px)',
        }}
      >
        {/* Active Screen View with scroll padding to clear lowered bottom navigation and iOS safe area */}
        <main 
          className="flex-1"
          style={{
            paddingBottom: 'calc(49px + env(safe-area-inset-bottom, 0px) + 20px)',
          }}
        >
          {activeTab === 'home' && (
            <HomeScreen
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenWeightModal={() => setIsWeightModalOpen(true)}
            />
          )}

          {activeTab === 'quests' && <QuestsScreen />}

          {activeTab === 'nutrition' && <NutritionScreen />}

          {activeTab === 'progress' && (
            <ProgressScreen
              onOpenWeightModal={() => setIsWeightModalOpen(true)}
              onSelectHistoricalDate={handleSelectHistoricalDate}
            />
          )}

          {activeTab === 'more' && (
            <MoreScreen
              onOpenSettings={() => setIsSettingsOpen(true)}
              onNavigateTab={(tab) => setActiveTab(tab)}
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

        {/* Modals & Notifications */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />

        <WeightEntryModal
          isOpen={isWeightModalOpen}
          onClose={() => setIsWeightModalOpen(false)}
        />

        <LevelUpModal />
        
        {/* Opening / Setup Questions Modal */}
        <OnboardingModal 
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          onBackToOpeningScreen={handleBackToOpeningScreen}
        />

        <AchievementUnlockToast />
        <PersonalRecordToast />
      </div>
    </div>
  );
};
