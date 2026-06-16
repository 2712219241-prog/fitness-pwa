import type { BodyPart, Exercise } from './types';

export const BODY_PARTS: Array<{ id: BodyPart; label: string; shortLabel: string }> = [
  { id: 'chest', label: '胸部', shortLabel: '胸' },
  { id: 'shoulders', label: '肩部', shortLabel: '肩' },
  { id: 'back', label: '背部', shortLabel: '背' },
  { id: 'arms', label: '手臂', shortLabel: '臂' },
  { id: 'abs', label: '腹部', shortLabel: '腹' }
];

const createdAt = '2026-06-16T00:00:00.000Z';

export const DEFAULT_EXERCISES: Exercise[] = [
  { id: 'ex-dumbbell-bench-press', name: '哑铃卧推', bodyPart: 'chest', illustrationKey: 'press', createdAt, updatedAt: createdAt, deletedAt: null },
  { id: 'ex-cable-fly', name: '绳索夹胸', bodyPart: 'chest', illustrationKey: 'fly', createdAt, updatedAt: createdAt, deletedAt: null },
  { id: 'ex-shoulder-press', name: '肩推', bodyPart: 'shoulders', illustrationKey: 'shoulder-press', createdAt, updatedAt: createdAt, deletedAt: null },
  { id: 'ex-lateral-raise', name: '侧平举', bodyPart: 'shoulders', illustrationKey: 'raise', createdAt, updatedAt: createdAt, deletedAt: null },
  { id: 'ex-lat-pulldown', name: '高位下拉', bodyPart: 'back', illustrationKey: 'pulldown', createdAt, updatedAt: createdAt, deletedAt: null },
  { id: 'ex-row', name: '坐姿划船', bodyPart: 'back', illustrationKey: 'row', createdAt, updatedAt: createdAt, deletedAt: null },
  { id: 'ex-curl', name: '弯举', bodyPart: 'arms', illustrationKey: 'curl', createdAt, updatedAt: createdAt, deletedAt: null },
  { id: 'ex-triceps-pushdown', name: '绳索下压', bodyPart: 'arms', illustrationKey: 'pushdown', createdAt, updatedAt: createdAt, deletedAt: null },
  { id: 'ex-crunch', name: '卷腹', bodyPart: 'abs', illustrationKey: 'crunch', createdAt, updatedAt: createdAt, deletedAt: null },
  { id: 'ex-plank', name: '平板支撑', bodyPart: 'abs', illustrationKey: 'plank', createdAt, updatedAt: createdAt, deletedAt: null }
];
