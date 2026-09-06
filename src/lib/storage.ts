import { 
  DEFAULT_ARC, 
  DEFAULT_PROFILE, 
  INITIAL_ACHIEVEMENTS, 
  INITIAL_PERSONAL_RECORDS, 
  INITIAL_WEIGHT_ENTRIES 
} from '../constants';
import { 
  Achievement, 
  Arc, 
  ArcRecap, 
  DailyLog, 
  PersonalRecord, 
  UserProfile, 
  WeightEntry 
} from '../types';
import { db } from './db';

export interface StorageRepository {
  getProfile(): Promise<UserProfile>;
  saveProfile(profile: UserProfile): Promise<void>;

  getCurrentArc(): Promise<Arc>;
  saveCurrentArc(arc: Arc): Promise<void>;
  
  getArcRecaps(): Promise<ArcRecap[]>;
  saveArcRecap(recap: ArcRecap): Promise<void>;
  
  getDailyLog(date: string): Promise<DailyLog | null>;
  getAllDailyLogs(): Promise<DailyLog[]>;
  saveDailyLog(log: DailyLog): Promise<void>;
  
  getWeightEntries(): Promise<WeightEntry[]>;
  saveWeightEntry(entry: WeightEntry): Promise<void>;
  deleteWeightEntry(id: string): Promise<void>;
  
  getAchievements(): Promise<Achievement[]>;
  saveAchievements(achievements: Achievement[]): Promise<void>;

  getPersonalRecords(): Promise<PersonalRecord[]>;
  savePersonalRecords(records: PersonalRecord[]): Promise<void>;

  clearAllData(): Promise<void>;
  exportData(): Promise<string>;
  exportWeightCsv(): Promise<string>;
  exportDailyLogsCsv(): Promise<string>;
  importData(jsonData: string): Promise<boolean>;
}

const STORAGE_KEYS = {
  PROFILE: 'seven_profile_v2',
  CURRENT_ARC: 'seven_current_arc_v2',
  ARC_RECAPS: 'seven_arc_recaps_v2',
  DAILY_LOGS: 'seven_daily_logs_v2',
  WEIGHT_ENTRIES: 'seven_weight_entries_v2',
  ACHIEVEMENTS: 'seven_achievements_v2',
  PERSONAL_RECORDS: 'seven_personal_records_v2',
};

export class OfflineDexieRepository implements StorageRepository {
  async getProfile(): Promise<UserProfile> {
    try {
      const record = await db.profiles.get('current');
      if (record?.profile) {
        return { ...DEFAULT_PROFILE, ...record.profile };
      }
      // Check localStorage fallback
      const local = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (local) {
        const parsed = JSON.parse(local);
        const merged = { ...DEFAULT_PROFILE, ...parsed };
        await db.profiles.put({ id: 'current', profile: merged });
        return merged;
      }
      return DEFAULT_PROFILE;
    } catch {
      try {
        const local = localStorage.getItem(STORAGE_KEYS.PROFILE);
        return local ? { ...DEFAULT_PROFILE, ...JSON.parse(local) } : DEFAULT_PROFILE;
      } catch {
        return DEFAULT_PROFILE;
      }
    }
  }

