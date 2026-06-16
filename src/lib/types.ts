export type BodyPart = 'chest' | 'shoulders' | 'back' | 'arms' | 'abs';
export type PageId = 'record' | 'stats' | 'export';

export interface Exercise {
  id: string;
  name: string;
  bodyPart: BodyPart;
  illustrationKey: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface StrengthSet {
  id: string;
  exerciseId: string;
  bodyPart: BodyPart;
  weight: number;
  reps: number;
  timestamp: string;
}

export interface ClimbEntry {
  id: string;
  durationMinutes: number;
  notes: string;
  timestamp: string;
}

export interface BodyMeasurement {
  date: string;
  weightKg: number | null;
  armCm: number | null;
  waistCm: number | null;
  updatedAt: string;
}

export interface DailyRecord {
  date: string;
  strengthSets: StrengthSet[];
  climbEntries: ClimbEntry[];
  bodyMeasurement: BodyMeasurement | null;
  updatedAt: string;
}

export interface AppBackup {
  version: 1;
  exportedAt: string;
  exercises: Exercise[];
  dailyRecords: DailyRecord[];
}
