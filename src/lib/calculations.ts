import { 
  DAILY_QUESTS, 
  FOCUS_XP_MAP, 
  LEVELS, 
  SIDE_QUESTS, 
  BONUS_OBJECTIVES_POOL,
  DEFAULT_WEEKLY_SCHEDULE,
  WEEKLY_GOALS_POOL,
  BODY_MEASUREMENT_TYPES,
  getDailyBonusObjective 
} from '../constants';
import { 
  Achievement, 
  BodyMeasurementEntry,
  BodyMeasurementSummary,
  BodyMeasurementType,
  CharacterStats, 
  DailyLog, 
  DailyMacroSummary,
  DailyRank, 
  DayOfWeek,
  LevelDefinition, 
  MealLog,
  NutritionSettings,
  StatusSnapshot, 
  StatusTitle, 
  StreakStats, 
  UserProfile,
  WeightEntry, 
  WeightStats, 
  WeeklyGoalDefinition,
  WeeklyReport 
} from '../types';

/**
 * Calculates step XP based on exact requirements:
 * < 5,000 = 0 XP
 * 5,000–7,999 = 2 XP
 * 8,000–9,999 = 4 XP
 * 10,000–11,999 = 10 XP
 * 12,000+ = 12 XP total (10 Core + 2 Extra Mile Bonus)
 */
export function calculateStepXp(steps: number): number {
  if (steps >= 12000) return 12;
  if (steps >= 10000) return 10;
  if (steps >= 8000) return 4;
  if (steps >= 5000) return 2;
  return 0;
}

export function calculateStepCoreXp(steps: number): number {
  if (steps >= 10000) return 10;
  if (steps >= 8000) return 4;
  if (steps >= 5000) return 2;
  return 0;
}

export function calculateStepBonusXp(steps: number): number {
  if (steps >= 12000) return 2;
  return 0;
}

/**
 * Calculates sleep XP based on exact requirements:
 * < 5.0 = 0 XP
 * 5.0–5.9 = 2 XP
 * 6.0–6.9 = 4 XP
 * 7.0–7.9 = 7 XP
 * 8.0+ = 10 XP
 */
export function calculateSleepXp(hours: number): number {
  if (hours >= 8.0) return 10;
  if (hours >= 7.0) return 7;
  if (hours >= 6.0) return 4;
  if (hours >= 5.0) return 2;
  return 0;
}

/**
 * Calculates focus XP from 1-5 rating:
 * 1 = 0 XP
 * 2 = 2 XP
 * 3 = 4 XP
 * 4 = 6 XP
 * 5 = 8 XP
 */
export function calculateFocusXp(rating: number): number {
  return FOCUS_XP_MAP[rating]?.xp ?? 0;
}

/**
 * Date helper utilities (YYYY-MM-DD)
 */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(dateStr: string, days: number): string {
  const d = parseDate(dateStr);
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

export function getDaysDifference(fromStr: string, toStr: string): number {
  const from = parseDate(fromStr).getTime();
  const to = parseDate(toStr).getTime();
  return Math.round((to - from) / (1000 * 60 * 60 * 24));
}

/**
 * Human-readable full date, e.g. "Sep 6, 2026"
 */
export function formatHumanDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = parseDate(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Human-readable short date, e.g. "Sep 6"
 */
export function formatHumanDateShort(dateStr: string): string {
  if (!dateStr) return '';
  const d = parseDate(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Returns ordinal suffix for a number: 1st, 2nd, 3rd, 4th, 11th, 12th, 13th, 21st, etc.
 */
export function getOrdinalSuffix(n: number): string {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  const lastDigit = n % 10;
  if (lastDigit === 1) return `${n}st`;
  if (lastDigit === 2) return `${n}nd`;
  if (lastDigit === 3) return `${n}rd`;
  return `${n}th`;
}

/**
 * Formats an ISO date (YYYY-MM-DD) as natural readable ordinal date: "September 7th, 2026" or "Mon, Sep 7th, 2026"
 */
export function formatOrdinalDate(
  dateStr: string, 
  options?: { includeWeekday?: boolean; shortMonth?: boolean; omitYear?: boolean }
): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      const weekdayStr = options?.includeWeekday 
        ? date.toLocaleDateString('en-US', { weekday: options.shortMonth ? 'short' : 'long' }) + ', ' 
        : '';
      const monthName = date.toLocaleDateString('en-US', { month: options?.shortMonth ? 'short' : 'long' });
      const yearStr = options?.omitYear ? '' : `, ${year}`;
      return `${weekdayStr}${monthName} ${getOrdinalSuffix(day)}${yearStr}`;
    }
  } catch {}
  return dateStr;
}

/**
 * Human-readable date range, e.g. "Sep 6 – Dec 5, 2026"
 */
export function formatHumanDateRange(startDateStr: string, endDateStr: string): string {
  if (!startDateStr || !endDateStr) return '';
  const start = parseDate(startDateStr);
  const end = parseDate(endDateStr);

  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const startDay = start.getDate();
  const startYear = start.getFullYear();

  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
  const endDay = end.getDate();
  const endYear = end.getFullYear();

  if (startYear === endYear) {
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} – ${endDay}, ${startYear}`;
    }
    return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${startYear}`;
  }
  return `${startMonth} ${startDay}, ${startYear} – ${endMonth} ${endDay}, ${endYear}`;
}

/**
 * Checks if a specific calendar date is a Rest Day:
 * 1. If in trainAnywayDates -> false (Active Day override)
 * 2. If in restDayOverrides -> true (One-off Rest Day)
 * 3. According to weekly schedule (e.g. Sunday = 'rest')
 */
export function isRestDay(dateStr: string, profile?: Partial<UserProfile> | null): boolean {
  if (!profile) return false;
  const trainAnyway = profile.trainAnywayDates || [];
  if (trainAnyway.includes(dateStr)) return false;

  const restOverrides = profile.restDayOverrides || [];
  if (restOverrides.includes(dateStr)) return true;

  const schedule = profile.weeklySchedule || DEFAULT_WEEKLY_SCHEDULE;
  const d = parseDate(dateStr);
  const dayIndex = d.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  const dayKeyMap: Record<number, DayOfWeek> = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
  };
  const dayKey = dayKeyMap[dayIndex];
  return schedule[dayKey] === 'rest';
}

