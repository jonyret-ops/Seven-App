export type QuestType = 'boolean' | 'numeric' | 'focus';

export type CharacterStatCategory = 'faith' | 'fitness' | 'discipline' | 'nutrition' | 'focus' | 'character';

export interface QuestDefinition {
  id: string;
  order: number;
  title: string;
  type: QuestType;
  baseXp: number; // For Energy Drink, 0. For boolean, points.
  description?: string;
  iconName?: string;
  category: 'routine' | 'nutrition' | 'fitness' | 'mindset' | 'hygiene' | 'recovery' | 'faith';
  allowNA?: boolean; // Can be marked Not Applicable (e.g. Go to School/Work on weekends)
  statTarget?: CharacterStatCategory;
  isOptional?: boolean;
}

export interface SideQuestDefinition {
  id: string;
  order: number;
  title: string;
  xp: number;
  description: string;
  iconName?: string;
  statTarget?: CharacterStatCategory;
}

export interface BonusObjectiveDefinition {
  id: string;
  title: string;
  description: string;
  quote?: string;
  xp: number; // e.g. 15 or 10
  target?: number; // e.g. 15000 for The Extra Mile
  unit?: string;
  iconName: string;
  statTarget?: CharacterStatCategory;
}

export type DailyRank = 
  | 'ROUGH DAY'
  | 'KEPT MOVING'
  | 'STRONG DAY'
  | 'DAY CONQUERED'
  | 'PERFECT DAY 💎';

export type StatusTitle =
  | 'STARTING OUT'
  | 'BUILDING MOMENTUM'
  | 'CONSISTENT'
  | 'DISCIPLINED'
  | 'LOCKED IN'
  | 'UNSTOPPABLE';

export interface DailyLog {
  date: string; // YYYY-MM-DD
  completedQuestIds: string[];
  naQuestIds: string[]; // Quests marked N/A (removed from denominator)
  completedSideQuestIds: string[];
  completedBonusObjectiveId?: string | null;
  steps: number; // actual step count
  sleepHours: number; // actual hours
  focusRating: number; // 0 (unselected) or 1..5
  energyDrinkConsumed: boolean; // tracked, awards 0 XP
  corePointsEarned: number;
  corePointsAvailable: number;
  corePerformancePercent: number; // (corePointsEarned / corePointsAvailable) * 100
  baseXp: number;
  bonusXp: number;
  totalXp: number;
  dailyRank: DailyRank;
  isConqueredDay: boolean; // corePerformancePercent >= 85% (or configured threshold)
  isPerfectDay: boolean; // corePerformancePercent === 100% of applicable core quests
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StatusSnapshot {
  currentStatus: StatusTitle;
  sevenDayCorePerformance: number; // 0-100 based on last 7 completed days
  previousStatus: StatusTitle;
  statusProgress: number; // 0-100 toward next status tier
  completedDaysCount: number;
}

export interface CharacterStats {
  faith: number; // 0-100
  fitness: number; // 0-100
  discipline: number; // 0-100
  nutrition: number; // 0-100
  focus: number; // 0-100
  character: number; // 0-100
}

export interface PersonalRecord {
  id: string;
  title: string;
  value: number;
  displayValue: string;
  unit: string;
  dateAchieved: string;
  previousValue?: number;
}

export interface WeightEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number; // in lbs
  note?: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'consistency' | 'xp' | 'fitness' | 'body' | 'faith' | 'discipline' | 'focus' | 'character' | 'comeback' | 'arc' | 'secret';
  icon: string;
  tier?: 'bronze' | 'silver' | 'gold' | 'diamond';
  tierLevel?: number;
  progress?: number;
  target?: number;
  isSecret?: boolean;
  xpReward?: number;
  unlockedAt?: string | null;
}

export interface LevelDefinition {
  level: number;
  title: string;
  xpRequired: number; // Cumulative total XP required to reach this level
}

export interface Arc {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startingWeight: number; // e.g. 242.2
  goalWeight: number; // e.g. 220.0
  stepTarget: number; // e.g. 10000
  dailyXpGoal: number; // e.g. 100
  successThresholdPercent: number; // e.g. 85
  isActive: boolean;
  isCompleted: boolean;
  completedAt?: string;
  recap?: ArcRecap;
}

export interface ArcRecap {
  arcName: string;
  totalDays: number;
  startingLevel: number;
  endingLevel: number;
  totalXp: number;
  avgCorePerformance: number;
  daysConquered: number;
  perfectDays: number;
  longestStreak: number;
  startingWeight: number;
  endingWeight: number;
  weightLost: number;
  totalSteps: number;
  gymSessions: number;
  achievementsUnlocked: number;
  strongestStat: string;
  finalGrade: 'S' | 'A' | 'B' | 'C' | 'D';
}

export interface UserProfile {
  name: string;
  currentArcId: string;
  lifetimeBaselineDate: string; // e.g. '2026-09-06' or ''
  lifetimeBaselineWeight: number; // 0 if not set, or initial weigh-in
  trackWeight: boolean; // whether the user tracks body weight
  weightUnit: 'lb' | 'kg';
  bodyMode: 'lose' | 'maintain' | 'gain' | 'track';
  maintainToleranceLb: number; // default 3.0 lb
  conqueredThresholdPercent: number; // default 85
  soundEffects: boolean;
  hapticFeedback: boolean;
  memberSince: string;
  onboardingCompleted: boolean;
}

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  totalSuccessfulDays: number;
  totalPerfectDays: number;
  arcSuccessfulDays: number;
  arcPerfectDays: number;
}

export interface WeightStats {
  hasBaseline: boolean;
  lifetimeBaselineWeight: number;
  arcStartingWeight: number;
  currentWeight: number;
  weightLostLifetime: number;
  weightLostArc: number;
  weightRemainingToGoal: number;
  percentToGoal: number;
  changeSinceLast: number;
  latestWeighInDate: string;
  isGoalReached: boolean;
  unit: 'lb' | 'kg';
}

export interface WeeklyReport {
  weekNumber: number;
  startDate: string;
  endDate: string;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  gradeTitle: string;
  weeklyCorePerformance: number;
  totalXp: number;
  avgXp: number;
  successfulDays: number;
  perfectDays: number;
  gymSessions: number;
  avgSteps: number;
  avgSleep: number;
  avgFocus: number;
  sideQuestsCount: number;
  bonusObjectivesCount: number;
  achievementsUnlocked: number;
  strongestStat: string;
  needsWorkStat: string;
  weightChange?: number;
  comparisonVsLastWeek?: {
    xpDiffPercent: number;
    successfulDaysDiff: number;
    avgStepsDiff: number;
    avgSleepDiff: number;
  };
}

