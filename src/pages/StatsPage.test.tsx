import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { DEFAULT_EXERCISES } from '../lib/defaultExercises';
import type { DailyRecord } from '../lib/types';
import { StatsPage } from './StatsPage';

const records: DailyRecord[] = [
  {
    date: '2026-06-16',
    strengthSets: [{ id: 's1', exerciseId: DEFAULT_EXERCISES[0].id, bodyPart: 'chest', weight: 30, reps: 8, timestamp: '2026-06-16T10:00:00.000Z' }],
    climbEntries: [{ id: 'c1', durationMinutes: 35, notes: '坡度 12', timestamp: '2026-06-16T11:00:00.000Z' }],
    bodyMeasurement: { date: '2026-06-16', weightKg: 78.5, armCm: 35, waistCm: 86, updatedAt: '2026-06-16T09:00:00.000Z' },
    dailyNote: '今天状态很好，卧推有进步。',
    updatedAt: '2026-06-16T10:00:00.000Z'
  }
];

describe('StatsPage', () => {
  it('renders date range controls and chart sections', () => {
    render(<StatsPage records={records} exercises={DEFAULT_EXERCISES} />);
    expect(screen.getByRole('heading', { name: '统计' })).toBeInTheDocument();
    expect(screen.getByLabelText('开始日期')).toBeInTheDocument();
    expect(screen.getByLabelText('结束日期')).toBeInTheDocument();
    expect(screen.getByText('身体数据趋势')).toBeInTheDocument();
    expect(screen.getByText('力量训练趋势')).toBeInTheDocument();
    expect(screen.getByLabelText('查看日期')).toHaveAttribute('max');
  });

  it('shows the selected day record details', async () => {
    render(<StatsPage records={records} exercises={DEFAULT_EXERCISES} />);

    await userEvent.clear(screen.getByLabelText('查看日期'));
    await userEvent.type(screen.getByLabelText('查看日期'), '2026-06-16');

    expect(screen.getByText('当日记录')).toBeInTheDocument();
    expect(screen.getByText('哑铃卧推')).toBeInTheDocument();
    expect(screen.getByText('30kg x 8')).toBeInTheDocument();
    expect(screen.getByText('35分钟')).toBeInTheDocument();
    expect(screen.getByText('坡度 12')).toBeInTheDocument();
    expect(screen.getByText('78.5kg')).toBeInTheDocument();
    expect(screen.getByText('今天状态很好，卧推有进步。')).toBeInTheDocument();
  });
});
