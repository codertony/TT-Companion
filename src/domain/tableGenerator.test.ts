import { describe, it, expect } from 'vitest';
import { generateDrillChain, TARGET_LABELS } from './tableGenerator';

describe('generateDrillChain', () => {
  it('反手起下旋 → 7 级从固定到随机再到比赛迁移', () => {
    const chain = generateDrillChain('backhand_backspin');
    expect(chain).toHaveLength(7);
    expect(chain[0].level).toBe('A');
    expect(chain[0].randomness).toBe('fixed');
    expect(chain[6].level).toBe('G');
    expect(chain[6].name).toContain('比赛迁移');

    const firstRandom = chain.findIndex((s) => s.randomness === 'random');
    const lastFixed = chain.map((s) => s.randomness).lastIndexOf('fixed');
    expect(firstRandom).toBeGreaterThan(lastFixed);
  });

  it('每个目标技术都有中文标签', () => {
    expect(Object.keys(TARGET_LABELS).length).toBeGreaterThanOrEqual(10);
    expect(TARGET_LABELS.backhand_backspin).toBe('反手起下旋');
  });
});
