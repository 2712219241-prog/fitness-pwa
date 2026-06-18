import { useMemo, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BODY_PARTS } from '../lib/defaultExercises';
import { getTodayKey } from '../lib/date';
import { buildBodyTrend, buildStrengthTrend } from '../lib/stats';
import type { DailyRecord, Exercise } from '../lib/types';

interface StatsPageProps {
  records: DailyRecord[];
  exercises: Exercise[];
}

export function StatsPage({ records, exercises }: StatsPageProps) {
  const today = getTodayKey();
  const [startDate, setStartDate] = useState(records[0]?.date ?? today);
  const [endDate, setEndDate] = useState(today);
  const [exerciseId, setExerciseId] = useState(exercises[0]?.id ?? '');
  const [viewDate, setViewDate] = useState(records[records.length - 1]?.date ?? today);

  const bodyTrend = useMemo(() => buildBodyTrend(records, startDate, endDate), [records, startDate, endDate]);
  const strengthTrend = useMemo(() => buildStrengthTrend(records, exerciseId, startDate, endDate), [records, exerciseId, startDate, endDate]);
  const viewedRecord = records.find((record) => record.date === viewDate);
  const exerciseById = useMemo(() => new Map(exercises.map((exercise) => [exercise.id, exercise])), [exercises]);

  return (
    <section className="page stats-page">
      <header className="page-header">
        <h1>统计</h1>
      </header>

      <div className="range-grid">
        <label>
          <span>开始</span>
          <input aria-label="开始日期" type="date" value={startDate} max={today} onChange={(event) => setStartDate(event.target.value)} />
        </label>
        <label>
          <span>结束</span>
          <input aria-label="结束日期" type="date" value={endDate} max={today} onChange={(event) => setEndDate(event.target.value)} />
        </label>
      </div>

      <section className="chart-card">
        <div className="chart-heading">
          <div>
            <h2>身体数据趋势</h2>
            <p>体重 / 手臂围 / 腰围</p>
          </div>
          <span>生成图</span>
        </div>
        <div className="chart-frame">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={bodyTrend}>
              <CartesianGrid stroke="#eee6dc" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="weightKg" name="体重" stroke="#f47416" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="armCm" name="手臂" stroke="#1f7567" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="waistCm" name="腰围" stroke="#394b7c" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="chart-card">
        <div className="chart-heading">
          <div>
            <h2>力量训练趋势</h2>
            <p>按动作查看重量、次数、总训练量</p>
          </div>
        </div>
        <select aria-label="选择动作" value={exerciseId} onChange={(event) => setExerciseId(event.target.value)}>
          {exercises.map((exercise) => (
            <option key={exercise.id} value={exercise.id}>
              {exercise.name}
            </option>
          ))}
        </select>
        <div className="chart-frame">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={strengthTrend}>
              <CartesianGrid stroke="#eee6dc" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="maxWeight" name="最大重量" stroke="#f47416" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="totalReps" name="总次数" stroke="#1f7567" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="totalVolume" name="总训练量" stroke="#394b7c" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="chart-card daily-record-card">
        <div className="chart-heading">
          <div>
            <h2>当日记录</h2>
            <p>选择某一天，回看训练、爬坡、身体数据和想说的话。</p>
          </div>
        </div>
        <label className="daily-view-date">
          <span>查看日期</span>
          <input aria-label="查看日期" type="date" value={viewDate} max={today} onChange={(event) => setViewDate(event.target.value)} />
        </label>

        {viewedRecord ? (
          <div className="daily-detail-list">
            <section>
              <h3>力量训练</h3>
              {viewedRecord.strengthSets.length > 0 ? (
                viewedRecord.strengthSets.map((set, index) => {
                  const exercise = exerciseById.get(set.exerciseId);
                  const partLabel = BODY_PARTS.find((part) => part.id === set.bodyPart)?.label ?? set.bodyPart;
                  return (
                    <div className="daily-detail-row" key={set.id}>
                      <span>{index + 1}. {exercise?.name ?? set.exerciseId}</span>
                      <strong>{set.weight}kg x {set.reps}</strong>
                      <small>{partLabel}</small>
                    </div>
                  );
                })
              ) : (
                <p className="empty-text">这天没有力量记录</p>
              )}
            </section>

            <section>
              <h3>爬坡</h3>
              {viewedRecord.climbEntries.length > 0 ? (
                viewedRecord.climbEntries.map((entry) => (
                  <div className="daily-detail-row" key={entry.id}>
                    <span>{entry.durationMinutes}分钟</span>
                    <strong>{entry.notes || '无备注'}</strong>
                  </div>
                ))
              ) : (
                <p className="empty-text">这天没有爬坡记录</p>
              )}
            </section>

            <section>
              <h3>身体数据</h3>
              {viewedRecord.bodyMeasurement ? (
                <div className="daily-metrics">
                  <span>{viewedRecord.bodyMeasurement.weightKg ?? '-'}kg</span>
                  <span>{viewedRecord.bodyMeasurement.armCm ?? '-'}cm 手臂</span>
                  <span>{viewedRecord.bodyMeasurement.waistCm ?? '-'}cm 腰围</span>
                </div>
              ) : (
                <p className="empty-text">这天没有身体数据</p>
              )}
            </section>

            <section>
              <h3>每日想说的话</h3>
              <p className="daily-note-text">{viewedRecord.dailyNote?.trim() ? viewedRecord.dailyNote : '这天还没有写想说的话'}</p>
            </section>
          </div>
        ) : (
          <p className="empty-text">这天还没有记录</p>
        )}
      </section>
    </section>
  );
}
