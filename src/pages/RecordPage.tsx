import { CalendarDays, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
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
  onSaveDailyNote: (date: string, dailyNote: string) => Promise<void> | void;
  onAddExercise: (name: string, bodyPart: BodyPart) => Promise<void> | void;
  onDeleteExercise: (exerciseId: string) => Promise<void> | void;
  maxDate: string;
}

export function RecordPage({
  date,
  exercises,
  records,
  onDateChange,
  onAddStrengthSet,
  onDeleteStrengthSet,
  onAddClimbEntry,
  onSaveBodyMeasurement,
  onSaveDailyNote,
  onAddExercise,
  onDeleteExercise,
  maxDate
}: RecordPageProps) {
  const [selectedPart, setSelectedPart] = useState<BodyPart>('chest');
  const [newExerciseName, setNewExerciseName] = useState('');
  const [strengthDrafts, setStrengthDrafts] = useState<Record<string, { weight: string; reps: string; sets: string }>>({});
  const [climbDuration, setClimbDuration] = useState('');
  const [climbNotes, setClimbNotes] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [armCm, setArmCm] = useState('');
  const [waistCm, setWaistCm] = useState('');
  const record = records.find((item) => item.date === date);
  const [dailyNote, setDailyNote] = useState(record?.dailyNote ?? '');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);
  const strengthCount = record?.strengthSets.length ?? 0;
  const climbMinutes = record?.climbEntries.reduce((sum, entry) => sum + entry.durationMinutes, 0) ?? 0;
  const selectedExercises = useMemo(() => exercises.filter((exercise) => exercise.bodyPart === selectedPart), [exercises, selectedPart]);

  useEffect(() => {
    setDailyNote(record?.dailyNote ?? '');
  }, [date, record?.dailyNote]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  function showToast(message: string) {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToastMessage(message);
    toastTimer.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimer.current = null;
    }, 500);
  }

  async function quickAddSet(exercise: Exercise) {
    const draft = strengthDrafts[exercise.id] ?? { weight: '', reps: '', sets: '1' };
    const weight = Number(draft.weight);
    const reps = Number(draft.reps);
    const setCount = Number(draft.sets);
    if (!Number.isFinite(weight) || !Number.isFinite(reps) || !Number.isFinite(setCount) || weight <= 0 || reps <= 0 || setCount <= 0) return;
    for (let index = 0; index < Math.floor(setCount); index += 1) {
      await onAddStrengthSet(date, {
        exerciseId: exercise.id,
        bodyPart: exercise.bodyPart,
        weight,
        reps,
        timestamp: new Date().toISOString()
      });
    }
    setStrengthDrafts((current) => ({ ...current, [exercise.id]: { weight: draft.weight, reps: draft.reps, sets: '1' } }));
    showToast('保存成功');
  }

  async function saveClimb() {
    const durationMinutes = Number(climbDuration);
    if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) return;
    await onAddClimbEntry(date, {
      durationMinutes,
      notes: climbNotes.trim(),
      timestamp: new Date().toISOString()
    });
    setClimbDuration('');
    setClimbNotes('');
    showToast('保存成功');
  }

  async function saveBodyData() {
    await onSaveBodyMeasurement({
      date,
      weightKg: weightKg === '' ? null : Number(weightKg),
      armCm: armCm === '' ? null : Number(armCm),
      waistCm: waistCm === '' ? null : Number(waistCm),
      updatedAt: new Date().toISOString()
    });
    showToast('保存成功');
  }

  async function saveDailyNoteText() {
    await onSaveDailyNote(date, dailyNote);
    showToast('保存成功');
  }

  async function addCustomExercise() {
    const name = newExerciseName.trim();
    if (!name) return;
    await onAddExercise(name, selectedPart);
    setNewExerciseName('');
    showToast('保存成功');
  }

  async function deleteCustomExercise(exercise: Exercise) {
    const ok = window.confirm(`确定删除“${exercise.name}”吗？以前记录的数据会保留。`);
    if (!ok) return;
    await onDeleteExercise(exercise.id);
    showToast('删除成功');
  }

  return (
    <section className="page record-page">
      {toastMessage ? (
        <div className="feedback-toast" role="status" aria-live="polite">
          {toastMessage}
        </div>
      ) : null}
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
          <input aria-label="补录日期" type="date" value={date} max={maxDate} onChange={(event) => onDateChange(event.target.value)} />
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

      <section className="exercise-manager">
        <div>
          <h2>动作管理</h2>
          <p>{BODY_PARTS.find((part) => part.id === selectedPart)?.label}动作</p>
        </div>
        <label>
          <span>新增动作</span>
          <input
            aria-label="新增动作名称"
            type="text"
            placeholder="例如：上斜卧推"
            value={newExerciseName}
            onChange={(event) => setNewExerciseName(event.target.value)}
          />
        </label>
        <button type="button" onClick={() => void addCustomExercise()}>
          添加动作
        </button>
      </section>

      <section className="card-list">
        {selectedExercises.map((exercise) => (
          <article className="exercise-card" key={exercise.id}>
            <div className="exercise-card-top">
              <div className="exercise-art">{exercise.name.slice(0, 1)}</div>
              <div>
                <h3>{exercise.name}</h3>
                <p>{BODY_PARTS.find((part) => part.id === exercise.bodyPart)?.label}</p>
              </div>
              <button className="exercise-delete-button" type="button" aria-label={`删除${exercise.name}`} onClick={() => void deleteCustomExercise(exercise)}>
                <Trash2 aria-hidden="true" size={16} />
              </button>
            </div>
            <div className="set-entry-grid">
              <label>
                <span>重量</span>
                <input
                  aria-label={`${exercise.name}重量`}
                  inputMode="decimal"
                  type="number"
                  min="0"
                  placeholder="kg"
                  value={strengthDrafts[exercise.id]?.weight ?? ''}
                  onChange={(event) =>
                    setStrengthDrafts((current) => ({
                      ...current,
                      [exercise.id]: { weight: event.target.value, reps: current[exercise.id]?.reps ?? '', sets: current[exercise.id]?.sets ?? '1' }
                    }))
                  }
                />
              </label>
              <label>
                <span>次数</span>
                <input
                  aria-label={`${exercise.name}次数`}
                  inputMode="numeric"
                  type="number"
                  min="0"
                  placeholder="次"
                  value={strengthDrafts[exercise.id]?.reps ?? ''}
                  onChange={(event) =>
                    setStrengthDrafts((current) => ({
                      ...current,
                      [exercise.id]: { weight: current[exercise.id]?.weight ?? '', reps: event.target.value, sets: current[exercise.id]?.sets ?? '1' }
                    }))
                  }
                />
              </label>
              <label>
                <span>组数</span>
                <input
                  aria-label={`${exercise.name}组数`}
                  inputMode="numeric"
                  type="number"
                  min="1"
                  placeholder="组"
                  value={strengthDrafts[exercise.id]?.sets ?? '1'}
                  onChange={(event) =>
                    setStrengthDrafts((current) => ({
                      ...current,
                      [exercise.id]: { weight: current[exercise.id]?.weight ?? '', reps: current[exercise.id]?.reps ?? '', sets: event.target.value }
                    }))
                  }
                />
              </label>
              <button className="save-set-button" type="button" onClick={() => void quickAddSet(exercise)}>
                <Plus aria-hidden="true" size={18} />
                <span>保存记录</span>
              </button>
            </div>
            <div className="set-list">
              {(record?.strengthSets.filter((set) => set.exerciseId === exercise.id) ?? []).map((set, index) => (
                <div className="set-row" key={set.id}>
                  <span>第{index + 1}组</span>
                  <strong>
                    {set.weight}kg x {set.reps}
                  </strong>
                  <small>{new Date(set.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</small>
                  <button type="button" onClick={() => void onDeleteStrengthSet(date, set.id)}>
                    删除
                  </button>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="plain-card">
        <h2>爬坡</h2>
        <p>记录时长和备注。</p>
        <div className="form-grid climb-form">
          <label>
            <span>时长</span>
            <input aria-label="爬坡时长" inputMode="decimal" type="number" min="0" placeholder="分钟" value={climbDuration} onChange={(event) => setClimbDuration(event.target.value)} />
          </label>
          <label>
            <span>备注</span>
            <input aria-label="爬坡备注" type="text" placeholder="坡度、速度等" value={climbNotes} onChange={(event) => setClimbNotes(event.target.value)} />
          </label>
          <button type="button" onClick={() => void saveClimb()}>
            保存爬坡
          </button>
        </div>
        <div className="set-list">
          {(record?.climbEntries ?? []).map((entry) => (
            <div className="set-row" key={entry.id}>
              <span>{entry.durationMinutes}分钟</span>
              <strong>{entry.notes || '无备注'}</strong>
              <small>{new Date(entry.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="plain-card">
        <h2>身体数据</h2>
        <div className="metric-grid">
          <label>
            <span>体重</span>
            <input aria-label="体重" inputMode="decimal" type="number" min="0" placeholder="kg" value={weightKg} onChange={(event) => setWeightKg(event.target.value)} />
          </label>
          <label>
            <span>手臂</span>
            <input aria-label="手臂围" inputMode="decimal" type="number" min="0" placeholder="cm" value={armCm} onChange={(event) => setArmCm(event.target.value)} />
          </label>
          <label>
            <span>腰围</span>
            <input aria-label="腰围" inputMode="decimal" type="number" min="0" placeholder="cm" value={waistCm} onChange={(event) => setWaistCm(event.target.value)} />
          </label>
        </div>
        <button className="primary-action" type="button" onClick={() => void saveBodyData()}>
          保存身体数据
        </button>
      </section>

      <section className="plain-card memo-card">
        <h2>每日想说的话</h2>
        <p>写下今天的训练感受、状态或想提醒自己的事。</p>
        <label className="memo-field">
          <span>内容</span>
          <textarea
            aria-label="每日想说的话"
            rows={5}
            placeholder="今天想说点什么..."
            value={dailyNote}
            onChange={(event) => setDailyNote(event.target.value)}
          />
        </label>
        <button className="primary-action" type="button" onClick={() => void saveDailyNoteText()}>
          保存想说的话
        </button>
      </section>
    </section>
  );
}