  async saveProfile(profile: UserProfile): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      await db.profiles.put({ id: 'current', profile });
    } catch (e) {
      console.warn('Storage saveProfile warning:', e);
    }
  }

  async getCurrentArc(): Promise<Arc> {
    try {
      const activeArc = await db.arcs.where('isActive').equals(1).first();
      if (activeArc) return activeArc;
      const anyArc = await db.arcs.toCollection().first();
      if (anyArc) return anyArc;

      const local = localStorage.getItem(STORAGE_KEYS.CURRENT_ARC);
      if (local) {
        const parsed: Arc = JSON.parse(local);
        await db.arcs.put(parsed);
        return parsed;
      }
      return DEFAULT_ARC;
    } catch {
      try {
        const local = localStorage.getItem(STORAGE_KEYS.CURRENT_ARC);
        return local ? JSON.parse(local) : DEFAULT_ARC;
      } catch {
        return DEFAULT_ARC;
      }
    }
  }

  async saveCurrentArc(arc: Arc): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_ARC, JSON.stringify(arc));
      await db.arcs.put(arc);
    } catch (e) {
      console.warn('Storage saveCurrentArc warning:', e);
    }
  }

  async getArcRecaps(): Promise<ArcRecap[]> {
    try {
      const recaps = await db.arcRecaps.toArray();
      if (recaps.length > 0) return recaps;
      const local = localStorage.getItem(STORAGE_KEYS.ARC_RECAPS);
      if (local) {
        const parsed: ArcRecap[] = JSON.parse(local);
        for (const r of parsed) {
          await db.arcRecaps.add(r);
        }
        return parsed;
      }
      return [];
    } catch {
      try {
        const local = localStorage.getItem(STORAGE_KEYS.ARC_RECAPS);
        return local ? JSON.parse(local) : [];
      } catch {
        return [];
      }
    }
  }

  async saveArcRecap(recap: ArcRecap): Promise<void> {
    try {
      await db.arcRecaps.add(recap);
      const all = await this.getArcRecaps();
      localStorage.setItem(STORAGE_KEYS.ARC_RECAPS, JSON.stringify(all));
    } catch (e) {
      console.warn('Storage saveArcRecap warning:', e);
    }
  }

  async getDailyLog(date: string): Promise<DailyLog | null> {
    try {
      const record = await db.dailyLogs.get(date);
      if (record) return record;
      const all = await this.getAllDailyLogs();
      return all.find(l => l.date === date) || null;
    } catch {
      const all = await this.getAllDailyLogs();
      return all.find(l => l.date === date) || null;
    }
  }

  async getAllDailyLogs(): Promise<DailyLog[]> {
    try {
      const logs = await db.dailyLogs.toArray();
      if (logs.length > 0) return logs;
      const local = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
      if (local) {
        const parsed: DailyLog[] = JSON.parse(local);
        if (parsed.length > 0) {
          await db.dailyLogs.bulkPut(parsed);
          return parsed;
        }
      }
      return [];
    } catch {
      try {
        const local = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
        return local ? JSON.parse(local) : [];
      } catch {
        return [];
      }
    }
  }

  async saveDailyLog(log: DailyLog): Promise<void> {
    try {
      await db.dailyLogs.put(log);
      const all = await this.getAllDailyLogs();
      localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(all));
    } catch (e) {
      console.warn('Storage saveDailyLog warning:', e);
    }
  }

  async getWeightEntries(): Promise<WeightEntry[]> {
    try {
      const entries = await db.weightEntries.orderBy('date').toArray();
      if (entries.length > 0) return entries;
      const local = localStorage.getItem(STORAGE_KEYS.WEIGHT_ENTRIES);
      if (local) {
        const parsed: WeightEntry[] = JSON.parse(local);
        if (parsed.length > 0) {
          await db.weightEntries.bulkPut(parsed);
          return parsed;
        }
      }
      return INITIAL_WEIGHT_ENTRIES;
    } catch {
      try {
        const local = localStorage.getItem(STORAGE_KEYS.WEIGHT_ENTRIES);
        return local ? JSON.parse(local) : INITIAL_WEIGHT_ENTRIES;
      } catch {
        return INITIAL_WEIGHT_ENTRIES;
      }
    }
  }

  async saveWeightEntry(entry: WeightEntry): Promise<void> {
    try {
      await db.weightEntries.put(entry);
      const entries = await db.weightEntries.orderBy('date').toArray();
      localStorage.setItem(STORAGE_KEYS.WEIGHT_ENTRIES, JSON.stringify(entries));
    } catch (e) {
      console.warn('Storage saveWeightEntry warning:', e);
    }
  }

  async deleteWeightEntry(id: string): Promise<void> {
    try {
      await db.weightEntries.delete(id);
      const entries = await db.weightEntries.orderBy('date').toArray();
      localStorage.setItem(STORAGE_KEYS.WEIGHT_ENTRIES, JSON.stringify(entries));
    } catch (e) {
      console.warn('Storage deleteWeightEntry warning:', e);
    }
  }

  async getAchievements(): Promise<Achievement[]> {
    try {
      const stored = await db.achievements.toArray();
      if (stored.length > 0) {
        return INITIAL_ACHIEVEMENTS.map(initial => {
          const found = stored.find(s => s.id === initial.id);
          return found ? { ...initial, unlockedAt: found.unlockedAt, progress: found.progress } : initial;
        });
      }
      const local = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (local) {
        const parsed: Achievement[] = JSON.parse(local);
        await db.achievements.bulkPut(parsed);
        return INITIAL_ACHIEVEMENTS.map(initial => {
          const found = parsed.find(s => s.id === initial.id);
          return found ? { ...initial, unlockedAt: found.unlockedAt, progress: found.progress } : initial;
        });
      }
      return INITIAL_ACHIEVEMENTS;
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  }

  async saveAchievements(achievements: Achievement[]): Promise<void> {
    try {
      await db.achievements.bulkPut(achievements);
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch (e) {
      console.warn('Storage saveAchievements warning:', e);
    }
  }

  async getPersonalRecords(): Promise<PersonalRecord[]> {
    try {
      const stored = await db.personalRecords.toArray();
      if (stored.length > 0) {
        return stored;
      }
      const local = localStorage.getItem(STORAGE_KEYS.PERSONAL_RECORDS);
      if (local) {
        const parsed: PersonalRecord[] = JSON.parse(local);
        await db.personalRecords.bulkPut(parsed);
        return parsed;
      }
      return INITIAL_PERSONAL_RECORDS;
    } catch {
      return INITIAL_PERSONAL_RECORDS;
    }
  }

  async savePersonalRecords(records: PersonalRecord[]): Promise<void> {
    try {
      await db.personalRecords.bulkPut(records);
      localStorage.setItem(STORAGE_KEYS.PERSONAL_RECORDS, JSON.stringify(records));
    } catch (e) {
      console.warn('Storage savePersonalRecords warning:', e);
    }
  }

  async clearAllData(): Promise<void> {
    try {
      await Promise.all([
        db.profiles.clear(),
        db.arcs.clear(),
        db.arcRecaps.clear(),
        db.dailyLogs.clear(),
        db.weightEntries.clear(),
        db.achievements.clear(),
        db.personalRecords.clear(),
      ]);
    } catch (e) {
      console.warn('Dexie clear error:', e);
    }

    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_ARC);
    localStorage.removeItem(STORAGE_KEYS.ARC_RECAPS);
    localStorage.removeItem(STORAGE_KEYS.DAILY_LOGS);
    localStorage.removeItem(STORAGE_KEYS.WEIGHT_ENTRIES);
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
    localStorage.removeItem(STORAGE_KEYS.PERSONAL_RECORDS);
    localStorage.removeItem('seven_onboarding_completed');
  }

  async exportData(): Promise<string> {
    const profile = await this.getProfile();
    const currentArc = await this.getCurrentArc();
    const arcRecaps = await this.getArcRecaps();
    const dailyLogs = await this.getAllDailyLogs();
    const weightEntries = await this.getWeightEntries();
    const achievements = await this.getAchievements();
    const personalRecords = await this.getPersonalRecords();

    return JSON.stringify({
      schemaVersion: 3,
      appName: 'SEVEN',
      tagline: 'Each day is a step towards greatness.',
      exportedAt: new Date().toISOString(),
      profile,
      currentArc,
      arcRecaps,
      dailyLogs,
      weightEntries,
      achievements,
      personalRecords,
    }, null, 2);
  }

  async exportWeightCsv(): Promise<string> {
    const entries = await this.getWeightEntries();
    const rows = ['Date,Weight,Note,Timestamp'];
    for (const e of entries) {
      const cleanNote = (e.note || '').replace(/"/g, '""');
      rows.push(`"${e.date}",${e.weight},"${cleanNote}","${e.createdAt}"`);
    }
    return rows.join('\n');
  }

  async exportDailyLogsCsv(): Promise<string> {
    const logs = await this.getAllDailyLogs();
    const rows = ['Date,CorePointsEarned,CorePointsAvailable,CorePerformancePercent,TotalXP,Steps,SleepHours,FocusRating,EnergyDrink,ConqueredDay,PerfectDay'];
    for (const l of logs) {
      rows.push(`"${l.date}",${l.corePointsEarned},${l.corePointsAvailable},${l.corePerformancePercent},${l.totalXp},${l.steps},${l.sleepHours},${l.focusRating},${l.energyDrinkConsumed},${l.isConqueredDay},${l.isPerfectDay}`);
    }
    return rows.join('\n');
  }

  async importData(jsonData: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.profile) {
        await this.saveProfile(parsed.profile);
      }
      if (parsed.currentArc) {
        await this.saveCurrentArc(parsed.currentArc);
      }
      if (Array.isArray(parsed.arcRecaps)) {
        await db.arcRecaps.clear();
        for (const r of parsed.arcRecaps) {
          await db.arcRecaps.add(r);
        }
        localStorage.setItem(STORAGE_KEYS.ARC_RECAPS, JSON.stringify(parsed.arcRecaps));
      }
      if (Array.isArray(parsed.dailyLogs)) {
        await db.dailyLogs.clear();
        await db.dailyLogs.bulkPut(parsed.dailyLogs);
        localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(parsed.dailyLogs));
      }
      if (Array.isArray(parsed.weightEntries)) {
        await db.weightEntries.clear();
        await db.weightEntries.bulkPut(parsed.weightEntries);
        localStorage.setItem(STORAGE_KEYS.WEIGHT_ENTRIES, JSON.stringify(parsed.weightEntries));
      }
      if (Array.isArray(parsed.achievements)) {
        await this.saveAchievements(parsed.achievements);
      }
      if (Array.isArray(parsed.personalRecords)) {
        await this.savePersonalRecords(parsed.personalRecords);
      }
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  }
}

export const repository: StorageRepository = new OfflineDexieRepository();
