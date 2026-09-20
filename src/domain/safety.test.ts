import { describe, it, expect } from 'vitest';
import { evaluateSafety, RULE_SET_VERSION } from './safety';

describe('evaluateSafety', () => {
  it('无输入 → green，允许高强度', () => {
    const d = evaluateSafety({});
    expect(d.state).toBe('green');
    expect(d.allowedIntensity).toBe('high');
    expect(d.blockedExerciseTags).toEqual([]);
  });

  it('警示症状 → red，停止处方', () => {
    const d = evaluateSafety({ warningSymptoms: ['胸痛'] });
    expect(d.state).toBe('red');
    expect(d.allowedIntensity).toBe('none');
    expect(d.blockedExerciseTags).toContain('impact');
  });

  it('疲劳 7 → yellow，低强度', () => {
    const d = evaluateSafety({ fatigue: 7 });
    expect(d.state).toBe('yellow');
    expect(d.allowedIntensity).toBe('low');
    expect(d.reasons.some((r) => r.includes('疲劳'))).toBe(true);
  });

  it('睡眠不足 → yellow', () => {
    const d = evaluateSafety({ sleepHours: 5 });
    expect(d.state).toBe('yellow');
  });

  it('疼痛 → yellow 且禁 impact', () => {
    const d = evaluateSafety({ painParts: ['右膝'] });
    expect(d.state).toBe('yellow');
    expect(d.blockedExerciseTags).toContain('impact');
  });

  it('疲劳 8 → 禁 cardio 与 agility', () => {
    const d = evaluateSafety({ fatigue: 8 });
    expect(d.blockedExerciseTags).toContain('cardio');
    expect(d.blockedExerciseTags).toContain('agility');
  });

  it('携带规则版本', () => {
    expect(evaluateSafety({}).ruleSetVersion).toBe(RULE_SET_VERSION);
  });
});