/**
 * Counts the number of eligible Active Days between two dates
 */
export function countEligibleActiveDays(
  startDateStr: string,
  endDateStr: string,
  profile?: Partial<UserProfile> | null
): number {
  if (!startDateStr || !endDateStr) return 0;
  const totalDays = getDaysDifference(startDateStr, endDateStr) + 1;
  if (totalDays <= 0) return 0;
  let activeCount = 0;
  for (let i = 0; i < totalDays; i++) {
    const curDate = addDays(startDateStr, i);
    if (!isRestDay(curDate, profile)) {
      activeCount++;
    }
  }
  return activeCount;
}

/**
 * Core Performance % vs XP:
 * Core Performance measures completion of APPLICABLE Core Daily Quest points:
 * Core Performance % = (Core Points Earned) / (Core Points Available)
 *
 * Exclusions:
 * - Energy drink (0 XP) is excluded from points.
 * - Quests in naQuestIds are excluded from Core Points Available and award 0 XP.
 * - Side Quests and Bonus Objectives contribute ONLY to XP, NEVER to Core Performance.
 */
export function calculateDailyMetrics(
  log: Partial<DailyLog>,
  conqueredThresholdPercent = 85
): {
  corePointsEarned: number;
  corePointsAvailable: number;
  corePerformancePercent: number;
  baseXp: number;
  bonusXp: number;
  totalXp: number;
  dailyRank: DailyRank;
  isConqueredDay: boolean;
  isPerfectDay: boolean;
} {
  const naSet = new Set(log.naQuestIds || []);
  const completedIds = new Set(log.completedQuestIds || []);

  let corePointsAvailable = 0;
  let corePointsEarned = 0;
  let bonusXp = 0;

  // 1. Evaluate Core Quests
  for (const quest of DAILY_QUESTS) {
    if (quest.isOptional) continue; // Optional quests like Bible Reading don't penalize denominator unless enabled
    if (naSet.has(quest.id)) continue; // N/A removes from available points!

    if (quest.type === 'boolean') {
      if (quest.baseXp > 0) {
        corePointsAvailable += quest.baseXp;
        if (completedIds.has(quest.id)) {
          corePointsEarned += quest.baseXp;
        }
      }
    } else if (quest.type === 'focus') {
      corePointsAvailable += 8; // Max focus is rating 5 = 8 pts
      if (log.focusRating) {
        corePointsEarned += calculateFocusXp(log.focusRating);
      }
    } else if (quest.type === 'numeric') {
      if (quest.id === 'steps') {
        corePointsAvailable += 10; // Max step score is 10 pts
        if (log.steps) {
          corePointsEarned += calculateStepCoreXp(log.steps);
          // Bonus steps (12,000+) are added to bonusXp and do not inflate Core Performance
          bonusXp += calculateStepBonusXp(log.steps);
        }
      } else if (quest.id === 'sleep') {
        corePointsAvailable += 10; // Max sleep score is 10 pts
        if (log.sleepHours) {
          corePointsEarned += calculateSleepXp(log.sleepHours);
        }
      }
    }
  }

  // Calculate Core Performance %
  const corePerformancePercent = corePointsAvailable > 0 
    ? Math.round((corePointsEarned / corePointsAvailable) * 100) 
    : 0;

  // 2. Evaluate Side Quests (Bonus XP only)
  const sideIds = new Set(log.completedSideQuestIds || []);
  for (const side of SIDE_QUESTS) {
    if (sideIds.has(side.id)) {
      bonusXp += side.xp;
    }
  }

  // 3. Evaluate Bonus Objective (Bonus XP only)
  if (log.completedBonusObjectiveId) {
    const bonusObj = BONUS_OBJECTIVES_POOL.find(b => b.id === log.completedBonusObjectiveId);
    if (bonusObj) {
      bonusXp += bonusObj.xp;
    }
  }

  const baseXp = corePointsEarned;
  const totalXp = baseXp + bonusXp;

  // Universal rule: 100 XP = Perfect Day (achieved whenever user earns at least 100 XP)
  const isPerfectDay = totalXp >= 100 || (corePerformancePercent === 100 && corePointsAvailable > 0);
  const isConqueredDay = isPerfectDay || corePerformancePercent >= conqueredThresholdPercent;

  // Daily classification rank
  let dailyRank: DailyRank = 'ROUGH DAY';
  if (isPerfectDay) {
    dailyRank = 'PERFECT DAY 💎';
  } else if (isConqueredDay) {
    dailyRank = 'DAY CONQUERED';
  } else if (totalXp >= 75 || corePerformancePercent >= 75) {
    dailyRank = 'STRONG DAY';
  } else if (totalXp >= 50 || corePerformancePercent >= 50) {
    dailyRank = 'KEPT MOVING';
  } else {
    dailyRank = 'ROUGH DAY';
  }

  return {
    corePointsEarned,
    corePointsAvailable,
    corePerformancePercent,
    baseXp,
    bonusXp,
    totalXp,
    dailyRank,
    isConqueredDay,
    isPerfectDay,
  };
}

/**
 * Backward-compatible calculateDailyXp function for existing callers
 */
export function calculateDailyXp(log: Partial<DailyLog>): {
  baseXp: number;
  bonusXp: number;
  totalXp: number;
  dailyRank: DailyRank;
} {
  const metrics = calculateDailyMetrics(log);
  return {
    baseXp: metrics.baseXp,
    bonusXp: metrics.bonusXp,
    totalXp: metrics.totalXp,
    dailyRank: metrics.dailyRank,
  };
}

/**
 * Calculates current level, title, progress toward next level.
 */
