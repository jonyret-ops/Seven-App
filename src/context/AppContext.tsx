import confetti from 'canvas-confetti';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_ARC,
  DEFAULT_PROFILE,
  INITIAL_PERSONAL_RECORDS,
  getDailyBonusObjective
} from '../constants';
import {
  addDays,
  calculateCharacterStats,
  calculateDailyMetrics,
  calculateLevel,
  calculateStatusSnapshot,
  calculateStreaks,
  calculateWeightStats,
  evaluateAchievements,
  formatDate,
  getDaysDifference
} from '../lib/calculations';
import { soundEngine } from '../lib/sound';
import { repository } from '../lib/storage';
import {
  Achievement,
  Arc,
  ArcRecap,
  BonusObjectiveDefinition,
  CharacterStats,
  DailyLog,
  PersonalRecord,
  StatusSnapshot,
  StreakStats,
  UserProfile,
  WeightEntry,
  WeightStats,
} from '../types';

interface LevelUpInfo {
  oldLevel: number;
  newLevel: number;
  title: string;
}

interface AppContextType {
  profile: UserProfile;
  currentArc: Arc;
  activeTodayDate: string;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  currentLog: DailyLog;
  allLogs: DailyLog[];
  weightEntries: WeightEntry[];
  achievements: Achievement[];
  personalRecords: PersonalRecord[];
  arcRecaps: ArcRecap[];
  
  // Progress calculations
  dayNumber: number;
  daysSinceStart: number;
  daysRemaining: number;
  todayXp: number;
  todayCorePerformance: number;
  selectedDateXp: number;
  totalCumulativeXp: number;
  levelInfo: ReturnType<typeof calculateLevel>;
  statusSnapshot: StatusSnapshot;
  characterStats: CharacterStats;
  streakStats: StreakStats;
  weightStats: WeightStats;
  todayBonusObjective: BonusObjectiveDefinition;

