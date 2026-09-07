import { 
  Achievement, 
  Arc, 
  AvatarId,
  BonusObjectiveDefinition, 
  DayOfWeek,
  LevelDefinition, 
  PersonalRecord, 
  QuestDefinition, 
  SideQuestDefinition, 
  UserProfile, 
  WeightEntry 
} from '../types';

export const DEFAULT_ARC: Arc = {
  id: 'arc-initial',
  name: 'Arc 1',
  startDate: '',
  endDate: '',
  startingWeight: 0,
  goalWeight: 0,
  stepTarget: 10000,
  dailyXpGoal: 100,
  successThresholdPercent: 85,
  isActive: true,
  isCompleted: false,
};

export const DEFAULT_WEEKLY_SCHEDULE: Record<DayOfWeek, 'active' | 'rest'> = {
  monday: 'active',
  tuesday: 'active',
  wednesday: 'active',
  thursday: 'active',
  friday: 'active',
  saturday: 'active',
  sunday: 'rest',
};

export const DAYS_OF_WEEK_LIST: { key: DayOfWeek; label: string; short: string }[] = [
  { key: 'monday', label: 'Monday', short: 'Mon' },
  { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { key: 'thursday', label: 'Thursday', short: 'Thu' },
  { key: 'friday', label: 'Friday', short: 'Fri' },
  { key: 'saturday', label: 'Saturday', short: 'Sat' },
  { key: 'sunday', label: 'Sunday', short: 'Sun' },
];

export const DEFAULT_PROFILE: UserProfile = {
  name: '',
  avatarId: 'disciplined',
  weeklySchedule: DEFAULT_WEEKLY_SCHEDULE,
  restDayOverrides: [],
  trainAnywayDates: [],
  currentArcId: 'arc-initial',
  lifetimeBaselineDate: '',
  lifetimeBaselineWeight: 0,
  trackWeight: false,
  weightUnit: 'lb',
  bodyMode: 'lose',
  maintainToleranceLb: 3.0,
  conqueredThresholdPercent: 85,
  soundEffects: true,
  hapticFeedback: true,
  memberSince: '',
  onboardingCompleted: false,
};

// Clean starting state for new user installations (starts from zero)
export const INITIAL_WEIGHT_ENTRIES: WeightEntry[] = [];

// Daily Core Quests in Exact Chronological Order (plus optional Bible Reading)
export const DAILY_QUESTS: QuestDefinition[] = [
  {
    id: 'morning_prayer',
    order: 1,
    title: 'Morning Prayer',
    type: 'boolean',
    baseXp: 15,
    category: 'faith',
    timePeriod: 'morning',
    statTarget: 'faith',
    description: 'Dedicate the start of the day in prayer and gratitude.',
  },
  {
    id: 'water_checkpoint_1',
    order: 2,
    title: 'Drink Water (Checkpoint 1)',
    type: 'boolean',
    baseXp: 2,
    category: 'nutrition',
    timePeriod: 'morning',
    statTarget: 'nutrition',
    description: 'First 16-20oz glass upon waking to rehydrate.',
  },
  {
    id: 'take_creatine',
    order: 3,
    title: 'Take Creatine',
    type: 'boolean',
    baseXp: 5,
    category: 'nutrition',
    timePeriod: 'morning',
    statTarget: 'nutrition',
    description: 'Daily 5g dose for strength and cognitive endurance.',
  },
  {
    id: 'drink_energy_drink',
    order: 4,
    title: 'Drink Energy Drink',
    type: 'boolean',
    baseXp: 0, // IMPORTANT: Informational, NEVER awards or deducts XP
    category: 'routine',
    timePeriod: 'morning',
    description: 'Track caffeine intake (informational only — 0 XP).',
  },
  {
    id: 'hit_the_gym',
    order: 5,
    title: 'Hit the Gym',
    type: 'boolean',
    baseXp: 15,
    category: 'fitness',
    timePeriod: 'morning',
    statTarget: 'fitness',
    description: 'Heavy lifting or dedicated training session.',
  },
  {
    id: 'water_checkpoint_2',
    order: 6,
    title: 'Drink Water (Checkpoint 2)',
    type: 'boolean',
    baseXp: 2,
    category: 'nutrition',
    timePeriod: 'morning',
    statTarget: 'nutrition',
    description: 'Post-workout hydration boost.',
  },
  {
    id: 'eat_breakfast',
    order: 7,
    title: 'Eat Breakfast',
    type: 'boolean',
    baseXp: 5,
    category: 'nutrition',
    timePeriod: 'morning',
    statTarget: 'nutrition',
    description: 'High protein breakfast to fuel body & mind.',
  },
  {
    id: 'water_checkpoint_3',
    order: 8,
    title: 'Drink Water (Checkpoint 3)',
    type: 'boolean',
    baseXp: 2,
    category: 'nutrition',
    timePeriod: 'morning',
    statTarget: 'nutrition',
    description: 'Mid-morning hydration checkpoint.',
  },
  {
    id: 'shower_get_ready',
    order: 9,
    title: 'Shower / Get Ready',
    type: 'boolean',
    baseXp: 3,
    category: 'hygiene',
    timePeriod: 'morning',
    statTarget: 'discipline',
    description: 'Freshen up, groomed and locked in for execution.',
  },
  {
    id: 'make_protein_coffee',
    order: 10,
    title: 'Make Protein Coffee',
    type: 'boolean',
    baseXp: 5,
    category: 'nutrition',
    timePeriod: 'morning',
    statTarget: 'nutrition',
    description: 'Sip delicious protein-infused brew.',
  },
  {
    id: 'go_to_school_work',
    order: 11,
    title: 'Go to School / Work',
    type: 'boolean',
    baseXp: 5,
    category: 'discipline',
    timePeriod: 'afternoon',
    statTarget: 'discipline',
    allowNA: true, // Can be marked N/A on weekends/holidays without penalty
    description: 'Show up on time and locked in on obligations (or N/A on off-days).',
  },
  {
    id: 'eat_healthy_lunch',
    order: 12,
    title: 'Eat Healthy Lunch',
    type: 'boolean',
    baseXp: 7,
    category: 'nutrition',
    timePeriod: 'afternoon',
    statTarget: 'nutrition',
    description: 'Clean whole foods meal within nutritional targets.',
  },
  {
    id: 'water_checkpoint_4',
    order: 13,
    title: 'Drink Water (Checkpoint 4)',
    type: 'boolean',
    baseXp: 2,
    category: 'nutrition',
    timePeriod: 'afternoon',
    statTarget: 'nutrition',
    description: 'Afternoon hydration checkpoint.',
  },
  {
    id: 'daily_focus',
    order: 14,
    title: 'Daily Focus',
    type: 'focus', // 1-5 selector
    baseXp: 0, // Calculated dynamically from 1-5 rating (0 to 8 pts)
    category: 'focus',
    timePeriod: 'afternoon',
    statTarget: 'focus',
    description: 'Rate daily focus & productivity: 1 to 5.',
  },
  {
    id: 'water_checkpoint_5',
    order: 15,
    title: 'Drink Water (Checkpoint 5)',
    type: 'boolean',
    baseXp: 2,
    category: 'nutrition',
    timePeriod: 'evening',
    statTarget: 'nutrition',
    description: 'Evening hydration goal completed.',
  },
  {
    id: 'eat_healthy_dinner',
    order: 16,
    title: 'Eat Healthy Dinner',
    type: 'boolean',
    baseXp: 7,
    category: 'nutrition',
    timePeriod: 'evening',
    statTarget: 'nutrition',
    description: 'Nutritious evening meal supporting your targets.',
  },
  {
    id: 'prepare_for_tomorrow',
    order: 17,
    title: 'Prepare for Tomorrow',
    type: 'boolean',
    baseXp: 5,
    category: 'discipline',
    timePeriod: 'evening',
    statTarget: 'discipline',
    description: 'Lay out clothes, prep food, and plan priorities for tomorrow.',
  },
  {
    id: 'evening_prayer',
    order: 18,
    title: 'Evening Prayer',
    type: 'boolean',
    baseXp: 15,
    category: 'faith',
    timePeriod: 'evening',
    statTarget: 'faith',
    description: 'Give thanks, reflect on the day, and seek peace.',
  },
  {
    id: 'steps',
    order: 19,
    title: 'Steps',
    type: 'numeric',
    baseXp: 0, // Calculated dynamically (up to 10 pts)
    category: 'fitness',
    timePeriod: 'all_day',
    statTarget: 'fitness',
    description: 'Input exact step count. 10,000 step target.',
  },
  {
    id: 'sleep',
    order: 20,
    title: 'Sleep',
    type: 'numeric',
    baseXp: 0, // Calculated dynamically (up to 10 pts)
    category: 'recovery',
    timePeriod: 'evening',
    statTarget: 'fitness',
    description: 'Input actual hours slept last night.',
  },
  {
    id: 'bible_reading',
    order: 21,
    title: 'Bible Reading / Scripture',
    type: 'boolean',
    baseXp: 5,
    category: 'faith',
    timePeriod: 'all_day',
    statTarget: 'faith',
    isOptional: true,
    description: 'Intentional scripture reading and reflection.',
  },
];

// Exactly 7 Established Side Quests (Bonus XP only)
export const SIDE_QUESTS: SideQuestDefinition[] = [
  {
    id: 'no_pornography',
    order: 1,
    title: 'No Pornography',
    xp: 10,
    description: 'Complete discipline over dopamine pathways and mind.',
    statTarget: 'discipline',
  },
  {
    id: 'screen_time_under_5h',
    order: 2,
    title: 'Screen Time Under 5 Hours',
    xp: 8,
    description: 'Recreational screen time under 5 hours (work/school excluded).',
    statTarget: 'discipline',
  },
  {
    id: 'comfort_zone',
    order: 3,
    title: 'Get Out of Your Comfort Zone',
    xp: 7,
    description: 'Do something uncomfortable that fosters character growth.',
    statTarget: 'character',
  },
  {
    id: 'extra_study_reading',
    order: 4,
    title: 'Extra Study / Reading (30+ min)',
    xp: 5,
    description: 'Intentional study, reading, or skill development beyond requirements.',
    statTarget: 'focus',
  },
  {
    id: 'reset_the_base',
    order: 5,
    title: 'Reset the Base',
    xp: 5,
    description: 'Clean or organize something meaningful: room, desk, car, or workspace.',
    statTarget: 'discipline',
  },
  {
    id: 'serve_encourage',
    order: 6,
    title: 'Serve / Encourage Someone',
    xp: 5,
    description: 'Intentionally help, serve, encourage, or do something thoughtful.',
    statTarget: 'character',
  },
  {
    id: 'do_the_thing',
    order: 7,
    title: 'Do the Thing',
    xp: 7,
    description: 'Finish a critical task you have been avoiding or procrastinating on.',
    statTarget: 'discipline',
  },
];

// Rotating Pool of Bonus Objectives (Special Above-and-Beyond challenges)
export const BONUS_OBJECTIVES_POOL: BonusObjectiveDefinition[] = [
  {
    id: 'extra_mile',
    title: 'The Extra Mile',
    description: 'Reach 15,000 steps',
    quote: 'Go further.',
    xp: 15,
    target: 15000,
    unit: 'steps',
    iconName: 'Footprints',
    statTarget: 'fitness',
  },
  {
    id: 'deep_work',
    title: 'Deep Work',
    description: '60 minutes of EXTRA intentional study or reading',
    quote: 'Sharpen the blade.',
    xp: 10,
    target: 60,
    unit: 'min',
    iconName: 'BookOpen',
    statTarget: 'focus',
  },
  {
    id: 'hydration_master_bonus',
    title: 'Hydration Master',
    description: 'Complete all 5 water checkpoints AND an additional 32oz bottle',
    quote: 'Clean fuel.',
    xp: 10,
    target: 5,
    unit: 'checkpoints',
    iconName: 'Droplets',
    statTarget: 'nutrition',
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete Morning Prayer and your gym workout before 8:00 AM',
    quote: 'Win the morning, win the day.',
    xp: 10,
    iconName: 'Sun',
    statTarget: 'discipline',
  },
  {
    id: 'double_down',
    title: 'Double Down',
    description: 'Complete an additional intentional 30+ min workout or cardio challenge',
    quote: 'Outwork your yesterday.',
    xp: 15,
    target: 30,
    unit: 'min',
    iconName: 'Flame',
    statTarget: 'fitness',
  },
  {
    id: 'the_finisher',
    title: 'The Finisher',
    description: 'Complete two meaningful tasks you have been avoiding',
    quote: 'Execute without hesitation.',
    xp: 15,
    target: 2,
    unit: 'tasks',
    iconName: 'CheckCircle2',
    statTarget: 'discipline',
  },
  {
    id: 'above_and_beyond',
    title: 'Above & Beyond',
    description: 'Perform an exceptional act of service or encouragement beyond normal',
    quote: 'Lift others up.',
    xp: 15,
    iconName: 'HeartHandshake',
    statTarget: 'character',
  },
];

/**
 * Deterministically picks one Bonus Objective for a given calendar date string YYYY-MM-DD.
 * Ensures refreshing or reloading the app does NOT reroll the daily objective!
 */
export function getDailyBonusObjective(dateStr: string): BonusObjectiveDefinition {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0;
  }
  const index = hash % BONUS_OBJECTIVES_POOL.length;
  return BONUS_OBJECTIVES_POOL[index];
}

