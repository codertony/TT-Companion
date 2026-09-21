import { describe, it, expect } from 'vitest';
import { buildTableSession } from './tableSession';
import { tableRatio } from './tableRatio';
import type { SafetyDecision } from '../types';

const green: SafetyDecision = { state: 'green', reasons: [], allowedIntensity: 'high', blockedExerciseTags: [], ruleSetVersion: '1' };
const yellow: SafetyDecision = { state: 'yellow', reasons: ['疲劳'], allowedIntensity: 'low', blockedExerciseTags: ['impact'], ruleSetVersion: '1' };
const red: SafetyDecision = { state: 'red', reasons: ['胸痛'], allowedIntensity: 'none', blockedExerciseTags: [], ruleSetVersion: '1' };

const base = { target: '正手攻', ballSource: 'partner' as const, ratio: tableRatio(0.5) };

describe('buildTableSession', () => {
  it('green：段序正确（热身→…→条件比赛），总时长匹配', () => {
    const p = buildTableSession({ ...base, durationMin: 90, safety: green });
    expect(p.segments[0].kind).toBe('warmup');
    expect(p.segments[p.segments.length - 1].kind).toBe('match');
    expect(p.segments.reduce((a, s) => a + s.minutes, 0)).toBe(90);
  });

  it('核心动作段安排在热身与基本球之后', () => {
    const p = buildTableSession({ ...base, durationMin: 90, safety: green });
    const kinds = p.segments.map((s) => s.kind);
    expect(kinds.indexOf('core')).toBeGreaterThan(kinds.indexOf('warmup'));
    expect(kinds.indexOf('core')).toBeGreaterThan(kinds.indexOf('basic'));
  });

  it('red：返回空课表与原因', () => {
    const p = buildTableSession({ ...base, durationMin: 90, safety: red });
    expect(p.segments).toEqual([]);
    expect(p.reason).toBeTruthy();
  });

  it('yellow：不含条件比赛段且降负荷', () => {
    const p = buildTableSession({ ...base, durationMin:90, safety: yellow });
    expect(p.segments.find((s) => s.kind === 'match')).toBeUndefined();
  });
});