export function calculateLevel(totalCumulativeXp: number): {
  currentLevel: number;
  currentTitle: string;
  currentLevelXpRequired: number;
  nextLevelXpRequired: number;
  xpInCurrentLevel: number;
  xpNeededForNextLevel: number;
  progressPercent: number;
  isMaxLevel: boolean;
} {
  let currentLevelObj = LEVELS[0];
  let nextLevelObj: LevelDefinition | null = LEVELS[1] ?? null;

  for (let i = 0; i < LEVELS.length; i++) {
    if (totalCumulativeXp >= LEVELS[i].xpRequired) {
      currentLevelObj = LEVELS[i];
      nextLevelObj = LEVELS[i + 1] ?? null;
    } else {
      break;
    }
  }

  if (!nextLevelObj) {
    return {
      currentLevel: currentLevelObj.level,
      currentTitle: currentLevelObj.title,
      currentLevelXpRequired: currentLevelObj.xpRequired,
      nextLevelXpRequired: currentLevelObj.xpRequired,
      xpInCurrentLevel: totalCumulativeXp - currentLevelObj.xpRequired,
      xpNeededForNextLevel: 0,
      progressPercent: 100,
      isMaxLevel: true,
    };
  }

  const xpBracket = nextLevelObj.xpRequired - currentLevelObj.xpRequired;
  const xpGainedInBracket = Math.max(0, totalCumulativeXp - currentLevelObj.xpRequired);
  const xpNeeded = Math.max(0, nextLevelObj.xpRequired - totalCumulativeXp);
  const progressPercent = Math.min(100, Math.round((xpGainedInBracket / xpBracket) * 100));

  return {
    currentLevel: currentLevelObj.level,
    currentTitle: currentLevelObj.title,
    currentLevelXpRequired: currentLevelObj.xpRequired,
    nextLevelXpRequired: nextLevelObj.xpRequired,
    xpInCurrentLevel: xpGainedInBracket,
    xpNeededForNextLevel: xpNeeded,
    progressPercent,
    isMaxLevel: false,
  };
}

/**
 * 14-Day Current Form / Status (Part LI - LV):
 * Based on the last 14 COMPLETED days (excluding the current in-progress day & future dates).
 * Ladder:
 * - 97–100: UNSTOPPABLE
 * - 90–96: LOCKED IN
 * - 80–89: DIALED IN
 * - 70–79: SOLID
 * - 55–69: GETTING THERE
 * - 40–54: LACKING
 * - 0–39: FALLING OFF
 * For new users (< 14 completed days), status is marked BUILDING STATUS with provisional form score.
 */
export function calculateStatusSnapshot(allLogs: DailyLog[], todayDateStr: string): StatusSnapshot {
  // Collect completed days strictly prior to today, sorted newest first
  const pastLogs = allLogs
    .filter(l => l.date < todayDateStr && (l.totalXp > 0 || (l.completedQuestIds && l.completedQuestIds.length > 0) || (l.corePointsEarned ?? 0) > 0))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 14);

  if (pastLogs.length === 0) {
    return {
      currentStatus: 'BUILDING STATUS',
      sevenDayCorePerformance: 0,
      previousStatus: 'BUILDING STATUS',
      statusProgress: 0,
      completedDaysCount: 0,
    };
  }

  // Average core performance across available completed days (up to 14)
  const avgPerf = Math.round(
    pastLogs.reduce((sum, l) => sum + (l.corePerformancePercent ?? 0), 0) / pastLogs.length
  );

  let formStatus: StatusTitle = 'BUILDING STATUS';
  let statusProgress = 0;

  if (avgPerf >= 97) {
    formStatus = 'UNSTOPPABLE';
    statusProgress = 100;
  } else if (avgPerf >= 90) {
    formStatus = 'LOCKED IN';
    statusProgress = Math.round(((avgPerf - 90) / 7) * 100);
  } else if (avgPerf >= 80) {
    formStatus = 'DIALED IN';
    statusProgress = Math.round(((avgPerf - 80) / 10) * 100);
  } else if (avgPerf >= 70) {
    formStatus = 'SOLID';
    statusProgress = Math.round(((avgPerf - 70) / 10) * 100);
  } else if (avgPerf >= 55) {
    formStatus = 'GETTING THERE';
    statusProgress = Math.round(((avgPerf - 55) / 15) * 100);
  } else if (avgPerf >= 40) {
    formStatus = 'LACKING';
    statusProgress = Math.round(((avgPerf - 40) / 15) * 100);
  } else {
    formStatus = 'FALLING OFF';
    statusProgress = Math.round((avgPerf / 40) * 100);
  }

  const isBuilding = pastLogs.length < 14;

  return {
    currentStatus: isBuilding ? formStatus : formStatus,
    sevenDayCorePerformance: avgPerf,
    previousStatus: formStatus,
    statusProgress: Math.min(100, Math.max(0, statusProgress)),
    completedDaysCount: pastLogs.length,
  };
}

/**
 * Calculates Body Measurement summaries across all measurement types (Part XXXVI - XXXVIII)
 */
export function calculateBodyMeasurementSummaries(
  entries: BodyMeasurementEntry[]
): BodyMeasurementSummary[] {
  return BODY_MEASUREMENT_TYPES.map(({ type, label }) => {
    const typeEntries = entries
      .filter(e => e.measurementType === type)
      .sort((a, b) => a.date.localeCompare(b.date)); // oldest to newest

    if (typeEntries.length === 0) {
      return {
        type,
        label,
        latestValue: null,
        baselineValue: null,
        change: null,
        unit: 'in',
        latestDate: '',
      };
    }

    const baseline = typeEntries[0].value;
    const latest = typeEntries[typeEntries.length - 1].value;
    const change = Math.round((latest - baseline) * 10) / 10;

    return {
      type,
      label,
      latestValue: latest,
      baselineValue: baseline,
      change,
      unit: typeEntries[typeEntries.length - 1].unit || 'in',
      latestDate: typeEntries[typeEntries.length - 1].date,
    };
  });
}

/**
 * Calculates daily macro summary from meal logs for a date (Part XLII)
 */