// Focus XP Mapping (1 to 5)
export const FOCUS_XP_MAP: Record<number, { xp: number; label: string }> = {
  1: { xp: 0, label: 'Wasted the day' },
  2: { xp: 2, label: 'Below average' },
  3: { xp: 4, label: 'Solid' },
  4: { xp: 6, label: 'Very productive' },
  5: { xp: 8, label: 'Locked in' },
};

// Major Milestone Titles for the 100 Level System (Part XLVI - XLIX)
export function getMilestoneRank(level: number): string {
  if (level >= 100) return 'SEVEN';
  if (level >= 90) return 'MASTERED';
  if (level >= 80) return 'UNSTOPPABLE';
  if (level >= 70) return 'ELITE';
  if (level >= 60) return 'FORGED';
  if (level >= 50) return 'RELENTLESS';
  if (level >= 40) return 'FOCUSED';
  if (level >= 30) return 'DISCIPLINED';
  if (level >= 20) return 'CONSISTENT';
  if (level >= 10) return 'COMMITTED';
  return 'INITIATE';
}

// Exactly 100 Levels with an increasingly difficult calibrated XP curve (Part XLVI - L)
function generate100Levels(): LevelDefinition[] {
  const levels: LevelDefinition[] = [{ level: 1, title: 'INITIATE', xpRequired: 0 }];
  let cumulative = 0;
  for (let l = 2; l <= 100; l++) {
    // Calibrated so Level 2 requires ~380 XP (several good days), Level 10 ~7,200 XP, Level 100 ~450k XP (years)
    const delta = Math.round(350 + (l - 2) * 85 + Math.pow(l - 1, 1.65) * 18);
    cumulative += delta;
    levels.push({
      level: l,
      title: getMilestoneRank(l),
      xpRequired: cumulative,
    });
  }
  return levels;
}

