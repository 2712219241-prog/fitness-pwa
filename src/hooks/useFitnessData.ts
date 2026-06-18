import { useCallback, useEffect, useMemo, useState } from 'react';
import { createFitnessRepository } from '../lib/db';
import type { BodyMeasurement, ClimbEntry, DailyRecord, Exercise, StrengthSet } from '../lib/types';

const repository = createFitnessRepository();

export function useFitnessData() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [nextExercises, nextRecords] = await Promise.all([repository.listExercises(), repository.listDailyRecords()]);
    setExercises(nextExercises);
    setRecords(nextRecords);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const actions = useMemo(
    () => ({
      async addStrengthSet(date: string, set: Omit<StrengthSet, 'id'>) {
        await repository.addStrengthSet(date, set);
        await refresh();
      },
      async deleteStrengthSet(date: string, setId: string) {
        await repository.deleteStrengthSet(date, setId);
        await refresh();
      },
      async addClimbEntry(date: string, entry: Omit<ClimbEntry, 'id'>) {
        await repository.addClimbEntry(date, entry);
        await refresh();
      },
      async saveBodyMeasurement(measurement: BodyMeasurement) {
        await repository.saveBodyMeasurement(measurement);
        await refresh();
      },
      async saveDailyNote(date: string, dailyNote: string) {
        await repository.saveDailyNote(date, dailyNote);
        await refresh();
      },
      async replaceAll(nextExercises: Exercise[], nextRecords: DailyRecord[]) {
        await repository.replaceAll(nextExercises, nextRecords);
        await refresh();
      }
    }),
    [refresh]
  );

  return { exercises, records, loading, actions };
}