export function calculateDailyMacroSummary(
  mealLogs: MealLog[],
  dateStr: string,
  settings: NutritionSettings
): DailyMacroSummary {
  const dayMeals = mealLogs.filter(m => m.date === dateStr);
  const calories = dayMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
  const protein = dayMeals.reduce((acc, m) => acc + (m.protein || 0), 0);
  const carbs = dayMeals.reduce((acc, m) => acc + (m.carbs || 0), 0);
  const fat = dayMeals.reduce((acc, m) => acc + (m.fat || 0), 0);

  const proteinPercent = settings.proteinTarget && settings.proteinTarget > 0 
    ? Math.min(100, Math.round((protein / settings.proteinTarget) * 100)) 
    : 0;
  const carbsPercent = settings.carbsTarget && settings.carbsTarget > 0 
    ? Math.min(100, Math.round((carbs / settings.carbsTarget) * 100)) 
    : 0;
  const fatPercent = settings.fatTarget && settings.fatTarget > 0 
    ? Math.min(100, Math.round((fat / settings.fatTarget) * 100)) 
    : 0;

  return {
    calories,
    protein,
    carbs,
    fat,
    caloriesTarget: settings.caloriesTarget,
    proteinTarget: settings.proteinTarget,
    carbsTarget: settings.carbsTarget,
    fatTarget: settings.fatTarget,
    proteinPercent,
    carbsPercent,
    fatPercent,
  };
}

/**
 * Calculates Weekly Goal progress automatically from existing data (Part XXVIII)
 */
export function calculateWeeklyGoalProgress(
  goalDef: WeeklyGoalDefinition,
  cycleDailyLogs: DailyLog[],
  cycleMealLogs: MealLog[],
  settings?: NutritionSettings
): number {
  switch (goalDef.id) {
    case 'gym_week': {
      return cycleDailyLogs.filter(l => l.completedQuestIds && l.completedQuestIds.includes('hit_the_gym')).length;
    }
    case '70k_week': {
      return cycleDailyLogs.reduce((acc, l) => acc + (l.steps || 0), 0);
    }
    case 'diamond_week': {
      return cycleDailyLogs.filter(l => l.isPerfectDay).length;
    }
    case 'seven_strong':
    case 'consistency': {
      return cycleDailyLogs.filter(l => l.isConqueredDay).length;
    }
    case 'first_things_first': {
      return cycleDailyLogs.filter(l => l.completedQuestIds && l.completedQuestIds.includes('morning_prayer')).length;
    }
    case 'bookends': {
      return cycleDailyLogs.filter(l => 
        l.completedQuestIds && 
        l.completedQuestIds.includes('morning_prayer') && 
        l.completedQuestIds.includes('evening_prayer')
      ).length;
    }
    case 'locked_in_week': {
      if (cycleDailyLogs.length === 0) return 0;
      const avg = Math.round(cycleDailyLogs.reduce((acc, l) => acc + (l.corePerformancePercent || 0), 0) / cycleDailyLogs.length);
      return avg;
    }
    case 'focus_week': {
      const rated = cycleDailyLogs.filter(l => (l.focusRating || 0) > 0);
      if (rated.length === 0) return 0;
      const avg = Math.round((rated.reduce((acc, l) => acc + (l.focusRating || 0), 0) / rated.length) * 10) / 10;
      return avg;
    }
    case 'side_hustle': {
      return cycleDailyLogs.reduce((acc, l) => acc + ((l.completedSideQuestIds || []).length), 0);
    }
    case 'protein_week': {
      const target = settings?.proteinTarget || 180;
      // Group meal logs by date
      const daysMeetingProtein = new Set<string>();
      const byDate: Record<string, number> = {};
      cycleMealLogs.forEach(m => {
        byDate[m.date] = (byDate[m.date] || 0) + (m.protein || 0);
        if (byDate[m.date] >= target) {
          daysMeetingProtein.add(m.date);
        }
      });
      return daysMeetingProtein.size;
    }
    default:
      return 0;
  }
}


/**
 * Character Stats (6 stats, normalized 0–100 rolling 7-day consistency scores)
 */