export const LEVELS: LevelDefinition[] = generate100Levels();

// Weekly Goals Pool (Part XXV - XXVII)
export const WEEKLY_GOALS_POOL: {
  id: import('../types').WeeklyGoalType;
  title: string;
  subtitle: string;
  description: string;
  xpReward: number;
  targetValue: number;
  unit: string;
  icon: string;
  requiresConfig?: 'protein' | 'gym' | 'prayer';
}[] = [
  {
    id: 'gym_week',
    title: 'Gym Week',
    subtitle: 'Physical discipline',
    description: 'Complete 5 gym sessions this week.',
    xpReward: 75,
    targetValue: 5,
    unit: 'sessions',
    icon: 'Dumbbell',
    requiresConfig: 'gym',
  },
  {
    id: '70k_week',
    title: '70K Week',
    subtitle: 'Daily motion',
    description: 'Accumulate 70,000 total steps across 7 days.',
    xpReward: 75,
    targetValue: 70000,
    unit: 'steps',
    icon: 'Footprints',
  },
  {
    id: 'diamond_week',
    title: 'Diamond Week',
    subtitle: 'Pure execution',
    description: 'Earn 3 Perfect Days (100% Core Performance).',
    xpReward: 85,
    targetValue: 3,
    unit: 'days',
    icon: 'Gem',
  },
  {
    id: 'seven_strong',
    title: 'Seven Strong',
    subtitle: 'Unbroken week',
    description: 'Conquer all 7 out of 7 days in this cycle.',
    xpReward: 100,
    targetValue: 7,
    unit: 'days',
    icon: 'Flame',
  },
  {
    id: 'consistency',
    title: 'Consistency',
    subtitle: 'High standard',
    description: 'Conquer at least 6 out of 7 days this week.',
    xpReward: 75,
    targetValue: 6,
    unit: 'days',
    icon: 'ShieldCheck',
  },
  {
    id: 'first_things_first',
    title: 'First Things First',
    subtitle: 'Morning foundation',
    description: 'Complete Morning Prayer on all 7 days.',
    xpReward: 60,
    targetValue: 7,
    unit: 'days',
    icon: 'Sun',
    requiresConfig: 'prayer',
  },
  {
    id: 'bookends',
    title: 'Bookends',
    subtitle: 'Morning & evening',
    description: 'Complete Morning + Evening Prayer on 6 days.',
    xpReward: 70,
    targetValue: 6,
    unit: 'days',
    icon: 'BookOpen',
    requiresConfig: 'prayer',
  },
  {
    id: 'locked_in_week',
    title: 'Locked In Week',
    subtitle: 'Elite focus',
    description: 'Maintain average Core Performance ≥ 85%.',
    xpReward: 80,
    targetValue: 85,
    unit: '%',
    icon: 'Target',
  },
  {
    id: 'focus_week',
    title: 'Focus Week',
    subtitle: 'Mental clarity',
    description: 'Average Daily Focus rating ≥ 4.0 across week.',
    xpReward: 65,
    targetValue: 4,
    unit: 'rating',
    icon: 'Zap',
  },
  {
    id: 'side_hustle',
    title: 'Side Hustle',
    subtitle: 'Going above & beyond',
    description: 'Complete 10 total Side Quests this week.',
    xpReward: 60,
    targetValue: 10,
    unit: 'quests',
    icon: 'CheckCircle2',
  },
  {
    id: 'protein_week',
    title: 'Protein Week',
    subtitle: 'Fuel properly',
    description: 'Hit your daily Protein target on 5 days.',
    xpReward: 75,
    targetValue: 5,
    unit: 'days',
    icon: 'Utensils',
    requiresConfig: 'protein',
  },
];

