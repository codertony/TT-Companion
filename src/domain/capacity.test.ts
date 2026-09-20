import { describe, it, expect } from 'vitest';
import { deriveCapacityState } from './capacity';
import type { AssessmentResult } from '../types';

function res(assessmentId: string, left?: number, right?: number, value?: number): AssessmentResult {
  return { id: `r_${Math.random()}`, assessmentId, date: '2026-09-20', left, right, value, protocolVersion: '1' };
}

describe('deriveCapacityState', () => {
  it('无结果 → unknown，basis 0', () => {
    const s = deriveCapacityState('single_leg_stand', [])!;
    expect(s.status).toBe('unknown');
    expect(s.basisCount).toBe(0);
    expect(s.confidence).toBe('low');
  });

  it('未知协议 → null', () => {
    expect(deriveCapacityState('nope', [])).toBeNull();
  });

  it('左右均衡 → normal', () => {
    const s = deriveCapacityState('sit_to_stand', [res('sit_to_stand', 10, 10)])!;
    expect(s.status).toBe('normal');
  });

  it('左右差异 >25% → below', () => {
    const s = deriveCapacityState('sit_to_stand', [res('sit_to_stand', 8, 12)])!;
    expect(s.status).toBe('below');
  });

  it('左右差异 ≤25% → normal（边界）', () => {
    const s = deriveCapacityState('sit_to_stand', [res('sit_to_stand', 10, 12)])!;
    expect(s.status).toBe('normal');
  });

  it('置信度随记录数提升：1 low / 2 medium / 3 high', () => {
    const one = deriveCapacityState('single_leg_stand', [res('single_leg_stand', 10, 10)])!;
    const two = deriveCapacityState('single_leg_stand', [
      res('single_leg_stand', 10, 10),
      res('single_leg_stand', 11, 11),
    ])!;
    const three = deriveCapacityState('single_leg_stand', [
      res('single_leg_stand', 10, 10),
      res('single_leg_stand', 11, 11),
      res('single_leg_stand', 12, 12),
    ])!;
    expect(one.confidence).toBe('low');
    expect(two.confidence).toBe('medium');
    expect(three.confidence).toBe('high');
  });

  it('取最新一次结果（数组末尾）', () => {
    const s = deriveCapacityState('sit_to_stand', [
      res('sit_to_stand', 8, 12),
      res('sit_to_stand', 12, 12),
    ])!;
    expect(s.status).toBe('normal');
  });

  it('标量：俯卧撑低于阈值 → below', () => {
    const s = deriveCapacityState('pushup', [res('pushup', undefined, undefined, 3)])!;
    expect(s.status).toBe('below');
  });

  it('标量：俯卧撑达到阈值 → normal', () => {
    const s = deriveCapacityState('pushup', [res('pushup', undefined, undefined, 6)])!;
    expect(s.status).toBe('normal');
  });

  it('标量：RPE 高于阈值 → below（越低越好）', () => {
    const s = deriveCapacityState('walk_rpe', [res('walk_rpe', undefined, undefined, 8)])!;
    expect(s.status).toBe('below');
  });
});