export function calculateCharacterStats(allLogs: DailyLog[], todayDateStr: string): CharacterStats {
  const mapByDate = new Map<string, DailyLog>();
  allLogs.forEach(l => mapByDate.set(l.date, l));

  const days: DailyLog[] = [];
  for (let i = 0; i < 7; i++) {
    const dStr = addDays(todayDateStr, -i);
    const log = mapByDate.get(dStr);
    if (log) days.push(log);
  }

  const daysCount = Math.max(1, days.length);

  // Faith: Morning Prayer (15), Evening Prayer (15) = 30 max/day
  let faithEarned = 0;
  let faithMax = daysCount * 30;

  // Fitness: Gym (15), Steps (10), Sleep (10) = 35 max/day
  let fitnessEarned = 0;
  let fitnessMax = daysCount * 35;

  // Discipline: Prepare for tomorrow (5), Shower (3), No porn (10), Screen time (8), Do the thing (7) = 33 max/day
  let disciplineEarned = 0;
  let disciplineMax = daysCount * 33;

  // Nutrition: Breakfast (5), Lunch (7), Water checkpoints (5 * 2 = 10), Protein Coffee (5), Creatine (5) = 32 max/day
  let nutritionEarned = 0;
  let nutritionMax = daysCount * 32;

  // Focus: Daily focus (up to 8), Extra study (5), Do the thing (7) = 20 max/day
  let focusEarned = 0;
  let focusMax = daysCount * 20;

  // Character: Serve/Encourage (5), Comfort Zone (7), Reset base (5) = 17 max/day
  let characterEarned = 0;
  let characterMax = daysCount * 17;

  for (const log of days) {
    const qIds = new Set(log.completedQuestIds || []);
    const sqIds = new Set(log.completedSideQuestIds || []);

    // Faith
    if (qIds.has('morning_prayer')) faithEarned += 15;
    if (qIds.has('evening_prayer')) faithEarned += 15;

    // Fitness
    if (qIds.has('hit_the_gym')) fitnessEarned += 15;
    if (log.steps) fitnessEarned += calculateStepXp(log.steps);
    if (log.sleepHours) fitnessEarned += calculateSleepXp(log.sleepHours);

    // Discipline
    if (qIds.has('prepare_for_tomorrow')) disciplineEarned += 5;
    if (qIds.has('shower_get_ready')) disciplineEarned += 3;
    if (sqIds.has('no_pornography')) disciplineEarned += 10;
    if (sqIds.has('screen_time_under_5h')) disciplineEarned += 8;
    if (sqIds.has('do_the_thing')) disciplineEarned += 7;

    // Nutrition
    if (qIds.has('eat_breakfast')) nutritionEarned += 5;
    if (qIds.has('eat_healthy_lunch')) nutritionEarned += 7;
    if (qIds.has('water_checkpoint_1')) nutritionEarned += 2;
    if (qIds.has('water_checkpoint_2')) nutritionEarned += 2;
    if (qIds.has('water_checkpoint_3')) nutritionEarned += 2;
    if (qIds.has('water_checkpoint_4')) nutritionEarned += 2;
    if (qIds.has('water_checkpoint_5')) nutritionEarned += 2;
    if (qIds.has('make_protein_coffee')) nutritionEarned += 5;
    if (qIds.has('take_creatine')) nutritionEarned += 5;

    // Focus
    if (log.focusRating) focusEarned += calculateFocusXp(log.focusRating);
    if (sqIds.has('extra_study_reading')) focusEarned += 5;
    if (sqIds.has('do_the_thing')) focusEarned += 7;

    // Character
    if (sqIds.has('serve_encourage')) characterEarned += 5;
    if (sqIds.has('comfort_zone')) characterEarned += 7;
    if (sqIds.has('reset_the_base')) characterEarned += 5;
  }

  return {
    faith: Math.min(100, Math.round((faithEarned / faithMax) * 100)),
    fitness: Math.min(100, Math.round((fitnessEarned / fitnessMax) * 100)),
    discipline: Math.min(100, Math.round((disciplineEarned / disciplineMax) * 100)),
    nutrition: Math.min(100, Math.round((nutritionEarned / nutritionMax) * 100)),
    focus: Math.min(100, Math.round((focusEarned / focusMax) * 100)),
    character: Math.min(100, Math.round((characterEarned / characterMax) * 100)),
  };
}

/**
 * Calculates streaks and successful day counts.
 * Rule: 
 * - Successful day is Core Performance >= 85% (Day Conquered)
 * - Current day does NOT break streak while in progress
 * - Future dates never break streaks
 */
export function calculateStreaks(
  allLogs: DailyLog[], 
  todayDateStr: string,
  conqueredThresholdPercent = 85,
  profile?: Partial<UserProfile> | null
): StreakStats {
  const mapByDate = new Map<string, DailyLog>();
  for (const log of allLogs) {
    mapByDate.set(log.date, log);
  }

  let totalSuccessfulDays = 0;
  let totalPerfectDays = 0;

  for (const log of allLogs) {
    const isConquered = log.isConqueredDay ?? (log.corePerformancePercent >= conqueredThresholdPercent || log.totalXp >= 100);
    if (isConquered) {
      totalSuccessfulDays++;
    }
    if (log.isPerfectDay || log.dailyRank === 'PERFECT DAY 💎' || log.corePerformancePercent === 100) {
      totalPerfectDays++;
    }
  }

  // If no successful/conquered days have been logged, both streaks are strictly 0
  if (totalSuccessfulDays === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalSuccessfulDays: 0,
      totalPerfectDays: 0,
      arcSuccessfulDays: 0,
      arcPerfectDays: 0,
    };
  }

  // Calculate current streak
  let currentStreak = 0;
  const todayLog = mapByDate.get(todayDateStr);
  const todayIsSuccess = todayLog && (todayLog.isConqueredDay || todayLog.corePerformancePercent >= conqueredThresholdPercent || todayLog.totalXp >= 100);

  if (todayIsSuccess) {
    currentStreak = 1;
    let checkDate = addDays(todayDateStr, -1);
    while (true) {
      const pastLog = mapByDate.get(checkDate);
      const isConq = pastLog && (pastLog.isConqueredDay || pastLog.corePerformancePercent >= conqueredThresholdPercent || pastLog.totalXp >= 100);
      if (isConq) {
        currentStreak++;
        checkDate = addDays(checkDate, -1);
      } else if (isRestDay(checkDate, profile)) {
        // Rest Day bridges the streak seamlessly
        checkDate = addDays(checkDate, -1);
      } else {
        break;
      }
    }
  } else {
    // Today is either in progress or a Rest Day -> check backward from yesterday
    let checkDate = addDays(todayDateStr, -1);
    while (true) {
      const pastLog = mapByDate.get(checkDate);
      const isConq = pastLog && (pastLog.isConqueredDay || pastLog.corePerformancePercent >= conqueredThresholdPercent || pastLog.totalXp >= 100);
      if (isConq) {
        currentStreak++;
        checkDate = addDays(checkDate, -1);
      } else if (isRestDay(checkDate, profile)) {
        // Rest Day bridges the streak seamlessly
        checkDate = addDays(checkDate, -1);
      } else {
        break;
      }
    }
  }

  // Calculate longest streak across all recorded days in sorted chronological order
  const sortedLogs = [...allLogs].sort((a, b) => a.date.localeCompare(b.date));
  let longestStreak = 0;
  let runningStreak = 0;
  let prevSuccessDate: string | null = null;

  for (const log of sortedLogs) {
    const isConq = log.isConqueredDay || log.corePerformancePercent >= conqueredThresholdPercent || log.totalXp >= 100;
    if (isConq) {
      if (prevSuccessDate) {
        const diff = getDaysDifference(prevSuccessDate, log.date);
        if (diff === 1) {
          runningStreak++;
        } else if (diff > 1) {
          // Check if all intermediate days were Rest Days
          let onlyRestDaysInBetween = true;
          for (let step = 1; step < diff; step++) {
            const intermediate = addDays(prevSuccessDate, step);
            if (!isRestDay(intermediate, profile)) {
              onlyRestDaysInBetween = false;
              break;
            }
          }
          if (onlyRestDaysInBetween) {
            runningStreak++;
          } else {
            runningStreak = 1;
          }
        } else {
          runningStreak = 1;
        }
      } else {
        runningStreak = 1;
      }
      prevSuccessDate = log.date;
      if (runningStreak > longestStreak) {
        longestStreak = runningStreak;
      }
    } else {
      // If it's a recorded day that was NOT conquered:
      // If it was a Rest Day, don't reset runningStreak!
      if (!isRestDay(log.date, profile)) {
        runningStreak = 0;
        prevSuccessDate = null;
      }
    }
  }

  longestStreak = Math.max(longestStreak, currentStreak);

  return {
    currentStreak,
    longestStreak,
    totalSuccessfulDays,
    totalPerfectDays,
    arcSuccessfulDays: totalSuccessfulDays,
    arcPerfectDays: totalPerfectDays,
  };
}

