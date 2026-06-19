import { beforeEach, describe, expect, it } from 'vitest';
import { createFitnessRepository } from './db';

describe('fitness repository', () => {
  beforeEach(async () => {
    await indexedDB.deleteDatabase('fitness-test');
  });

  it('seeds default exercises on first load', async () => {
    const repo = createFitnessRepository('fitness-test');
    const exercises = await repo.listExercises();
    expect(exercises.length).toBeGreaterThan(0);
    expect(exercises.some((exercise) => exercise.name === '哑铃卧推')).toBe(true);
    repo.close();
  });

  it('saves a strength set under the selected date', async () => {
    const repo = createFitnessRepository('fitness-test');
    const exercises = await repo.listExercises();
    await repo.addStrengthSet('2026-06-16', {
      exerciseId: exercises[0].id,
      bodyPart: exercises[0].bodyPart,
      weight: 30,
      reps: 8,
      timestamp: '2026-06-16T10:00:00.000Z'
    });
    const records = await repo.listDailyRecords();
    expect(records[0].date).toBe('2026-06-16');
    expect(records[0].strengthSets[0].weight).toBe(30);
    repo.close();
  });

  it('saves a daily note under the selected date', async () => {
    const repo = createFitnessRepository('fitness-test');
    await repo.saveDailyNote('2026-06-16', '今天状态很好，卧推有进步。');
    const records = await repo.listDailyRecords();
    expect(records[0].date).toBe('2026-06-16');
    expect(records[0].dailyNote).toBe('今天状态很好，卧推有进步。');
    repo.close();
  });

  it('adds and soft deletes a custom exercise', async () => {
    const repo = createFitnessRepository('fitness-test');
    const created = await repo.addExercise('上斜卧推', 'chest');
    expect(created.name).toBe('上斜卧推');
    expect(created.bodyPart).toBe('chest');

    let exercises = await repo.listExercises();
    expect(exercises.some((exercise) => exercise.id === created.id)).toBe(true);

    await repo.deleteExercise(created.id);
    exercises = await repo.listExercises();
    expect(exercises.some((exercise) => exercise.id === created.id)).toBe(false);
    repo.close();
  });

  it('restores a soft deleted exercise when the same name is added again', async () => {
    const repo = createFitnessRepository('fitness-test');
    const created = await repo.addExercise('上斜卧推', 'chest');
    await repo.deleteExercise(created.id);

    const restored = await repo.addExercise('上斜卧推', 'chest');
    const exercises = await repo.listExercises();

    expect(restored.id).toBe(created.id);
    expect(restored.deletedAt).toBeNull();
    expect(exercises.some((exercise) => exercise.id === created.id)).toBe(true);
    repo.close();
  });
});
