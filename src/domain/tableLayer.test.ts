import { describe, it, expect } from 'vitest';
import { LAYERS, PROGRESSION_ORDER } from './tableLayer';

describe('tableLayer', () => {
  it('L1/L2/L3 为「知道」，L4/L6 为「部分知道」，L5/L7 为「不知道」', () => {
    expect(LAYERS.L1.ballKnowledge).toBe('知道');
    expect(LAYERS.L2.ballKnowledge).toBe('知道');
    expect(LAYERS.L3.ballKnowledge).toBe('知道');
    expect(LAYERS.L4.ballKnowledge).toBe('部分知道');
    expect(LAYERS.L6.ballKnowledge).toBe('部分知道');
    expect(LAYERS.L5.ballKnowledge).toBe('不知道');
    expect(LAYERS.L7.ballKnowledge).toBe('不知道');
  });

  it('进阶链顺序为 L1→L7', () => {
    expect(PROGRESSION_ORDER).toEqual(['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7']);
  });

  it('每层都有三要素', () => {
    for (const id of PROGRESSION_ORDER) {
      const l = LAYERS[id];
      expect(l.name).toBeTruthy();
      expect(l.purpose).toBeTruthy();
      expect(l.coreTraining).toBeTruthy();
    }
  });
});
