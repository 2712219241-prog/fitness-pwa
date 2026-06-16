import { BODY_PARTS } from './defaultExercises';
import { isWithinDateRange } from './date';
import type { AppBackup, DailyRecord, Exercise } from './types';

const CSV_HEADER = [
  '日期',
  '记录类型',
  '部位',
  '动作名称',
  '第几组',
  '重量',
  '次数',
  '组记录时间',
  '爬坡时长',
  '爬坡备注',
  '体重',
  '手臂围',
  '腰围'
];

function csvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function bodyPartLabel(id: string): string {
  return BODY_PARTS.find((part) => part.id === id)?.label ?? id;
}

export function buildCsv(records: DailyRecord[], exercises: Exercise[], startDate: string, endDate: string): string {
  const exerciseById = new Map(exercises.map((exercise) => [exercise.id, exercise]));
  const rows: Array<Array<string | number | null | undefined>> = [CSV_HEADER];

  for (const record of records.filter((item) => isWithinDateRange(item.date, startDate, endDate)).sort((a, b) => a.date.localeCompare(b.date))) {
    record.strengthSets.forEach((set, index) => {
      const exercise = exerciseById.get(set.exerciseId);
      rows.push([
        record.date,
        '力量',
        bodyPartLabel(set.bodyPart),
        exercise?.name ?? set.exerciseId,
        index + 1,
        set.weight,
        set.reps,
        set.timestamp,
        '',
        '',
        '',
        '',
        ''
      ]);
    });

    for (const climb of record.climbEntries) {
      rows.push([record.date, '爬坡', '', '', '', '', '', '', climb.durationMinutes, climb.notes, '', '', '']);
    }

    if (record.bodyMeasurement) {
      rows.push([
        record.date,
        '身体数据',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        record.bodyMeasurement.weightKg,
        record.bodyMeasurement.armCm,
        record.bodyMeasurement.waistCm
      ]);
    }
  }

  return rows.map((row) => row.map(csvCell).join(',')).join('\n');
}

export function buildJsonBackup(records: DailyRecord[], exercises: Exercise[], exportedAt = new Date().toISOString()): AppBackup {
  return {
    version: 1,
    exportedAt,
    exercises,
    dailyRecords: records
  };
}

export function parseJsonBackup(text: string): AppBackup {
  const data = JSON.parse(text) as Partial<AppBackup>;
  if (data.version !== 1 || !Array.isArray(data.exercises) || !Array.isArray(data.dailyRecords) || typeof data.exportedAt !== 'string') {
    throw new Error('备份文件格式不正确');
  }
  return data as AppBackup;
}
