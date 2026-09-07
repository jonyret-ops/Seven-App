import Dexie, { type Table } from 'dexie';
import { 
  Achievement, 
  Arc, 
  ArcGoal,
  ArcRecap, 
  BodyMeasurementEntry,
  DailyFocusIntention,
  DailyLog, 
  MealLog,
  NutritionSettings,
  PersonalRecord, 
  UserProfile, 
  WeightEntry,
  WeeklyGoalInstance,
  WeeklyReport
} from '../types';

export interface StoredProfileRecord {
  id: string; // 'current'
  profile: UserProfile;
}

export interface StoredArcRecord {
  id: string;
  arc: Arc;
}

export class SevenDatabase extends Dexie {
  profiles!: Table<StoredProfileRecord, string>;
  arcs!: Table<Arc, string>;
  arcRecaps!: Table<ArcRecap, number>;
  dailyLogs!: Table<DailyLog, string>;
  weightEntries!: Table<WeightEntry, string>;
  achievements!: Table<Achievement, string>;
  personalRecords!: Table<PersonalRecord, string>;
  bodyMeasurements!: Table<BodyMeasurementEntry, string>;
  mealLogs!: Table<MealLog, string>;
  nutritionSettings!: Table<NutritionSettings, string>;
  weeklyGoals!: Table<WeeklyGoalInstance, string>;
  weeklyReports!: Table<WeeklyReport, number>;
  dailyFocusIntentions!: Table<DailyFocusIntention, string>;
  arcGoals!: Table<ArcGoal, string>;

  constructor() {
    super('SevenDisciplineDB');
    this.version(1).stores({
      profiles: 'id',
      arcs: 'id, isActive',
      arcRecaps: '++id, arcName',
      dailyLogs: 'date, corePerformancePercent, totalXp, isConqueredDay, isPerfectDay',
      weightEntries: 'id, date, weight',
      achievements: 'id, category, unlockedAt',
      personalRecords: 'id',
    });

    this.version(2).stores({
      bodyMeasurements: 'id, date, measurementType',
      mealLogs: 'id, date, mealType',
      nutritionSettings: 'id',
      weeklyGoals: 'id, weekNumber, startDate',
      weeklyReports: '++id, weekNumber, startDate',
      dailyFocusIntentions: 'id, date',
      arcGoals: 'id, arcId',
    });
  }
}

export const db = new SevenDatabase();

