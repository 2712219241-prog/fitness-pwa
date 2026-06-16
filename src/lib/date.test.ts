import { describe, expect, it } from 'vitest';
import { formatChineseDate, getTodayKey, isWithinDateRange } from './date';

describe('date helpers', () => {
  it('formats an ISO date key for Chinese display', () => {
    expect(formatChineseDate('2026-06-16')).toBe('6月16日');
  });

  it('compares date keys inclusively', () => {
    expect(isWithinDateRange('2026-06-16', '2026-06-01', '2026-06-16')).toBe(true);
    expect(isWithinDateRange('2026-05-31', '2026-06-01', '2026-06-16')).toBe(false);
  });

  it('creates today key from a fixed date', () => {
    expect(getTodayKey(new Date('2026-06-16T12:00:00'))).toBe('2026-06-16');
  });
});