/**
 * Calculates weight loss statistics.
 */
export function calculateWeightStats(
  weightEntries: WeightEntry[],
  lifetimeBaselineWeight: number,
  goalWeight: number,
  arcStartingWeight = lifetimeBaselineWeight,
  weightUnit: 'lb' | 'kg' = 'lb'
): WeightStats {
  if (weightEntries.length === 0) {
    const startW = lifetimeBaselineWeight > 0 ? lifetimeBaselineWeight : 0;
    return {
      hasBaseline: startW > 0,
      lifetimeBaselineWeight: startW,
      arcStartingWeight: arcStartingWeight > 0 ? arcStartingWeight : startW,
      currentWeight: startW,
      weightLostLifetime: 0,
      weightLostArc: 0,
      weightRemainingToGoal: goalWeight > 0 && startW > 0 ? Math.max(0, Number((startW - goalWeight).toFixed(1))) : 0,
      percentToGoal: 0,
      changeSinceLast: 0,
      latestWeighInDate: '',
      isGoalReached: false,
      unit: weightUnit,
    };
  }

  const sorted = [...weightEntries].sort((a, b) => a.date.localeCompare(b.date));
  const effectiveBaseline = lifetimeBaselineWeight > 0 ? lifetimeBaselineWeight : sorted[0].weight;
  const effectiveArcStart = arcStartingWeight > 0 ? arcStartingWeight : effectiveBaseline;
  const latest = sorted[sorted.length - 1];
  const currentWeight = latest.weight;
  const weightLostLifetime = Number((effectiveBaseline - currentWeight).toFixed(1));
  const weightLostArc = Number((effectiveArcStart - currentWeight).toFixed(1));
  const weightRemainingToGoal = goalWeight > 0 ? Number(Math.max(0, currentWeight - goalWeight).toFixed(1)) : 0;
  const totalToLose = effectiveBaseline - goalWeight;
  const percentToGoal = (goalWeight > 0 && totalToLose > 0)
    ? Math.max(0, Math.min(100, Math.round((weightLostLifetime / totalToLose) * 100)))
    : (goalWeight > 0 && currentWeight <= goalWeight ? 100 : 0);

  let changeSinceLast = 0;
  if (sorted.length > 1) {
    const prev = sorted[sorted.length - 2];
    changeSinceLast = Number((currentWeight - prev.weight).toFixed(1));
  }

  return {
    hasBaseline: true,
    lifetimeBaselineWeight: effectiveBaseline,
    arcStartingWeight: effectiveArcStart,
    currentWeight,
    weightLostLifetime,
    weightLostArc,
    weightRemainingToGoal,
    percentToGoal,
    changeSinceLast,
    latestWeighInDate: latest.date,
    isGoalReached: goalWeight > 0 && currentWeight <= goalWeight,
    unit: weightUnit,
  };
}

/**
 * Evaluates achievements based on complete stored history.
 */
