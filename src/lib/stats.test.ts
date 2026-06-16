import { describe, expect, it } from 'vitest';
import type { DailyRecord } from './types';
import { buildBodyTrend, buildStrengthTrend } from './stats';

const records: DailyRecord[] = [
  {
    date: '2026-06-01',
    strengthSets: [
      { id: 's1', exerciseId: 'bench', bodyPart: 'chest', weight: 20, reps: 10, timestamp: '2026-06-01T10:00:00.000Z' },
      { id: 's2', exerciseId: 'bench', bodyPart: 'chest', weight: 25, reps: 8, timestamp: '2026-06-01T10:05:00.000Z' }
    ],
    climbEntries: [],
    bodyMeasurement: { date: '2026-06-01', weightKg: 80, armCm: 34, waistCm: 88, updatedAt: '2026-06-01T10:00:00.000Z' },
    updatedAt: '2026-06-01T10:05:00.000Z'
  },
  {
    date: '2026-06-16',
    strengthSets: [
      { id: 's3', exerciseId: 'bench', bodyPart: 'chest', weight: 30, reps: 6, timestamp: '2026-06-16T10:00:00.000Z' },
      { id: 's4', exerciseId: 'curl', bodyPart: 'arms', weight: 12, reps: 12, timestamp: '2026-06-16T10:10:00.000Z' }
    ],
    climbEntries: [],
    bodyMeasurement: { date: '2026-06-16', weightKg: 78.5, armCm: 35, waistCm: 86, updatedAt: '2026-06-16T10:00:00.000Z' },
    updatedAt: '2026-06-16T10:10:00.000Z'
  }
];

describe('stats', () => {
  it('builds body trend rows within a date range', () => {
    expect(buildBodyTrend(records, '2026-06-01', '2026-06-16')).toEqual([
      { date: '2026-06-01', weightKg: 80, armCm: 34, waistCm: 88 },
      { date: '2026-06-16', weightKg: 78.5, armCm: 35, waistCm: 86 }
    ]);
  });

  it('builds strength trend rows for one exercise', () => {
    expect(buildStrengthTrend(records, 'bench', '2026-06-01', '2026-06-16')).toEqual([
      { date: '2026-06-01', maxWeight: 25, totalReps: 18, totalVolume: 400 },
      { date: '2026-06-16', maxWeight: 30, totalReps: 6, totalVolume: 180 }
    ]);
  });
});