  // Actions
  toggleBooleanQuest: (questId: string) => Promise<void>;
  toggleQuestNA: (questId: string) => Promise<void>;
  setDailyFocus: (rating: number) => Promise<void>;
  setSteps: (steps: number) => Promise<void>;
  setSleep: (hours: number) => Promise<void>;
  toggleEnergyDrink: () => Promise<void>;
  toggleSideQuest: (sideQuestId: string) => Promise<void>;
  toggleBonusObjective: () => Promise<void>;
  addWeightEntry: (weight: number, date: string, note?: string) => Promise<void>;
  deleteWeightEntry: (id: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateArc: (updates: Partial<Arc>) => Promise<void>;
  completeCurrentArc: () => Promise<ArcRecap>;
  startNewArc: (newArc: Arc) => Promise<void>;
  resetAllData: () => Promise<void>;
  exportData: () => Promise<string>;
  importData: (json: string) => Promise<boolean>;

  // Celebrations & Modals
  levelUpModalData: LevelUpInfo | null;
  dismissLevelUpModal: () => void;
  recentAchievement: Achievement | null;
  dismissAchievement: () => void;
  newPersonalRecord: PersonalRecord | null;
  dismissPersonalRecord: () => void;
  isDateFuture: (dateStr: string) => boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [currentArc, setCurrentArc] = useState<Arc>(DEFAULT_ARC);
  const [arcRecaps, setArcRecaps] = useState<ArcRecap[]>([]);
  const [allLogs, setAllLogs] = useState<DailyLog[]>([]);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>(INITIAL_PERSONAL_RECORDS);

  // Calculate active today date (real local device date)
  const activeTodayDate = formatDate(new Date());

  const [selectedDate, setSelectedDate] = useState<string>(activeTodayDate);
  const [levelUpModalData, setLevelUpModalData] = useState<LevelUpInfo | null>(null);
  const [recentAchievement, setRecentAchievement] = useState<Achievement | null>(null);
  const [newPersonalRecord, setNewPersonalRecord] = useState<PersonalRecord | null>(null);

  // Load persistent data from repository on mount
  useEffect(() => {
    async function loadData() {
      const storedProfile = await repository.getProfile();
      let storedArc = await repository.getCurrentArc();
      const storedRecaps = await repository.getArcRecaps();
      const storedLogs = await repository.getAllDailyLogs();
      const storedWeights = await repository.getWeightEntries();
      const storedAchievements = await repository.getAchievements();
      const storedPRs = await repository.getPersonalRecords();

      // Ensure arc has valid dates if newly initialized
      if (!storedArc.startDate) {
        storedArc = {
          ...storedArc,
          startDate: activeTodayDate,
          endDate: addDays(activeTodayDate, 90),
        };
        await repository.saveCurrentArc(storedArc);
      }

      setProfile(storedProfile);
      setCurrentArc(storedArc);
      setArcRecaps(storedRecaps);
      setAllLogs(storedLogs);
      setWeightEntries(storedWeights);
      setAchievements(storedAchievements);
      setPersonalRecords(storedPRs);
    }
    loadData();
  }, [activeTodayDate]);

  // Helper to get or create log for a specific date
  const getLogForDate = (date: string, logsList: DailyLog[]): DailyLog => {
    const existing = logsList.find(l => l.date === date);
    if (existing) {
      const derived = calculateDailyMetrics(existing, profile.conqueredThresholdPercent);
      return {
        ...existing,
        naQuestIds: existing.naQuestIds || [],
        completedSideQuestIds: existing.completedSideQuestIds || [],
        corePointsEarned: derived.corePointsEarned,
        corePointsAvailable: derived.corePointsAvailable,
        corePerformancePercent: derived.corePerformancePercent,
        baseXp: derived.baseXp,
        bonusXp: derived.bonusXp,
        totalXp: derived.totalXp,
        dailyRank: derived.dailyRank,
        isConqueredDay: derived.isConqueredDay,
        isPerfectDay: derived.isPerfectDay,
      };
    }
    const emptyPartial: Partial<DailyLog> = {
      date,
      completedQuestIds: [],
      naQuestIds: [],
      completedSideQuestIds: [],
      steps: 0,
      sleepHours: 0,
      focusRating: 0,
      energyDrinkConsumed: false,
    };
    const derived = calculateDailyMetrics(emptyPartial, profile.conqueredThresholdPercent);
    return {
      date,
      completedQuestIds: [],
      naQuestIds: [],
      completedSideQuestIds: [],
      steps: 0,
      sleepHours: 0,
      focusRating: 0,
      energyDrinkConsumed: false,
      corePointsEarned: derived.corePointsEarned,
      corePointsAvailable: derived.corePointsAvailable,
      corePerformancePercent: derived.corePerformancePercent,
      baseXp: derived.baseXp,
      bonusXp: derived.bonusXp,
      totalXp: derived.totalXp,
      dailyRank: derived.dailyRank,
      isConqueredDay: derived.isConqueredDay,
      isPerfectDay: derived.isPerfectDay,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const currentLog = useMemo(() => {
    return getLogForDate(selectedDate, allLogs);
  }, [selectedDate, allLogs, profile.conqueredThresholdPercent]);

  const todayLog = useMemo(() => {
    return getLogForDate(activeTodayDate, allLogs);
  }, [activeTodayDate, allLogs, profile.conqueredThresholdPercent]);

  const todayXp = todayLog.totalXp;
  const todayCorePerformance = todayLog.corePerformancePercent;
  const selectedDateXp = currentLog.totalXp;

  // Calculate cumulative XP across all logged days
  const totalCumulativeXp = useMemo(() => {
    const map = new Map<string, DailyLog>();
    for (const log of allLogs) {
      map.set(log.date, log);
    }
    map.set(currentLog.date, currentLog);

    let sum = 0;
    map.forEach(log => {
      sum += log.totalXp;
    });
    return sum;
  }, [allLogs, currentLog]);

  const levelInfo = useMemo(() => {
    return calculateLevel(totalCumulativeXp);
  }, [totalCumulativeXp]);

  const statusSnapshot = useMemo(() => {
    return calculateStatusSnapshot(allLogs, activeTodayDate);
  }, [allLogs, activeTodayDate]);

  const characterStats = useMemo(() => {
    return calculateCharacterStats(allLogs, activeTodayDate);
  }, [allLogs, activeTodayDate]);

  const streakStats = useMemo(() => {
    const map = new Map<string, DailyLog>();
    allLogs.forEach(l => map.set(l.date, l));
    map.set(currentLog.date, currentLog);
    return calculateStreaks(Array.from(map.values()), activeTodayDate, profile.conqueredThresholdPercent);
  }, [allLogs, currentLog, activeTodayDate, profile.conqueredThresholdPercent]);

  const weightStats = useMemo(() => {
    return calculateWeightStats(
      weightEntries,
      profile.lifetimeBaselineWeight,
      currentArc.goalWeight,
      currentArc.startingWeight,
      profile.weightUnit || 'lb'
    );
  }, [weightEntries, profile.lifetimeBaselineWeight, currentArc.goalWeight, currentArc.startingWeight, profile.weightUnit]);

  const todayBonusObjective = useMemo(() => {
    return getDailyBonusObjective(selectedDate);
  }, [selectedDate]);

  // Day counts
  const arcStartDate = currentArc.startDate || activeTodayDate;
  const arcGoalDate = currentArc.endDate || addDays(activeTodayDate, 90);
  const daysSinceStart = Math.max(0, getDaysDifference(arcStartDate, activeTodayDate));
  const dayNumber = Math.max(1, daysSinceStart + 1);
  const daysRemaining = Math.max(0, getDaysDifference(activeTodayDate, arcGoalDate));

  const isDateFuture = (dateStr: string): boolean => {
    return dateStr > activeTodayDate;
  };

  // Check personal records
  const checkPersonalRecords = async (log: DailyLog, currentStreak: number) => {
    const prs = [...personalRecords];
    let brokenPr: PersonalRecord | null = null;

    // 1. Highest Daily XP
    const xpPr = prs.find(p => p.id === 'pr_daily_xp');
    if (xpPr && log.totalXp > xpPr.value) {
      brokenPr = {
        ...xpPr,
        value: log.totalXp,
        displayValue: `${log.totalXp} XP`,
        dateAchieved: log.date,
        previousValue: xpPr.value,
      };
      prs[prs.indexOf(xpPr)] = brokenPr;
    }

    // 2. Longest streak
    const streakPr = prs.find(p => p.id === 'pr_longest_streak');
    if (streakPr && currentStreak > streakPr.value) {
      brokenPr = {
        ...streakPr,
        value: currentStreak,
        displayValue: `${currentStreak} Days`,
        dateAchieved: log.date,
        previousValue: streakPr.value,
      };
      prs[prs.indexOf(streakPr)] = brokenPr;
    }

    // 3. Most steps
    const stepsPr = prs.find(p => p.id === 'pr_most_steps');
    if (stepsPr && (log.steps || 0) > stepsPr.value) {
      brokenPr = {
        ...stepsPr,
        value: log.steps,
        displayValue: log.steps.toLocaleString(),
        dateAchieved: log.date,
        previousValue: stepsPr.value,
      };
      prs[prs.indexOf(stepsPr)] = brokenPr;
    }

    if (brokenPr) {
      setNewPersonalRecord(brokenPr);
      setPersonalRecords(prs);
      await repository.savePersonalRecords(prs);
    }
  };

  // Internal log updater that enforces derived XP, triggers level-up, achievements, and PRs
  const saveAndSyncLog = async (updatedLogPartial: Partial<DailyLog>) => {
    if (isDateFuture(selectedDate)) {
      return;
    }

    const previousLog = currentLog;
    const previousCorePerf = previousLog.corePerformancePercent;
    const previousTotalXp = previousLog.totalXp;
    const previousLevel = levelInfo.currentLevel;

    const mergedLog: DailyLog = {
      ...previousLog,
      ...updatedLogPartial,
      updatedAt: new Date().toISOString(),
    };

    // Strict derived Core Performance & XP calculation
    const derived = calculateDailyMetrics(mergedLog, profile.conqueredThresholdPercent);
    mergedLog.corePointsEarned = derived.corePointsEarned;
    mergedLog.corePointsAvailable = derived.corePointsAvailable;
    mergedLog.corePerformancePercent = derived.corePerformancePercent;
    mergedLog.baseXp = derived.baseXp;
    mergedLog.bonusXp = derived.bonusXp;
    mergedLog.totalXp = derived.totalXp;
    mergedLog.dailyRank = derived.dailyRank;
    mergedLog.isConqueredDay = derived.isConqueredDay;
    mergedLog.isPerfectDay = derived.isPerfectDay;

    // Update allLogs in state & storage
    const newLogs = [...allLogs];
    const index = newLogs.findIndex(l => l.date === mergedLog.date);
    if (index >= 0) {
      newLogs[index] = mergedLog;
    } else {
      newLogs.push(mergedLog);
    }
    setAllLogs(newLogs);
    await repository.saveDailyLog(mergedLog);

    // Sound effects
    if (mergedLog.totalXp > previousTotalXp) {
      if (profile.soundEffects) soundEngine.playCheck();
    } else if (mergedLog.totalXp < previousTotalXp) {
      if (profile.soundEffects) soundEngine.playUncheck();
    }

    // Celebration: Perfect Day 💎
    if (previousCorePerf < 100 && mergedLog.isPerfectDay) {
      if (profile.soundEffects) soundEngine.playDayConquered();
      try {
        confetti({
          particleCount: 100,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#22C55E', '#38E54D', '#38BDF8', '#F59E0B'],
        });
      } catch {}
    } 
    // Celebration: Day Conquered (85%+)
    else if (previousCorePerf < profile.conqueredThresholdPercent && mergedLog.isConqueredDay) {
      if (profile.soundEffects) soundEngine.playDayConquered();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#22C55E', '#10B981', '#38E54D'],
        });
      } catch {}
    }

    // Level up check
    const newTotalCumulative = newLogs.reduce((acc, l) => acc + l.totalXp, 0);
    const newLevelInfo = calculateLevel(newTotalCumulative);
    if (newLevelInfo.currentLevel > previousLevel) {
      if (profile.soundEffects) soundEngine.playLevelUp();
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#22C55E', '#F59E0B', '#38BDF8', '#6366F1'],
        });
      } catch {}
      setLevelUpModalData({
        oldLevel: previousLevel,
        newLevel: newLevelInfo.currentLevel,
        title: newLevelInfo.currentTitle,
      });
    }

    // Streaks and achievements check
    const streaks = calculateStreaks(newLogs, activeTodayDate, profile.conqueredThresholdPercent);
    const updatedAchievements = evaluateAchievements(
      achievements,
      newLogs,
      weightEntries,
      streaks,
      newLevelInfo.currentLevel,
      profile.lifetimeBaselineWeight,
      currentArc.goalWeight,
      profile.weightUnit || 'lb',
      profile.bodyMode || 'lose'
    );

    const justUnlocked = updatedAchievements.find(
      a => a.unlockedAt && !achievements.find(old => old.id === a.id)?.unlockedAt
    );

    if (justUnlocked) {
      setRecentAchievement(justUnlocked);
      setAchievements(updatedAchievements);
      await repository.saveAchievements(updatedAchievements);
    }

    // Personal Records check
    await checkPersonalRecords(mergedLog, streaks.currentStreak);
  };

  const toggleBooleanQuest = async (questId: string) => {
    const currentCompleted = currentLog.completedQuestIds;
    const isCompleted = currentCompleted.includes(questId);
    const updatedQuestIds = isCompleted
      ? currentCompleted.filter(id => id !== questId)
      : [...currentCompleted, questId];

    // If previously marked N/A, unmark N/A
    const currentNa = currentLog.naQuestIds || [];
    const updatedNa = currentNa.filter(id => id !== questId);

    await saveAndSyncLog({ completedQuestIds: updatedQuestIds, naQuestIds: updatedNa });
  };

  const toggleQuestNA = async (questId: string) => {
    const currentNa = currentLog.naQuestIds || [];
    const isNA = currentNa.includes(questId);
    const updatedNa = isNA
      ? currentNa.filter(id => id !== questId)
      : [...currentNa, questId];

    // If marked N/A, remove from completed
    const currentCompleted = currentLog.completedQuestIds;
    const updatedCompleted = currentCompleted.filter(id => id !== questId);

    await saveAndSyncLog({ naQuestIds: updatedNa, completedQuestIds: updatedCompleted });
  };

  const toggleEnergyDrink = async () => {
    await saveAndSyncLog({ energyDrinkConsumed: !currentLog.energyDrinkConsumed });
  };

  const setDailyFocus = async (rating: number) => {
    const newRating = currentLog.focusRating === rating ? 0 : rating;
    await saveAndSyncLog({ focusRating: newRating });
  };

  const setSteps = async (steps: number) => {
    const validSteps = Math.max(0, Math.floor(isNaN(steps) ? 0 : steps));
    await saveAndSyncLog({ steps: validSteps });
  };

  const setSleep = async (hours: number) => {
    const validSleep = Math.max(0, Math.min(24, Number((isNaN(hours) ? 0 : hours).toFixed(1))));
    await saveAndSyncLog({ sleepHours: validSleep });
  };

  const toggleSideQuest = async (sideQuestId: string) => {
    const currentCompleted = currentLog.completedSideQuestIds;
    const isCompleted = currentCompleted.includes(sideQuestId);
    const updatedSideQuestIds = isCompleted
      ? currentCompleted.filter(id => id !== sideQuestId)
      : [...currentCompleted, sideQuestId];

    await saveAndSyncLog({ completedSideQuestIds: updatedSideQuestIds });
  };

  const toggleBonusObjective = async () => {
    const isCompleted = currentLog.completedBonusObjectiveId === todayBonusObjective.id;
    await saveAndSyncLog({
      completedBonusObjectiveId: isCompleted ? null : todayBonusObjective.id,
    });
  };

  const addWeightEntry = async (weight: number, date: string, note?: string) => {
    const formattedWeight = Number(weight.toFixed(1));
    const newEntry: WeightEntry = {
      id: 'weight-' + Date.now(),
      date,
      weight: formattedWeight,
      note,
      createdAt: new Date().toISOString(),
    };
    await repository.saveWeightEntry(newEntry);
    const entries = await repository.getWeightEntries();
    setWeightEntries(entries);

    // If lifetime baseline is not set yet, this first weigh-in becomes the lifetime baseline
    let currentProfile = profile;
    if (currentProfile.lifetimeBaselineWeight <= 0) {
      currentProfile = {
        ...currentProfile,
        lifetimeBaselineWeight: formattedWeight,
        lifetimeBaselineDate: date,
        trackWeight: true,
      };
      setProfile(currentProfile);
      await repository.saveProfile(currentProfile);
    }

    // If arc starting weight is not set yet, update arc
    if (currentArc.startingWeight <= 0) {
      const updatedArc = {
        ...currentArc,
        startingWeight: formattedWeight,
      };
      setCurrentArc(updatedArc);
      await repository.saveCurrentArc(updatedArc);
    }

    // Check Lowest Recorded Weight Personal Record
    const prs = [...personalRecords];
    const lowestPr = prs.find(p => p.id === 'pr_lowest_weight');
    if (lowestPr && (lowestPr.value === 0 || formattedWeight < lowestPr.value)) {
      const brokenPr: PersonalRecord = {
        ...lowestPr,
        value: formattedWeight,
        displayValue: `${formattedWeight} ${currentProfile.weightUnit || 'lb'}`,
        dateAchieved: date,
        previousValue: lowestPr.value > 0 ? lowestPr.value : undefined,
      };
      prs[prs.indexOf(lowestPr)] = brokenPr;
      setNewPersonalRecord(brokenPr);
      setPersonalRecords(prs);
      await repository.savePersonalRecords(prs);
    }

    // Re-evaluate achievements
    const updatedAchievements = evaluateAchievements(
      achievements,
      allLogs,
      entries,
      streakStats,
      levelInfo.currentLevel,
      currentProfile.lifetimeBaselineWeight,
      currentArc.goalWeight,
      currentProfile.weightUnit || 'lb',
      currentProfile.bodyMode || 'lose'
    );
    const justUnlocked = updatedAchievements.find(
      a => a.unlockedAt && !achievements.find(old => old.id === a.id)?.unlockedAt
    );
    if (justUnlocked) {
      setRecentAchievement(justUnlocked);
      setAchievements(updatedAchievements);
      await repository.saveAchievements(updatedAchievements);
    }
  };

  const deleteWeightEntry = async (id: string) => {
    await repository.deleteWeightEntry(id);
    const entries = await repository.getWeightEntries();
    setWeightEntries(entries);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const updated = { ...profile, ...updates };
    setProfile(updated);
    await repository.saveProfile(updated);
  };

  const updateArc = async (updates: Partial<Arc>) => {
    const updated = { ...currentArc, ...updates };
    setCurrentArc(updated);
    await repository.saveCurrentArc(updated);
  };

  const completeCurrentArc = async (): Promise<ArcRecap> => {
    const recap: ArcRecap = {
      arcName: currentArc.name,
      totalDays: getDaysDifference(currentArc.startDate, currentArc.endDate),
      startingLevel: 1,
      endingLevel: levelInfo.currentLevel,
      totalXp: totalCumulativeXp,
      avgCorePerformance: 88,
      daysConquered: streakStats.totalSuccessfulDays,
      perfectDays: streakStats.totalPerfectDays,
      longestStreak: streakStats.longestStreak,
      startingWeight: currentArc.startingWeight,
      endingWeight: weightStats.currentWeight,
      weightLost: weightStats.weightLostArc,
      totalSteps: allLogs.reduce((acc, l) => acc + (l.steps || 0), 0),
      gymSessions: allLogs.filter(l => l.completedQuestIds.includes('hit_the_gym')).length,
      achievementsUnlocked: achievements.filter(a => !!a.unlockedAt).length,
      strongestStat: 'Fitness',
      finalGrade: 'S',
    };

    const updatedArc = { ...currentArc, isCompleted: true, completedAt: new Date().toISOString(), recap };
    setCurrentArc(updatedArc);
    await repository.saveCurrentArc(updatedArc);
    await repository.saveArcRecap(recap);
    setArcRecaps(prev => [...prev, recap]);
    return recap;
  };

  const startNewArc = async (newArc: Arc) => {
    setCurrentArc(newArc);
    await repository.saveCurrentArc(newArc);
  };

  const resetAllData = async () => {
    await repository.clearAllData();
    const defaultP = await repository.getProfile();
    const defaultArc = await repository.getCurrentArc();
    const defaultW = await repository.getWeightEntries();
    const defaultA = await repository.getAchievements();
    const defaultPR = await repository.getPersonalRecords();
    setProfile(defaultP);
    setCurrentArc(defaultArc);
    setAllLogs([]);
    setWeightEntries(defaultW);
    setAchievements(defaultA);
    setPersonalRecords(defaultPR);
    setArcRecaps([]);
    setSelectedDate(activeTodayDate);
  };

  const exportData = async () => {
    return repository.exportData();
  };

  const importData = async (json: string) => {
    const success = await repository.importData(json);
    if (success) {
      const p = await repository.getProfile();
      const arc = await repository.getCurrentArc();
      const recaps = await repository.getArcRecaps();
      const logs = await repository.getAllDailyLogs();
      const weights = await repository.getWeightEntries();
      const ach = await repository.getAchievements();
      const prs = await repository.getPersonalRecords();
      setProfile(p);
      setCurrentArc(arc);
      setArcRecaps(recaps);
      setAllLogs(logs);
      setWeightEntries(weights);
      setAchievements(ach);
      setPersonalRecords(prs);
    }
    return success;
  };

  const dismissLevelUpModal = () => {
    setLevelUpModalData(null);
  };

  const dismissAchievement = () => {
    setRecentAchievement(null);
  };

  const dismissPersonalRecord = () => {
    setNewPersonalRecord(null);
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        currentArc,
        activeTodayDate,
        selectedDate,
        setSelectedDate,
        currentLog,
        allLogs,
        weightEntries,
        achievements,
        personalRecords,
        arcRecaps,
        dayNumber,
        daysSinceStart,
        daysRemaining,
        todayXp,
        todayCorePerformance,
        selectedDateXp,
        totalCumulativeXp,
        levelInfo,
        statusSnapshot,
        characterStats,
        streakStats,
        weightStats,
        todayBonusObjective,
        toggleBooleanQuest,
        toggleQuestNA,
        setDailyFocus,
        setSteps,
        setSleep,
        toggleEnergyDrink,
        toggleSideQuest,
        toggleBonusObjective,
        addWeightEntry,
        deleteWeightEntry,
        updateProfile,
        updateArc,
        completeCurrentArc,
        startNewArc,
        resetAllData,
        exportData,
        importData,
        levelUpModalData,
        dismissLevelUpModal,
        recentAchievement,
        dismissAchievement,
        newPersonalRecord,
        dismissPersonalRecord,
        isDateFuture,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