export function evaluateAchievements(
  allAchievements: Achievement[],
  allLogs: DailyLog[],
  weightEntries: WeightEntry[],
  streaks: StreakStats,
  currentLevel: number,
  lifetimeBaselineWeight = 0,
  goalWeight = 0,
  weightUnit: 'lb' | 'kg' = 'lb',
  bodyMode: 'lose' | 'maintain' | 'gain' | 'track' = 'lose'
): Achievement[] {
  const mapByDate = new Map<string, DailyLog>();
  allLogs.forEach(l => mapByDate.set(l.date, l));

  const totalSteps = allLogs.reduce((acc, l) => acc + (l.steps || 0), 0);
  const totalGymSessions = allLogs.filter(l => l.completedQuestIds.includes('hit_the_gym')).length;
  const hasWeights = weightEntries.length > 0;
  const minWeight = hasWeights ? Math.min(...weightEntries.map(w => w.weight)) : 999;
  const maxWeight = hasWeights ? Math.max(...weightEntries.map(w => w.weight)) : 0;
  const effectiveBaseline = lifetimeBaselineWeight > 0 
    ? lifetimeBaselineWeight 
    : (hasWeights ? weightEntries[0].weight : 0);
  const tenUnitDrop = weightUnit === 'kg' ? 4.5 : 10;
  const twentyUnitDrop = weightUnit === 'kg' ? 9.0 : 20;

  const screenTimeQuests = allLogs.filter(l => l.completedSideQuestIds.includes('screen_time_under_5h')).length;
  const studyQuests = allLogs.filter(l => l.completedSideQuestIds.includes('extra_study_reading')).length;
  const resetBaseQuests = allLogs.filter(l => l.completedSideQuestIds.includes('reset_the_base')).length;
  const laserFocusCount = allLogs.filter(l => l.focusRating === 5).length;
  const deepSleepCount = allLogs.filter(l => (l.sleepHours || 0) >= 8.0).length;
  const comfortZoneCount = allLogs.filter(l => l.completedSideQuestIds.includes('comfort_zone')).length;
  const perfectDaysCount = allLogs.filter(l => l.isPerfectDay || l.corePerformancePercent === 100).length;

  // Check 7 consecutive days of both morning & evening prayer
  const sortedDates = Array.from(mapByDate.keys()).sort();
  let prayerConsecutive = 0;
  let maxPrayerConsecutive = 0;
  for (const d of sortedDates) {
    const l = mapByDate.get(d)!;
    if (l.completedQuestIds.includes('morning_prayer') && l.completedQuestIds.includes('evening_prayer')) {
      prayerConsecutive++;
      if (prayerConsecutive > maxPrayerConsecutive) {
        maxPrayerConsecutive = prayerConsecutive;
      }
    } else {
      prayerConsecutive = 0;
    }
  }

  return allAchievements.map(ach => {
    let unlocked = false;

    switch (ach.id) {
      case 'first_blood':
        unlocked = allLogs.some(l => l.totalXp > 0 || l.completedQuestIds.length > 0);
        break;
      case 'were_balling':
        unlocked = allLogs.some(l => l.totalXp >= 100);
        break;
      case 'locked_in_day':
        unlocked = allLogs.some(l => (l.corePerformancePercent ?? 0) >= 85);
        break;
      case 'hat_trick':
        unlocked = streaks.longestStreak >= 3 || streaks.currentStreak >= 3;
        break;
      case 'seven_days_strong':
        unlocked = streaks.longestStreak >= 7 || streaks.currentStreak >= 7;
        break;
      case 'unstoppable':
        unlocked = streaks.longestStreak >= 14 || streaks.currentStreak >= 14;
        break;
      case 'no_days_off':
        unlocked = streaks.longestStreak >= 30 || streaks.currentStreak >= 30;
        break;
      case 'flawless':
        unlocked = perfectDaysCount >= 1;
        break;
      case 'perfectionist':
        unlocked = perfectDaysCount >= 10;
        break;
      case 'diamond_discipline':
        unlocked = perfectDaysCount >= 50;
        break;
      case 'century_of_excellence':
        unlocked = streaks.totalSuccessfulDays >= 100;
        break;

      // Fitness
      case 'gym_rat':
        unlocked = totalGymSessions >= 25;
        break;
      case '10k_club':
        unlocked = allLogs.some(l => (l.steps || 0) >= 10000);
        break;
      case '15k_club':
        unlocked = allLogs.some(l => (l.steps || 0) >= 15000);
        break;
      case 'walker':
        unlocked = totalSteps >= 100000;
        break;
      case 'deep_recovery':
        unlocked = deepSleepCount >= 5;
        break;

      // Faith
      case 'first_things_first':
        unlocked = allLogs.some(l => l.completedQuestIds.includes('morning_prayer'));
        break;
      case 'prayer_warrior':
        unlocked = maxPrayerConsecutive >= 7;
        break;
      case 'steadfast':
        unlocked = maxPrayerConsecutive >= 30;
        break;
      case 'in_the_word':
        unlocked = allLogs.filter(l => l.completedQuestIds.includes('bible_reading')).length >= 7;
        break;

      // Body (Dynamic achievements calculated from user baseline)
      case 'down_ten':
        unlocked = effectiveBaseline > 0 && hasWeights && minWeight <= (effectiveBaseline - tenUnitDrop);
        break;
      case 'down_twenty':
        unlocked = effectiveBaseline > 0 && hasWeights && minWeight <= (effectiveBaseline - twentyUnitDrop);
        break;
      case 'goal_crushed':
        unlocked = goalWeight > 0 && hasWeights && (
          bodyMode === 'gain' ? maxWeight >= goalWeight : minWeight <= goalWeight
        );
        break;
      case 'maintained_30':
        unlocked = goalWeight > 0 && hasWeights && weightEntries.length >= 5 && (
          bodyMode === 'gain' ? maxWeight >= goalWeight : minWeight <= goalWeight
        );
        break;

      // Discipline
      case 'clean_day':
        unlocked = allLogs.some(l => l.completedSideQuestIds.includes('no_pornography'));
        break;
      case 'touch_grass':
        unlocked = screenTimeQuests >= 1;
        break;
      case 'digital_discipline':
        unlocked = screenTimeQuests >= 14;
        break;
      case 'do_the_thing':
        unlocked = allLogs.some(l => l.completedSideQuestIds.includes('do_the_thing'));
        break;
      case 'comfort_breaker':
        unlocked = comfortZoneCount >= 10;
        break;

      // Focus
      case 'scholar':
        unlocked = studyQuests >= 1;
        break;
      case 'laser_focus':
        unlocked = laserFocusCount >= 7;
        break;

      // Character
      case 'good_samaritan':
        unlocked = allLogs.some(l => l.completedSideQuestIds.includes('serve_encourage'));
        break;
      case 'clean_slate':
        unlocked = resetBaseQuests >= 5;
        break;

      // Comebacks
      case 'not_today':
        unlocked = allLogs.some((l, idx) => {
          if (idx === 0) return false;
          const prev = allLogs[idx - 1];
          return prev.dailyRank === 'ROUGH DAY' && (l.corePerformancePercent >= 85 || l.totalXp >= 100);
        });
        break;
      case 'comeback':
        unlocked = false; // Evaluated dynamically if user recovers from 3 rough days
        break;

      // Secrets
      case 'secret_overachiever':
        unlocked = allLogs.some(l => l.totalXp >= 150);
        break;
      case 'secret_perfect_board':
        unlocked = allLogs.some(l => (l.isPerfectDay || l.corePerformancePercent === 100) && l.completedSideQuestIds.length >= 7);
        break;
      case 'secret_above_beyond':
        unlocked = allLogs.some(l => (l.isPerfectDay || l.corePerformancePercent === 100) && l.completedSideQuestIds.length >= 7 && !!l.completedBonusObjectiveId);
        break;

      default:
        unlocked = !!ach.unlockedAt;
        break;
    }

    if (unlocked && !ach.unlockedAt) {
      return { ...ach, unlockedAt: new Date().toISOString() };
    }
    return ach;
  });
}

/**
 * Calculates a weekly performance report for a specific 7-day period.
 */
