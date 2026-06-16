import { describe, expect, it } from 'vitest';
import { BODY_PARTS, DEFAULT_EXERCISES } from './defaultExercises';

describe('default exercises', () => {
  it('contains the five requested body parts', () => {
    expect(BODY_PARTS.map((part) => part.id)).toEqual(['chest', 'shoulders', 'back', 'arms', 'abs']);
  });

  it('ships at least one preset exercise for every body part', () => {
    for (const part of BODY_PARTS) {
      expect(DEFAULT_EXERCISES.some((exercise) => exercise.bodyPart === part.id)).toBe(true);
    }
  });
});
