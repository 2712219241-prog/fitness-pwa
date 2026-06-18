import { describe, expect, it } from 'vitest';
import type { AppBackup, DailyRecord, Exercise } from './types';
import { buildCsv, buildJsonBackup, parseJsonBackup } from './export';

const exercises: Exercise[] = [
  { id: 'bench', name: '哑铃卧推', bodyPart: 'chest', illustrationKey: 'press', createdAt: '2026-06-01T00:00:00.000Z', updatedAt: '2026-06-01T00:00:00.000Z', deletedAt: null }
];

const records: DailyRecord[] = [
  {
    date: '2026-06-16',
    strengthSets: [{ id: 's1', exerciseId: 'bench', bodyPart: 'chest', weight: 30, reps: 8, timestamp: '2026-06-16T10:00:00.000Z' }],
    climbEntries: [{ id: 'c1', durationMinutes: 35, notes: '坡度 12', timestamp: '2026-06-16T11:00:00.000Z' }],
    bodyMeasurement: { date: '2026-06-16', weightKg: 78.5, armCm: 35, waistCm: 86, updatedAt: '2026-06-16T09:00:00.000Z' },
    dailyNote: '今天状态很好，卧推有进步。',
    updatedAt: '2026-06-16T11:00:00.000Z'
  }
];

describe('export helpers', () => {
  it('builds a csv with strength, climb, and body rows', () => {
    const csv = buildCsv(records, exercises, '2026-06-01', '2026-06-30');
    expect(csv).toContain('日期,记录类型,部位,动作名称,第几组,重量,次数,组记录时间,爬坡时长,爬坡备注,体重,手臂围,腰围');
    expect(csv).toContain('2026-06-16,力量,胸部,哑铃卧推,1,30,8,2026-06-16T10:00:00.000Z,,,,,');
    expect(csv).toContain('2026-06-16,爬坡,,,,,,,35,坡度 12,,,');
    expect(csv).toContain('2026-06-16,身体数据,,,,,,,,,78.5,35,86');
    expect(csv).toContain('2026-06-16,每日想说的话,,,,,,,,,,,,今天状态很好，卧推有进步。');
  });

  it('round trips a json backup', () => {
    const backup = buildJsonBackup(records, exercises, '2026-06-16T12:00:00.000Z');
    expect(parseJsonBackup(JSON.stringify(backup))).toEqual<AppBackup>(backup);
  });

  it('rejects invalid json backup shape', () => {
    expect(() => parseJsonBackup('{"version":2}')).toThrow('备份文件格式不正确');
  });
});