export function calculateWeeklyReport(
  allLogs: DailyLog[],
  weightEntries: WeightEntry[],
  currentDateStr: string
): WeeklyReport {
  const weekLogs: DailyLog[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const dStr = addDays(currentDateStr, -i);
    const found = allLogs.find(l => l.date === dStr);
    if (found) {
      weekLogs.push(found);
    } else {
      weekLogs.push({
        date: dStr,
        completedQuestIds: [],
        naQuestIds: [],
        completedSideQuestIds: [],
        steps: 0,
        sleepHours: 0,
        focusRating: 0,
        energyDrinkConsumed: false,
        corePointsEarned: 0,
        corePointsAvailable: 95,
        corePerformancePercent: 0,
        baseXp: 0,
        bonusXp: 0,
        totalXp: 0,
        dailyRank: 'ROUGH DAY',
        isConqueredDay: false,
        isPerfectDay: false,
        createdAt: '',
        updatedAt: '',
      });
    }
  }

  const totalXp = weekLogs.reduce((sum, l) => sum + l.totalXp, 0);
  const avgXp = Math.round(totalXp / 7);
  const weeklyCorePerformance = Math.round(
    weekLogs.reduce((sum, l) => sum + (l.corePerformancePercent || 0), 0) / 7
  );
  const successfulDays = weekLogs.filter(l => l.isConqueredDay || l.corePerformancePercent >= 85 || l.totalXp >= 100).length;
  const perfectDays = weekLogs.filter(l => l.isPerfectDay || l.corePerformancePercent === 100).length;
  const gymSessions = weekLogs.filter(l => l.completedQuestIds.includes('hit_the_gym')).length;
  const totalSteps = weekLogs.reduce((sum, l) => sum + (l.steps || 0), 0);
  const avgSteps = Math.round(totalSteps / 7);
  const totalSleep = weekLogs.reduce((sum, l) => sum + (l.sleepHours || 0), 0);
  const avgSleep = Number((totalSleep / 7).toFixed(1));
  const avgFocus = Number(
    (weekLogs.reduce((sum, l) => sum + (l.focusRating || 0), 0) / 7).toFixed(1)
  );
  const sideQuestsCount = weekLogs.reduce((sum, l) => sum + l.completedSideQuestIds.length, 0);
  const bonusObjectivesCount = weekLogs.filter(l => !!l.completedBonusObjectiveId).length;

  // Grade determination based on average Core Performance and Conquered Days
  let grade: 'S' | 'A' | 'B' | 'C' | 'D' = 'C';
  let gradeTitle = 'SURVIVED';

  if (weeklyCorePerformance >= 90 && successfulDays >= 6) {
    grade = 'S';
    gradeTitle = 'LEGENDARY';
  } else if (weeklyCorePerformance >= 80 && successfulDays >= 5) {
    grade = 'A';
    gradeTitle = 'LOCKED IN';
  } else if (weeklyCorePerformance >= 70 && successfulDays >= 4) {
    grade = 'B';
    gradeTitle = 'STRONG WEEK';
  } else if (weeklyCorePerformance >= 50 && successfulDays >= 2) {
    grade = 'C';
    gradeTitle = 'SURVIVED';
  } else {
    grade = 'D';
    gradeTitle = 'FELL OFF';
  }

  // Previous week comparison (7 days before that)
  const prevWeekLogs: DailyLog[] = [];
  for (let i = 13; i >= 7; i--) {
    const dStr = addDays(currentDateStr, -i);
    const found = allLogs.find(l => l.date === dStr);
    if (found) prevWeekLogs.push(found);
  }

  let comparisonVsLastWeek = undefined;
  if (prevWeekLogs.length > 0) {
    const prevTotalXp = prevWeekLogs.reduce((sum, l) => sum + l.totalXp, 0);
    const prevSuccessfulDays = prevWeekLogs.filter(l => l.isConqueredDay || l.totalXp >= 100).length;
    const prevAvgSteps = Math.round(prevWeekLogs.reduce((sum, l) => sum + (l.steps || 0), 0) / 7);
    const prevAvgSleep = Number((prevWeekLogs.reduce((sum, l) => sum + (l.sleepHours || 0), 0) / 7).toFixed(1));

    const xpDiffPercent = prevTotalXp > 0 ? Math.round(((totalXp - prevTotalXp) / prevTotalXp) * 100) : 0;
    const successfulDaysDiff = successfulDays - prevSuccessfulDays;
    const avgStepsDiff = avgSteps - prevAvgSteps;
    const avgSleepDiff = Number((avgSleep - prevAvgSleep).toFixed(1));

    comparisonVsLastWeek = {
      xpDiffPercent,
      successfulDaysDiff,
      avgStepsDiff,
      avgSleepDiff,
    };
  }

  return {
    weekNumber: Math.max(1, Math.ceil(getDaysDifference('2026-09-06', currentDateStr) / 7)),
    startDate: addDays(currentDateStr, -6),
    endDate: currentDateStr,
    grade,
    gradeTitle,
    weeklyCorePerformance,
    totalXp,
    avgXp,
    successfulDays,
    perfectDays,
    gymSessions,
    avgSteps,
    avgSleep,
    avgFocus,
    sideQuestsCount,
    bonusObjectivesCount,
    achievementsUnlocked: 0,
    strongestStat: 'Fitness',
    needsWorkStat: 'Recovery',
    comparisonVsLastWeek,
  };
}

/**
 * Dynamic motivational copy for SEVEN
 */
export function getGreetingMessage(dayNumber: number, todayXp: number, currentStreak: number): string {
  if (todayXp >= 120) {
    return 'LOCKED IN. Unstoppable momentum.';
  }
  if (todayXp >= 100) {
    return 'Day conquered. Well done.';
  }
  if (todayXp >= 75) {
    return "You're close. Finish strong today.";
  }
  if (currentStreak >= 3 && todayXp === 0) {
    return `${currentStreak} days strong. Keep the fire burning.`;
  }
  if (todayXp < 50) {
    return `Day ${Math.max(1, dayNumber)}. Each day is a step towards greatness.`;
  }
  return 'Still plenty of XP on the board. Execute.';
}
