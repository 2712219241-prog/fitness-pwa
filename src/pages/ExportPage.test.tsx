import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_EXERCISES } from '../lib/defaultExercises';
import { ExportPage } from './ExportPage';

describe('ExportPage', () => {
  it('shows csv, backup, and import actions', () => {
    render(<ExportPage records={[]} exercises={DEFAULT_EXERCISES} onImportBackup={vi.fn()} />);
    expect(screen.getByRole('heading', { name: '导出' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '导出 CSV' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '导出备份文件' })).toBeInTheDocument();
    expect(screen.getByLabelText('导入备份文件')).toBeInTheDocument();
  });
});