export function getWeeklyGoalForCycle(
  cycleStartDate: string,
  eligibleGoals = WEEKLY_GOALS_POOL
) {
  if (!eligibleGoals.length) return WEEKLY_GOALS_POOL[1];
  let hash = 0;
  for (let i = 0; i < cycleStartDate.length; i++) {
    hash = (hash * 31 + cycleStartDate.charCodeAt(i)) >>> 0;
  }
  const index = hash % eligibleGoals.length;
  return eligibleGoals[index];
}

// Default Body Measurement Types (Part XXXVI)
export const BODY_MEASUREMENT_TYPES: { type: import('../types').BodyMeasurementType; label: string }[] = [
  { type: 'waist', label: 'Waist' },
  { type: 'chest', label: 'Chest' },
  { type: 'left_arm', label: 'Left Arm' },
  { type: 'right_arm', label: 'Right Arm' },
  { type: 'hips', label: 'Hips' },
  { type: 'left_thigh', label: 'Left Thigh' },
  { type: 'right_thigh', label: 'Right Thigh' },
  { type: 'neck', label: 'Neck' },
];

// Default Nutrition Settings (Part XLII - XLV)
export const DEFAULT_NUTRITION_SETTINGS: import('../types').NutritionSettings = {
  id: 'current',
  caloriesTarget: 1950,
  proteinTarget: 180,
  carbsTarget: 210,
  fatTarget: 70,
  waterTargetOz: 80,
};


