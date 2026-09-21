import { describe, it, expect } from 'vitest';
import { MULTIBALL_PROGRESSION, robotGuidance } from './tableBallSource';

describe('robotGuidance', () => {
  it('L3 随机训练 → 加入位置/深浅/频率随机', () => {
    const hints = robotGuidance('L3', 'random');
    expect(hints.join()).toContain('位置随机');
    expect(hints.join()).toContain('深浅随机');
    expect(hints.join()).toContain('频率轻微随机');
  });
  it('L5 → 提示发球机效果有限', () => {
    const hints = robotGuidance('L5', 'random');
    expect(hints.join()).toContain('效果有限');
  });
  it('固定训练不加扰动提示', () => {
    const hints = robotGuidance('L3', 'fixed');
    expect(hints.join()).not.toContain('位置随机');
  });
});

describe('多球进阶', () => {
  it('固定下旋 → 深浅变化 → 正反手随机', () => {
    expect(MULTIBALL_PROGRESSION).toEqual(['固定下旋 → 正手拉', '下旋深浅变化', '正反手随机']);
  });
});
