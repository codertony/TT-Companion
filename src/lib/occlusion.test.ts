import { describe, it, expect } from 'vitest';
import { accuracyByCut, earliestCueLevel } from './occlusion';

describe('occlusion metrics', () => {
  it('accuracyByCut 分别统计各时点正确率', () => {
    const acc = accuracyByCut([
      { cutMs: -100, correct: true },
      { cutMs: -100, correct: false },
      { cutMs: -200, correct: true },
    ]);
    expect(acc[-100]).toBeCloseTo(0.5);
    expect(acc[-200]).toBeCloseTo(1);
  });

  it('earliestCueLevel 返回最早达到阈值的时点', () => {
    const acc = { '-300': 0.5, '-200': 0.6, '-100': 0.85, '0': 0.9 };
    expect(earliestCueLevel(acc, 0.8)).toBe(-100);
  });

  it('earliestCueLevel 无达标返回 null', () => {
    const acc = { '-300': 0.4 };
    expect(earliestCueLevel(acc, 0.8)).toBeNull();
  });
});
