import { isWithinDateRange } from './date';
import type { DailyRecord } from './types';

export interface BodyTrendRow {
  date: string;
  weightKg: number | null;
  armCm: number | null;
  waistCm: number | null;
}

export interface StrengthTrendRow {
  date: string;
  maxWeight: number;
  totalReps: number;
  totalVolume: number;
}

export function buildBodyTrend(records: DailyRecord[], startDate: string, endDate: string): BodyTrendRow[] {
  return records
    .filter((record) => record.bodyMeasurement && isWithinDateRange(record.date, startDate, endDate))
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((record) => ({
      date: record.date,
      weightKg: record.bodyMeasurement?.weightKg ?? null,
      armCm: record.bodyMeasurement?.armCm ?? null,
      waistCm: record.bodyMeasurement?.waistCm ?? null
    }));
}

export function buildStrengthTrend(
  records: DailyRecord[],
  exerciseId: string,
  startDate: string,
  endDate: string
): StrengthTrendRow[] {
  return records
    .filter((record) => isWithinDateRange(record.date, startDate, endDate))
    .map((record) => {
      const sets = record.strengthSets.filter((set) => set.exerciseId === exerciseId);
      if (sets.length === 0) return null;
      return {
        date: record.date,
        maxWeight: Math.max(...sets.map((set) => set.weight)),
        totalReps: sets.reduce((sum, set) => sum + set.reps, 0),
        totalVolume: sets.reduce((sum, set) => sum + set.weight * set.reps, 0)
      };
    })
    .filter((row): row is StrengthTrendRow => row !== null)
    .sort((a, b) => a.date.localeCompare(b.date));
}
