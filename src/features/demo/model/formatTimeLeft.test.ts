import { describe, expect, it } from 'vitest';

import { formatTimeLeft, isLowTime } from './formatTimeLeft';

const minutes = (value: number) => value * 60_000;

describe('formatTimeLeft', () => {
  it('shows hours and minutes', () => {
    expect(formatTimeLeft(minutes(23 * 60 + 12))).toBe('23h 12m');
    expect(formatTimeLeft(minutes(60))).toBe('1h 0m');
  });

  it('shows only minutes under an hour', () => {
    expect(formatTimeLeft(minutes(42))).toBe('42m');
    expect(formatTimeLeft(minutes(1))).toBe('1m');
  });

  it('handles the last minute and the end', () => {
    expect(formatTimeLeft(30_000)).toBe('<1m');
    expect(formatTimeLeft(0)).toBe('0m');
    expect(formatTimeLeft(-5_000)).toBe('0m');
  });

  it('marks the last ten minutes as low', () => {
    expect(isLowTime(minutes(9))).toBe(true);
    expect(isLowTime(minutes(10))).toBe(false);
    expect(isLowTime(minutes(23 * 60))).toBe(false);
  });
});
