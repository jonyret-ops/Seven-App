import confetti from 'canvas-confetti';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_ARC,
  DEFAULT_PROFILE,
  DEFAULT_WEEKLY_SCHEDULE,
  INITIAL_PERSONAL_RECORDS,
  DEFAULT_NUTRITION_SETTINGS,
  WEEKLY_GOALS_POOL,
  getWeeklyGoalForCycle,
  getDailyBonusObjective
} from '../constants';
import {
  addDays,
  calculateBodyMeasurementSummaries,
  calculateCharacterStats,
  calculateDailyMacroSummary,
  calculateDailyMetrics,
  calculateLevel,
  calculateStatusSnapshot,
  calculateStreaks,
  calculateWeeklyGoalProgress,
  calculateWeightStats,
  countEligibleActiveDays,
  evaluateAchievements,
  formatDate,
  getDaysDifference,
  isRestDay
} from '../lib/calculations';
import { soundEngine } from '../lib/sound';
import { repository } from '../lib/storage';
import { db } from '../lib/db';
import {
  Achievement,
  Arc,
  ArcRecap,
  AvatarId,
  BodyMeasurementEntry,
  BodyMeasurementSummary,
  BodyMeasurementType,
  BonusObjectiveDefinition,
  CharacterStats,
  DailyFocusIntention,
  DailyLog,
  DailyMacroSummary,
  DayOfWeek,
  MealLog,
  NutritionSettings,
  PersonalRecord,
  StatusSnapshot,
  StreakStats,
  UserProfile,
  WeightEntry,
  WeightStats,
  WeeklyGoalDefinition,
  WeeklyGoalInstance,
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
  todayLog: DailyLog;
  allLogs: DailyLog[];
  weightEntries: WeightEntry[];
  achievements: Achievement[];
  personalRecords: PersonalRecord[];
  arcRecaps: ArcRecap[];

  // Body Measurements (Part XXXVI - XXXVIII)
  bodyMeasurements: BodyMeasurementEntry[];
  bodyMeasurementSummaries: BodyMeasurementSummary[];
  addBodyMeasurement: (type: BodyMeasurementType, value: number, unit?: 'in' | 'cm', date?: string, note?: string) => Promise<void>;
  deleteBodyMeasurement: (id: string) => Promise<void>;

  // Nutrition & Macros (Part XLI - XLV)
  mealLogs: MealLog[];
  todayMealLogs: MealLog[];
  selectedDateMealLogs: MealLog[];
  nutritionSettings: NutritionSettings;
  todayMacros: DailyMacroSummary;
  selectedDateMacros: DailyMacroSummary;
  addMealLog: (meal: Omit<MealLog, 'id' | 'createdAt'>) => Promise<void>;
  deleteMealLog: (id: string) => Promise<void>;
  updateNutritionSettings: (settings: Partial<NutritionSettings>) => Promise<void>;

  // Weekly Goals (Part XXV - XXVIII)
  activeWeeklyGoal: WeeklyGoalDefinition;
  weeklyGoalProgress: number;
  weeklyGoalTarget: number;
  weeklyGoalPercent: number;
  isWeeklyGoalCompleted: boolean;

  // Daily Focus Intentions
  dailyFocusIntentions: DailyFocusIntention[];
  addDailyFocusIntention: (text: string) => Promise<void>;
  toggleDailyFocusIntention: (id: string) => Promise<void>;
  deleteDailyFocusIntention: (id: string) => Promise<void>;
  
  // Progress calculations
  dayNumber: number;
  daysSinceStart: number;
  daysRemaining: number;
  eligibleActiveDaysCount: number;
  isTodayRestDay: boolean;
  isSelectedDateRestDay: boolean;
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
  toggleTrainAnyway: (targetDate?: string) => Promise<void>;
  toggleDateRestOverride: (targetDate?: string) => Promise<void>;
  setWeeklyScheduleDay: (day: DayOfWeek, status: 'active' | 'rest') => Promise<void>;
  setAvatarId: (avatarId: AvatarId) => Promise<void>;

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
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurementEntry[]>([]);
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [nutritionSettings, setNutritionSettings] = useState<NutritionSettings>(DEFAULT_NUTRITION_SETTINGS);
  const [dailyFocusIntentions, setDailyFocusIntentions] = useState<DailyFocusIntention[]>([]);
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
      // One-time initialization wipe to ensure clean slate from zero (Level 1, 0 XP, 0 Streaks, no demo/mock logs)
      if (localStorage.getItem('seven_clean_slate_final_v1') !== 'true') {
        await repository.clearAllData();
        localStorage.setItem('seven_clean_slate_final_v1', 'true');
      }

      const storedProfile = await repository.getProfile();
      let storedArc = await repository.getCurrentArc();
      const storedRecaps = await repository.getArcRecaps();
      const storedLogs = await repository.getAllDailyLogs();
      const storedWeights = await repository.getWeightEntries();
      const storedBody = await repository.getBodyMeasurements();
      const storedMeals = await repository.getAllMealLogs();
      const storedNutrition = await repository.getNutritionSettings();
      const storedAchievements = await repository.getAchievements();
      const storedPRs = await repository.getPersonalRecords();

      // Ensure arc has valid dates if newly initialized
      if (!storedArc.startDate || !storedArc.endDate) {
        const start = storedArc.startDate || activeTodayDate;
        storedArc = {
          ...storedArc,
          startDate: start,
          endDate: storedArc.endDate || addDays(start, 90),
        };
        await repository.saveCurrentArc(storedArc);
      }

      setProfile(storedProfile);
      setCurrentArc(storedArc);
      setArcRecaps(storedRecaps);
      setAllLogs(storedLogs);
      setWeightEntries(storedWeights);
      setBodyMeasurements(storedBody);
      setMealLogs(storedMeals);
      setNutritionSettings(storedNutrition);
      setAchievements(storedAchievements);
      setPersonalRecords(storedPRs);
    }
    loadData();
  }, [activeTodayDate]);

  // Load focus intentions on selectedDate change
  useEffect(() => {
    repository.getDailyFocusIntentions(selectedDate).then(setDailyFocusIntentions);
  }, [selectedDate]);

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
    return calculateStreaks(Array.from(map.values()), activeTodayDate, profile.conqueredThresholdPercent, profile);
  }, [allLogs, currentLog, activeTodayDate, profile]);

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

  // Body Measurements Derived (Part XXXVI - XXXVIII)
  const bodyMeasurementSummaries = useMemo(() => {
    return calculateBodyMeasurementSummaries(bodyMeasurements);
  }, [bodyMeasurements]);

  // Nutrition Derived (Part XLI - XLV)
  const todayMealLogs = useMemo(() => {
    return mealLogs.filter(m => m.date === activeTodayDate);
  }, [mealLogs, activeTodayDate]);

  const selectedDateMealLogs = useMemo(() => {
    return mealLogs.filter(m => m.date === selectedDate);
  }, [mealLogs, selectedDate]);

  const todayMacros = useMemo(() => {
    return calculateDailyMacroSummary(mealLogs, activeTodayDate, nutritionSettings);
  }, [mealLogs, activeTodayDate, nutritionSettings]);

  const selectedDateMacros = useMemo(() => {
    return calculateDailyMacroSummary(mealLogs, selectedDate, nutritionSettings);
  }, [mealLogs, selectedDate, nutritionSettings]);

  // Weekly Goal Derived (Part XXV - XXVIII)
  const cycleStartDate = useMemo(() => {
    return addDays(currentArc.startDate || activeTodayDate, Math.floor(Math.max(0, daysSinceStart) / 7) * 7);
  }, [currentArc.startDate, activeTodayDate, daysSinceStart]);

  const cycleEndDate = useMemo(() => addDays(cycleStartDate, 6), [cycleStartDate]);

  const activeWeeklyGoal = useMemo(() => {
    return getWeeklyGoalForCycle(cycleStartDate, WEEKLY_GOALS_POOL);
  }, [cycleStartDate]);

  const cycleLogs = useMemo(() => {
    return allLogs.filter(l => l.date >= cycleStartDate && l.date <= cycleEndDate);
  }, [allLogs, cycleStartDate, cycleEndDate]);

  const cycleMealLogs = useMemo(() => {
    return mealLogs.filter(m => m.date >= cycleStartDate && m.date <= cycleEndDate);
  }, [mealLogs, cycleStartDate, cycleEndDate]);

  const weeklyGoalProgress = useMemo(() => {
    return calculateWeeklyGoalProgress(activeWeeklyGoal, cycleLogs, cycleMealLogs, nutritionSettings);
  }, [activeWeeklyGoal, cycleLogs, cycleMealLogs, nutritionSettings]);

  const weeklyGoalTarget = activeWeeklyGoal.targetValue;
  const weeklyGoalPercent = Math.min(100, Math.round((weeklyGoalProgress / weeklyGoalTarget) * 100));
  const isWeeklyGoalCompleted = weeklyGoalProgress >= weeklyGoalTarget;

  // Rest Day calculations
  const isTodayRestDay = useMemo(() => {
    return isRestDay(activeTodayDate, profile);
  }, [activeTodayDate, profile]);

  const isSelectedDateRestDay = useMemo(() => {
    return isRestDay(selectedDate, profile);
  }, [selectedDate, profile]);

  const eligibleActiveDaysCount = useMemo(() => {
    return countEligibleActiveDays(arcStartDate, activeTodayDate, profile);
  }, [arcStartDate, activeTodayDate, profile]);

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
          colors: ['#12324A', '#4A90C2', '#DCEAF4', '#0D1B2A'],
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
          colors: ['#12324A', '#4A90C2', '#DCEAF4'],
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
          colors: ['#12324A', '#4A90C2', '#DCEAF4', '#0D1B2A'],
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
    const validSleep = Math.max(0, Math.min(24, isNaN(hours) ? 0 : Number(Number(hours).toFixed(2))));
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

  // Body Measurement Actions (Part XXXVI - XXXVIII)
  const addBodyMeasurement = async (
    type: BodyMeasurementType,
    value: number,
    unit: 'in' | 'cm' = 'in',
    date = activeTodayDate,
    note?: string
  ) => {
    const newEntry: BodyMeasurementEntry = {
      id: `meas_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      date,
      measurementType: type,
      value,
      unit,
      note,
      createdAt: new Date().toISOString(),
    };
    await repository.saveBodyMeasurement(newEntry);
    setBodyMeasurements(prev => [...prev.filter(m => !(m.date === date && m.measurementType === type)), newEntry]);
  };

  const deleteBodyMeasurement = async (id: string) => {
    await repository.deleteBodyMeasurement(id);
    setBodyMeasurements(prev => prev.filter(m => m.id !== id));
  };

  // Meal & Nutrition Actions (Part XLI - XLV)
  const addMealLog = async (meal: Omit<MealLog, 'id' | 'createdAt'>) => {
    const newMeal: MealLog = {
      ...meal,
      id: `meal_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    await repository.saveMealLog(newMeal);
    setMealLogs(prev => [...prev, newMeal]);
  };

  const deleteMealLog = async (id: string) => {
    await repository.deleteMealLog(id);
    setMealLogs(prev => prev.filter(m => m.id !== id));
  };

  const updateNutritionSettings = async (updates: Partial<NutritionSettings>) => {
    const merged = { ...nutritionSettings, ...updates };
    setNutritionSettings(merged);
    await repository.saveNutritionSettings(merged);
  };

  // Daily Focus Intentions Actions
  const addDailyFocusIntention = async (text: string) => {
    if (!text.trim()) return;
    const newIntention: DailyFocusIntention = {
      id: `focus_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      date: selectedDate,
      text: text.trim(),
      isCompleted: false,
      order: dailyFocusIntentions.length,
    };
    await repository.saveDailyFocusIntention(newIntention);
    setDailyFocusIntentions(prev => [...prev, newIntention]);
  };

  const toggleDailyFocusIntention = async (id: string) => {
    const item = dailyFocusIntentions.find(i => i.id === id);
    if (!item) return;
    const updated = { ...item, isCompleted: !item.isCompleted };
    await repository.saveDailyFocusIntention(updated);
    setDailyFocusIntentions(prev => prev.map(i => i.id === id ? updated : i));
  };

  const deleteDailyFocusIntention = async (id: string) => {
    await db.dailyFocusIntentions.delete(id);
    setDailyFocusIntentions(prev => prev.filter(i => i.id !== id));
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
    setBodyMeasurements([]);
    setMealLogs([]);
    setNutritionSettings(DEFAULT_NUTRITION_SETTINGS);
    setDailyFocusIntentions([]);
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
      const body = await repository.getBodyMeasurements();
      const meals = await repository.getAllMealLogs();
      const nutrition = await repository.getNutritionSettings();
      const ach = await repository.getAchievements();
      const prs = await repository.getPersonalRecords();
      setProfile(p);
      setCurrentArc(arc);
      setArcRecaps(recaps);
      setAllLogs(logs);
      setWeightEntries(weights);
      setBodyMeasurements(body);
      setMealLogs(meals);
      setNutritionSettings(nutrition);
      setAchievements(ach);
      setPersonalRecords(prs);
    }
    return success;
  };

  const toggleTrainAnyway = async (targetDate?: string) => {
    const date = targetDate || selectedDate;
    const current = profile.trainAnywayDates || [];
    let updated: string[];
    if (current.includes(date)) {
      updated = current.filter(d => d !== date);
    } else {
      updated = [...current, date];
    }
    await updateProfile({ trainAnywayDates: updated });
  };

  const toggleDateRestOverride = async (targetDate?: string) => {
    const date = targetDate || selectedDate;
    const current = profile.restDayOverrides || [];
    let updated: string[];
    if (current.includes(date)) {
      updated = current.filter(d => d !== date);
    } else {
      updated = [...current, date];
    }
    await updateProfile({ restDayOverrides: updated });
  };

  const setWeeklyScheduleDay = async (day: DayOfWeek, status: 'active' | 'rest') => {
    const updatedSchedule = {
      ...(profile.weeklySchedule || DEFAULT_WEEKLY_SCHEDULE),
      [day]: status,
    };
    await updateProfile({ weeklySchedule: updatedSchedule });
  };

  const setAvatarId = async (avatarId: AvatarId) => {
    await updateProfile({ avatarId });
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
        todayLog,
        allLogs,
        weightEntries,
        achievements,
        personalRecords,
        arcRecaps,
        bodyMeasurements,
        bodyMeasurementSummaries,
        addBodyMeasurement,
        deleteBodyMeasurement,
        mealLogs,
        todayMealLogs,
        selectedDateMealLogs,
        nutritionSettings,
        todayMacros,
        selectedDateMacros,
        addMealLog,
        deleteMealLog,
        updateNutritionSettings,
        activeWeeklyGoal,
        weeklyGoalProgress,
        weeklyGoalTarget,
        weeklyGoalPercent,
        isWeeklyGoalCompleted,
        dailyFocusIntentions,
        addDailyFocusIntention,
        toggleDailyFocusIntention,
        deleteDailyFocusIntention,
        dayNumber,
        daysSinceStart,
        daysRemaining,
        eligibleActiveDaysCount,
        isTodayRestDay,
        isSelectedDateRestDay,
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
        toggleTrainAnyway,
        toggleDateRestOverride,
        setWeeklyScheduleDay,
        setAvatarId,
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
