import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_EXERCISES } from '../lib/defaultExercises';
import type { DailyRecord } from '../lib/types';
import { RecordPage } from './RecordPage';

describe('RecordPage', () => {
  it('shows strength parts, climb, body data, and backfill', () => {
    const records: DailyRecord[] = [];
    render(
      <RecordPage
        date="2026-06-16"
        exercises={DEFAULT_EXERCISES}
        records={records}
        onDateChange={vi.fn()}
        onAddStrengthSet={vi.fn()}
        onDeleteStrengthSet={vi.fn()}
        onAddClimbEntry={vi.fn()}
        onSaveBodyMeasurement={vi.fn()}
      />
    );
    expect(screen.getByText('今天还没记录')).toBeInTheDocument();
    expect(screen.getByLabelText('补录日期')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '胸部' })).toBeInTheDocument();
    expect(screen.getByText('爬坡')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '身体数据' })).toBeInTheDocument();
  });
});
