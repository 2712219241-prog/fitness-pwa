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
});
