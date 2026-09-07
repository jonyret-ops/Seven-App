export type QuestType = 'boolean' | 'numeric' | 'focus';

export type CharacterStatCategory = 'faith' | 'fitness' | 'discipline' | 'nutrition' | 'focus' | 'character';

export type QuestTimePeriod = 'morning' | 'afternoon' | 'evening' | 'all_day';

export type QuestCategory = 
  | 'nutrition' 
  | 'faith' 
  | 'fitness' 
  | 'discipline' 
  | 'focus' 
  | 'routine' 
  | 'hygiene' 
  | 'recovery' 
  | 'mindset';

export interface QuestDefinition {
  id: string;
  order: number;
  title: string;
  type: QuestType;
  baseXp: number; // For Energy Drink, 0. For boolean, points.
  description?: string;
  iconName?: string;
  category: QuestCategory;
  timePeriod?: QuestTimePeriod;
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
  | 'FALLING OFF'
  | 'LACKING'
  | 'GETTING THERE'
  | 'SOLID'
  | 'DIALED IN'
  | 'LOCKED IN'
  | 'UNSTOPPABLE'
  | 'BUILDING STATUS';

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

export type DayOfWeek = 
  | 'monday' 
  | 'tuesday' 
  | 'wednesday' 
  | 'thursday' 
  | 'friday' 
  | 'saturday' 
  | 'sunday';

export type AvatarId = 'disciplined' | 'athlete' | 'stoic';

export interface UserProfile {
  name: string;
  avatarId: AvatarId; // 'disciplined' | 'athlete' | 'stoic'
  weeklySchedule: Record<DayOfWeek, 'active' | 'rest'>;
  restDayOverrides: string[]; // Specific calendar dates (YYYY-MM-DD) marked as Rest Days
  trainAnywayDates: string[]; // Specific calendar dates (YYYY-MM-DD) where user chose "Train Anyway" on Rest Day
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

// Body Measurements System (Part XXXVI)
export type BodyMeasurementType = 
  | 'waist'
  | 'chest'
  | 'left_arm'
  | 'right_arm'
  | 'hips'
  | 'left_thigh'
  | 'right_thigh'
  | 'neck';

export interface BodyMeasurementEntry {
  id: string;
  date: string; // YYYY-MM-DD
  measurementType: BodyMeasurementType;
  value: number;
  unit: 'in' | 'cm';
  note?: string;
  createdAt: string;
}

export interface BodyMeasurementSummary {
  type: BodyMeasurementType;
  label: string;
  latestValue: number | null;
  baselineValue: number | null;
  change: number | null;
  unit: 'in' | 'cm';
  latestDate: string;
}

// Nutrition & Macro System (Part XLI - XLV)
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealLog {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  mealType: MealType;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdAt: string;
}

export interface NutritionSettings {
  id: string; // 'current'
  caloriesTarget?: number;
  proteinTarget?: number;
  carbsTarget?: number;
  fatTarget?: number;
  waterTargetOz?: number;
}

export interface DailyMacroSummary {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  caloriesTarget?: number;
  proteinTarget?: number;
  carbsTarget?: number;
  fatTarget?: number;
  proteinPercent: number;
  carbsPercent: number;
  fatPercent: number;
}

// Weekly Goal System (Part XXV - XXIX)
export type WeeklyGoalType = 
  | 'gym_week'
  | '70k_week'
  | 'diamond_week'
  | 'seven_strong'
  | 'consistency'
  | 'first_things_first'
  | 'bookends'
  | 'locked_in_week'
  | 'focus_week'
  | 'side_hustle'
  | 'protein_week';

export interface WeeklyGoalDefinition {
  id: WeeklyGoalType;
  title: string;
  subtitle: string;
  description: string;
  xpReward: number;
  targetValue: number;
  unit: string;
  icon: string;
  requiresConfig?: 'protein' | 'gym' | 'prayer';
}

export interface WeeklyGoalInstance {
  id: string;
  weekNumber: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  goalType: WeeklyGoalType;
  currentProgress: number;
  targetValue: number;
  isCompleted: boolean;
  isRewarded: boolean;
  completedAt?: string;
}

// Today's Focus Intentions (Part XVI & visual reference)
export interface DailyFocusIntention {
  id: string;
  date: string;
  text: string;
  isCompleted: boolean;
  order: number;
}

// Multi-category Arc Goal (Part XXXI - XXXII)
export interface ArcGoal {
  id: string;
  arcId: string;
  category: 'faith' | 'fitness' | 'discipline' | 'nutrition' | 'focus' | 'character' | 'body' | 'personal';
  title: string;
  targetType: 'value' | 'count' | 'streak' | 'measurement' | 'manual';
  currentValue: number;
  targetValue: number;
  unit?: string;
  isCompleted: boolean;
}


