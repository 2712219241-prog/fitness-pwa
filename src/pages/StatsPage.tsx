import { useMemo, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
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

  const bodyTrend = useMemo(() => buildBodyTrend(records, startDate, endDate), [records, startDate, endDate]);
  const strengthTrend = useMemo(() => buildStrengthTrend(records, exerciseId, startDate, endDate), [records, exerciseId, startDate, endDate]);

  return (
    <section className="page stats-page">
      <header className="page-header">
        <h1>统计</h1>
      </header>

      <div className="range-grid">
        <label>
          <span>开始</span>
          <input aria-label="开始日期" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
        </label>
        <label>
          <span>结束</span>
          <input aria-label="结束日期" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
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
    </section>
  );
}
