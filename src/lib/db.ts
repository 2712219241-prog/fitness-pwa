import Dexie, { type Table } from 'dexie';
import { DEFAULT_EXERCISES } from './defaultExercises';
import type { BodyMeasurement, ClimbEntry, DailyRecord, Exercise, StrengthSet } from './types';

type NewStrengthSet = Omit<StrengthSet, 'id'>;
type NewClimbEntry = Omit<ClimbEntry, 'id'>;

class FitnessDatabase extends Dexie {
  exercises!: Table<Exercise, string>;
  dailyRecords!: Table<DailyRecord, string>;

  constructor(name: string) {
    super(name);
    this.version(1).stores({
      exercises: 'id, bodyPart, deletedAt',
      dailyRecords: 'date, updatedAt'
    });
  }
}

function id(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

function emptyRecord(date: string, now: string): DailyRecord {
  return {
    date,
    strengthSets: [],
    climbEntries: [],
    bodyMeasurement: null,
    updatedAt: now
  };
}

export function createFitnessRepository(dbName = 'fitness-pwa') {
  const db = new FitnessDatabase(dbName);

  async function ensureSeeded() {
    if ((await db.exercises.count()) === 0) {
      await db.exercises.bulkPut(DEFAULT_EXERCISES);
    }
  }

  async function getOrCreateRecord(date: string, now = new Date().toISOString()) {
    const existing = await db.dailyRecords.get(date);
    if (existing) return existing;
    const created = emptyRecord(date, now);
    await db.dailyRecords.put(created);
    return created;
  }

  return {
    close() {
      db.close();
    },
    async listExercises() {
      await ensureSeeded();
      const exercises = await db.exercises.toArray();
      return exercises.filter((exercise) => exercise.deletedAt === null);
    },
    async saveExercise(exercise: Exercise) {
      await db.exercises.put(exercise);
    },
    async listDailyRecords() {
      return db.dailyRecords.orderBy('date').toArray();
    },
    async addStrengthSet(date: string, set: NewStrengthSet) {
      const now = new Date().toISOString();
      const record = await getOrCreateRecord(date, now);
      const next: DailyRecord = {
        ...record,
        strengthSets: [...record.strengthSets, { ...set, id: id('set') }],
        updatedAt: now
      };
      await db.dailyRecords.put(next);
      return next;
    },
    async deleteStrengthSet(date: string, setId: string) {
      const record = await getOrCreateRecord(date);
      const next = { ...record, strengthSets: record.strengthSets.filter((set) => set.id !== setId), updatedAt: new Date().toISOString() };
      await db.dailyRecords.put(next);
      return next;
    },
    async addClimbEntry(date: string, entry: NewClimbEntry) {
      const now = new Date().toISOString();
      const record = await getOrCreateRecord(date, now);
      const next = { ...record, climbEntries: [...record.climbEntries, { ...entry, id: id('climb') }], updatedAt: now };
      await db.dailyRecords.put(next);
      return next;
    },
    async saveBodyMeasurement(measurement: BodyMeasurement) {
      const record = await getOrCreateRecord(measurement.date, measurement.updatedAt);
      const next = { ...record, bodyMeasurement: measurement, updatedAt: measurement.updatedAt };
      await db.dailyRecords.put(next);
      return next;
    },
    async replaceAll(exercises: Exercise[], dailyRecords: DailyRecord[]) {
      await db.transaction('rw', db.exercises, db.dailyRecords, async () => {
        await db.exercises.clear();
        await db.dailyRecords.clear();
        await db.exercises.bulkPut(exercises);
        await db.dailyRecords.bulkPut(dailyRecords);
      });
    }
  };
}

export type FitnessRepository = ReturnType<typeof createFitnessRepository>;
