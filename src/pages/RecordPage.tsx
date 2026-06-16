import { CalendarDays, ChevronRight, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { IconTile } from '../components/IconTile';
import { BODY_PARTS } from '../lib/defaultExercises';
import { formatChineseDate } from '../lib/date';
import type { BodyMeasurement, BodyPart, ClimbEntry, DailyRecord, Exercise, StrengthSet } from '../lib/types';

interface RecordPageProps {
  date: string;
  exercises: Exercise[];
  records: DailyRecord[];
  onDateChange: (date: string) => void;
  onAddStrengthSet: (date: string, set: Omit<StrengthSet, 'id'>) => Promise<void> | void;
  onDeleteStrengthSet: (date: string, setId: string) => Promise<void> | void;
  onAddClimbEntry: (date: string, entry: Omit<ClimbEntry, 'id'>) => Promise<void> | void;
  onSaveBodyMeasurement: (measurement: BodyMeasurement) => Promise<void> | void;
}

export function RecordPage({
  date,
  exercises,
  records,
  onDateChange,
  onAddStrengthSet
}: RecordPageProps) {
  const [selectedPart, setSelectedPart] = useState<BodyPart>('chest');
  const record = records.find((item) => item.date === date);
  const strengthCount = record?.strengthSets.length ?? 0;
  const climbMinutes = record?.climbEntries.reduce((sum, entry) => sum + entry.durationMinutes, 0) ?? 0;
  const selectedExercises = useMemo(() => exercises.filter((exercise) => exercise.bodyPart === selectedPart), [exercises, selectedPart]);

  async function quickAddSet(exercise: Exercise) {
    await onAddStrengthSet(date, {
      exerciseId: exercise.id,
      bodyPart: exercise.bodyPart,
      weight: 0,
      reps: 0,
      timestamp: new Date().toISOString()
    });
  }

  return (
    <section className="page record-page">
      <header className="page-header">
        <h1>记录</h1>
      </header>

      <section className="summary-card">
        <div className="summary-title">
          <span className="status-dot" />
          <strong>{strengthCount === 0 && climbMinutes === 0 ? '今天还没记录' : '今日已记录'}</strong>
          <span>{formatChineseDate(date)}</span>
        </div>
        <div className="summary-grid">
          <div>
            <b>{strengthCount}</b>
            <span>项</span>
            <small>力量记录</small>
          </div>
          <div>
            <b>{climbMinutes}</b>
            <span>分</span>
            <small>爬坡时长</small>
          </div>
          <div>
            <button type="button">去填写</button>
            <small>身体数据</small>
          </div>
        </div>
      </section>

      <div className="record-toolbar">
        <label>
          <CalendarDays size={18} aria-hidden="true" />
          <span>补录</span>
          <input aria-label="补录日期" type="date" value={date} onChange={(event) => onDateChange(event.target.value)} />
        </label>
      </div>

      <section className="feature-card outlined">
        <div className="feature-icon">力</div>
        <div>
          <h2>力量训练</h2>
          <p>胸 / 肩 / 背 / 手臂 / 腹部</p>
        </div>
        <ChevronRight aria-hidden="true" />
      </section>

      <div className="tile-grid">
        {BODY_PARTS.map((part) => (
          <IconTile key={part.id} label={part.label} shortLabel={part.shortLabel} onClick={() => setSelectedPart(part.id)} />
        ))}
      </div>

      <section className="card-list">
        {selectedExercises.map((exercise) => (
          <article className="exercise-card" key={exercise.id}>
            <div className="exercise-art">{exercise.name.slice(0, 1)}</div>
            <div>
              <h3>{exercise.name}</h3>
              <p>{BODY_PARTS.find((part) => part.id === exercise.bodyPart)?.label}</p>
            </div>
            <button type="button" aria-label={`添加${exercise.name}一组`} onClick={() => void quickAddSet(exercise)}>
              <Plus aria-hidden="true" />
            </button>
          </article>
        ))}
      </section>

      <section className="plain-card">
        <h2>爬坡</h2>
        <p>记录时长和备注。</p>
      </section>

      <section className="plain-card">
        <h2>身体数据</h2>
        <div className="metric-grid">
          <span>体重 kg</span>
          <span>手臂 cm</span>
          <span>腰围 cm</span>
        </div>
      </section>
    </section>
  );
}
