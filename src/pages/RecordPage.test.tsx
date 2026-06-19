import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
        onSaveDailyNote={vi.fn()}
        onAddExercise={vi.fn()}
        onDeleteExercise={vi.fn()}
        maxDate="2026-06-18"
      />
    );
    expect(screen.getByText('今天还没记录')).toBeInTheDocument();
    expect(screen.getByLabelText('补录日期')).toHaveAttribute('max', '2026-06-18');
    expect(screen.getByRole('button', { name: '胸部' })).toBeInTheDocument();
    expect(screen.getByText('爬坡')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '身体数据' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '每日想说的话' })).toBeInTheDocument();
  });

  it('submits weight and reps for a strength set', async () => {
    const onAddStrengthSet = vi.fn();
    render(
      <RecordPage
        date="2026-06-16"
        exercises={DEFAULT_EXERCISES}
        records={[]}
        onDateChange={vi.fn()}
        onAddStrengthSet={onAddStrengthSet}
        onDeleteStrengthSet={vi.fn()}
        onAddClimbEntry={vi.fn()}
        onSaveBodyMeasurement={vi.fn()}
        onSaveDailyNote={vi.fn()}
        onAddExercise={vi.fn()}
        onDeleteExercise={vi.fn()}
        maxDate="2026-06-18"
      />
    );

    await userEvent.type(screen.getByLabelText('哑铃卧推重量'), '30');
    await userEvent.type(screen.getByLabelText('哑铃卧推次数'), '8');
    await userEvent.click(screen.getByRole('button', { name: '添加哑铃卧推一组' }));

    expect(onAddStrengthSet).toHaveBeenCalledWith('2026-06-16', expect.objectContaining({ weight: 30, reps: 8 }));
  });

  it('submits climb duration and notes', async () => {
    const onAddClimbEntry = vi.fn();
    render(
      <RecordPage
        date="2026-06-16"
        exercises={DEFAULT_EXERCISES}
        records={[]}
        onDateChange={vi.fn()}
        onAddStrengthSet={vi.fn()}
        onDeleteStrengthSet={vi.fn()}
        onAddClimbEntry={onAddClimbEntry}
        onSaveBodyMeasurement={vi.fn()}
        onSaveDailyNote={vi.fn()}
        onAddExercise={vi.fn()}
        onDeleteExercise={vi.fn()}
        maxDate="2026-06-18"
      />
    );

    await userEvent.type(screen.getByLabelText('爬坡时长'), '35');
    await userEvent.type(screen.getByLabelText('爬坡备注'), '坡度12');
    await userEvent.click(screen.getByRole('button', { name: '保存爬坡' }));

    expect(onAddClimbEntry).toHaveBeenCalledWith('2026-06-16', expect.objectContaining({ durationMinutes: 35, notes: '坡度12' }));
  });

  it('submits body measurements', async () => {
    const onSaveBodyMeasurement = vi.fn();
    render(
      <RecordPage
        date="2026-06-16"
        exercises={DEFAULT_EXERCISES}
        records={[]}
        onDateChange={vi.fn()}
        onAddStrengthSet={vi.fn()}
        onDeleteStrengthSet={vi.fn()}
        onAddClimbEntry={vi.fn()}
        onSaveBodyMeasurement={onSaveBodyMeasurement}
        onSaveDailyNote={vi.fn()}
        onAddExercise={vi.fn()}
        onDeleteExercise={vi.fn()}
        maxDate="2026-06-18"
      />
    );

    await userEvent.type(screen.getByLabelText('体重'), '78.5');
    await userEvent.type(screen.getByLabelText('手臂围'), '35');
    await userEvent.type(screen.getByLabelText('腰围'), '86');
    await userEvent.click(screen.getByRole('button', { name: '保存身体数据' }));

    expect(onSaveBodyMeasurement).toHaveBeenCalledWith(expect.objectContaining({
      date: '2026-06-16',
      weightKg: 78.5,
      armCm: 35,
      waistCm: 86
    }));
  });

  it('submits the daily note text', async () => {
    const onSaveDailyNote = vi.fn();
    render(
      <RecordPage
        date="2026-06-16"
        exercises={DEFAULT_EXERCISES}
        records={[]}
        onDateChange={vi.fn()}
        onAddStrengthSet={vi.fn()}
        onDeleteStrengthSet={vi.fn()}
        onAddClimbEntry={vi.fn()}
        onSaveBodyMeasurement={vi.fn()}
        onSaveDailyNote={onSaveDailyNote}
        onAddExercise={vi.fn()}
        onDeleteExercise={vi.fn()}
        maxDate="2026-06-18"
      />
    );

    await userEvent.type(screen.getByLabelText('每日想说的话'), '今天训练状态很好。');
    await userEvent.click(screen.getByRole('button', { name: '保存想说的话' }));

    expect(onSaveDailyNote).toHaveBeenCalledWith('2026-06-16', '今天训练状态很好。');
  });

  it('adds a custom exercise to the selected body part', async () => {
    const onAddExercise = vi.fn();
    render(
      <RecordPage
        date="2026-06-16"
        exercises={DEFAULT_EXERCISES}
        records={[]}
        onDateChange={vi.fn()}
        onAddStrengthSet={vi.fn()}
        onDeleteStrengthSet={vi.fn()}
        onAddClimbEntry={vi.fn()}
        onSaveBodyMeasurement={vi.fn()}
        onSaveDailyNote={vi.fn()}
        onAddExercise={onAddExercise}
        onDeleteExercise={vi.fn()}
        maxDate="2026-06-18"
      />
    );

    await userEvent.type(screen.getByLabelText('新增动作名称'), '上斜卧推');
    await userEvent.click(screen.getByRole('button', { name: '添加动作' }));

    expect(onAddExercise).toHaveBeenCalledWith('上斜卧推', 'chest');
  });

  it('does not delete an exercise when confirmation is cancelled', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const onDeleteExercise = vi.fn();
    render(
      <RecordPage
        date="2026-06-16"
        exercises={DEFAULT_EXERCISES}
        records={[]}
        onDateChange={vi.fn()}
        onAddStrengthSet={vi.fn()}
        onDeleteStrengthSet={vi.fn()}
        onAddClimbEntry={vi.fn()}
        onSaveBodyMeasurement={vi.fn()}
        onSaveDailyNote={vi.fn()}
        onAddExercise={vi.fn()}
        onDeleteExercise={onDeleteExercise}
        maxDate="2026-06-18"
      />
    );

    await userEvent.click(screen.getByRole('button', { name: '删除哑铃卧推' }));

    expect(confirmSpy).toHaveBeenCalled();
    expect(onDeleteExercise).not.toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  it('deletes an exercise from the current list after confirmation', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const onDeleteExercise = vi.fn();
    render(
      <RecordPage
        date="2026-06-16"
        exercises={DEFAULT_EXERCISES}
        records={[]}
        onDateChange={vi.fn()}
        onAddStrengthSet={vi.fn()}
        onDeleteStrengthSet={vi.fn()}
        onAddClimbEntry={vi.fn()}
        onSaveBodyMeasurement={vi.fn()}
        onSaveDailyNote={vi.fn()}
        onAddExercise={vi.fn()}
        onDeleteExercise={onDeleteExercise}
        maxDate="2026-06-18"
      />
    );

    await userEvent.click(screen.getByRole('button', { name: '删除哑铃卧推' }));

    expect(confirmSpy).toHaveBeenCalled();
    expect(onDeleteExercise).toHaveBeenCalledWith(DEFAULT_EXERCISES[0].id);
    confirmSpy.mockRestore();
  });
});