export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  // Consistency
  {
    id: 'first_blood',
    title: 'First Blood',
    description: 'Complete your first day in SEVEN.',
    category: 'consistency',
    icon: 'Sword',
  },
  {
    id: 'were_balling',
    title: "We're Balling",
    description: 'Earn 100+ XP in one day.',
    category: 'consistency',
    icon: 'Trophy',
  },
  {
    id: 'locked_in_day',
    title: 'Locked In',
    description: 'Achieve 85%+ Core Performance on a day.',
    category: 'consistency',
    icon: 'Flame',
  },
  {
    id: 'hat_trick',
    title: 'Hat Trick',
    description: '3 successful conquered days in a row.',
    category: 'consistency',
    icon: 'Sparkles',
  },
  {
    id: 'seven_days_strong',
    title: 'Seven Days Strong',
    description: '7-day conquered streak.',
    category: 'consistency',
    icon: 'Zap',
  },
  {
    id: 'unstoppable',
    title: 'Unstoppable',
    description: '14 successful conquered days in a row.',
    category: 'consistency',
    icon: 'ShieldAlert',
  },
  {
    id: 'no_days_off',
    title: 'No Days Off',
    description: '30 successful conquered days in a row.',
    category: 'consistency',
    icon: 'Calendar',
  },
  {
    id: 'flawless',
    title: 'Flawless',
    description: 'Your first perfect day (100% Core Points).',
    category: 'consistency',
    icon: 'Diamond',
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Achieve 10 lifetime Perfect Days.',
    category: 'consistency',
    icon: 'Crown',
    tier: 'bronze',
    progress: 0,
    target: 10,
  },
  {
    id: 'diamond_discipline',
    title: 'Diamond Discipline',
    description: 'Achieve 50 lifetime Perfect Days.',
    category: 'consistency',
    icon: 'Gem',
    tier: 'gold',
    progress: 0,
    target: 50,
  },
  {
    id: 'century_of_excellence',
    title: 'Century of Excellence',
    description: '100 lifetime conquered days.',
    category: 'consistency',
    icon: 'Award',
    tier: 'diamond',
    progress: 0,
    target: 100,
  },

  // Fitness
  {
    id: 'gym_rat',
    title: 'Gym Rat',
    description: 'Complete 25 gym sessions (Gold tier).',
    category: 'fitness',
    icon: 'Dumbbell',
    tier: 'silver',
    progress: 0,
    target: 25,
  },
  {
    id: '10k_club',
    title: '10K Club',
    description: 'Reach 10,000 steps in one day.',
    category: 'fitness',
    icon: 'Footprints',
  },
  {
    id: '15k_club',
    title: '15K Club',
    description: 'Reach 15,000 steps in one day.',
    category: 'fitness',
    icon: 'Zap',
  },
  {
    id: 'walker',
    title: 'Walker',
    description: 'Accumulate 100,000 total steps.',
    category: 'fitness',
    icon: 'Compass',
    tier: 'bronze',
    progress: 0,
    target: 100000,
  },
  {
    id: 'deep_recovery',
    title: 'Deep Recovery',
    description: 'Log 8.0+ hours of sleep on 5 different days.',
    category: 'fitness',
    icon: 'Moon',
  },

  // Faith
  {
    id: 'first_things_first',
    title: 'First Things First',
    description: 'Complete Morning Prayer.',
    category: 'faith',
    icon: 'Sun',
  },
  {
    id: 'prayer_warrior',
    title: 'Prayer Warrior',
    description: 'Both Morning + Evening Prayer for 7 consecutive days.',
    category: 'faith',
    icon: 'Flame',
    tier: 'silver',
    progress: 0,
    target: 7,
  },
  {
    id: 'steadfast',
    title: 'Steadfast',
    description: 'Both prayers for 30 consecutive days.',
    category: 'faith',
    icon: 'Shield',
    target: 30,
  },
  {
    id: 'in_the_word',
    title: 'In The Word',
    description: 'Complete Scripture reading for 7 days.',
    category: 'faith',
    icon: 'BookOpen',
  },

  // Body (Dynamic achievements calculated from user baseline)
  {
    id: 'down_ten',
    title: 'Down 10',
    description: 'Lose 10 lb (or 4.5 kg) from your baseline weight.',
    category: 'body',
    icon: 'TrendingDown',
  },
  {
    id: 'down_twenty',
    title: 'Down 20',
    description: 'Lose 20 lb (or 9 kg) from your baseline weight.',
    category: 'body',
    icon: 'TrendingDown',
  },
  {
    id: 'goal_crushed',
    title: 'Goal Crushed',
    description: 'Reach your Arc goal target weight.',
    category: 'body',
    icon: 'Crown',
  },
  {
    id: 'maintained_30',
    title: 'Maintained — 30 Days',
    description: 'Maintain target weight within tolerance for 30 days.',
    category: 'body',
    icon: 'Scale',
  },

  // Discipline
  {
    id: 'clean_day',
    title: 'Clean Day',
    description: 'Complete No Pornography side quest.',
    category: 'discipline',
    icon: 'ShieldCheck',
  },
  {
    id: 'touch_grass',
    title: 'Touch Grass',
    description: 'Complete the screen time under 5 hours side quest.',
    category: 'discipline',
    icon: 'Smartphone',
  },
  {
    id: 'digital_discipline',
    title: 'Digital Discipline',
    description: 'Keep screen time under 5 hours for 14 days.',
    category: 'discipline',
    icon: 'Clock',
  },
  {
    id: 'do_the_thing',
    title: 'Do The Thing',
    description: 'Complete a major avoided task.',
    category: 'discipline',
    icon: 'CheckCircle2',
  },
  {
    id: 'comfort_breaker',
    title: 'Comfort Breaker',
    description: 'Get out of your comfort zone 10 times.',
    category: 'discipline',
    icon: 'AlertTriangle',
    progress: 0,
    target: 10,
  },

  // Focus & Learning
  {
    id: 'scholar',
    title: 'Scholar',
    description: 'Complete Extra Study / Reading side quest.',
    category: 'focus',
    icon: 'GraduationCap',
  },
  {
    id: 'laser_focus',
    title: 'Laser Focus',
    description: 'Rate daily focus as 5 (Locked In) 7 times.',
    category: 'focus',
    icon: 'Target',
  },

  // Character & Service
  {
    id: 'good_samaritan',
    title: 'Good Samaritan',
    description: 'Complete Serve / Encourage Someone side quest.',
    category: 'character',
    icon: 'HeartHandshake',
  },
  {
    id: 'clean_slate',
    title: 'Clean Slate',
    description: 'Complete Reset the Base 5 times.',
    category: 'character',
    icon: 'Sparkles',
  },

  // Comebacks (Recovery rewarded!)
  {
    id: 'comeback',
    title: 'Comeback',
    description: 'Conquer a day after 3 consecutive rough days.',
    category: 'comeback',
    icon: 'RotateCcw',
  },
  {
    id: 'the_return',
    title: 'The Return',
    description: 'Conquer a day after 7+ consecutive absent/unsuccessful days.',
    category: 'comeback',
    icon: 'Shield',
  },
  {
    id: 'not_today',
    title: 'Not Today',
    description: 'Conquer a day immediately after a rough day.',
    category: 'comeback',
    icon: 'Zap',
  },

  // Secret Achievements (Requirements hidden with ??? until unlocked)
  {
    id: 'secret_overachiever',
    title: 'Overachiever',
    description: 'Earn 150+ XP in a single day.',
    category: 'secret',
    icon: 'Flame',
    isSecret: true,
  },
  {
    id: 'secret_perfect_board',
    title: 'Perfect Board',
    description: 'Complete every applicable Core Quest AND all 7 Side Quests in one day.',
    category: 'secret',
    icon: 'Award',
    isSecret: true,
  },
  {
    id: 'secret_above_beyond',
    title: 'Above & Beyond',
    description: 'Complete a Perfect Day + all Side Quests + the Bonus Objective.',
    category: 'secret',
    icon: 'Crown',
    isSecret: true,
  },
];

export const INITIAL_PERSONAL_RECORDS: PersonalRecord[] = [
  {
    id: 'pr_daily_xp',
    title: 'Highest Daily XP',
    value: 0,
    displayValue: '—',
    unit: 'XP',
    dateAchieved: '',
  },
  {
    id: 'pr_core_perf',
    title: 'Highest Core Performance',
    value: 0,
    displayValue: '—',
    unit: '%',
    dateAchieved: '',
  },
  {
    id: 'pr_longest_streak',
    title: 'Longest Streak',
    value: 0,
    displayValue: '—',
    unit: 'days',
    dateAchieved: '',
  },
  {
    id: 'pr_most_steps',
    title: 'Most Steps in a Day',
    value: 0,
    displayValue: '—',
    unit: 'steps',
    dateAchieved: '',
  },
  {
    id: 'pr_lowest_weight',
    title: 'Lowest Recorded Weight',
    value: 0,
    displayValue: '—',
    unit: 'lb',
    dateAchieved: '',
  },
  {
    id: 'pr_gym_sessions',
    title: 'Most Gym Sessions in a Week',
    value: 0,
    displayValue: '—',
    unit: 'sessions',
    dateAchieved: '',
  },
];

