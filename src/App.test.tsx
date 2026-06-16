import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App shell', () => {
  it('uses bottom navigation without duplicate top tabs', async () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: '记录' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: '统计' })).toHaveLength(1);
    await userEvent.click(screen.getByRole('button', { name: '统计' }));
    expect(screen.getByRole('heading', { name: '统计' })).toBeInTheDocument();
  });
});
