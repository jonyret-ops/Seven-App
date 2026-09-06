import Dexie, { type Table } from 'dexie';
import { 
  Achievement, 
  Arc, 
  ArcRecap, 
  DailyLog, 
  PersonalRecord, 
  UserProfile, 
  WeightEntry 
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
  }
}

export const db = new SevenDatabase();
