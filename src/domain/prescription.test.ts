import { describe, it, expect } from 'vitest';
import { allocateTraining, isExerciseAllowed } from './prescription';
import type { Exercise, SafetyDecision } from '../types';

const green: SafetyDecision = { state: 'green', reasons: [], allowedIntensity: 'high', blockedExerciseTags: [], ruleSetVersion: '1' };
const yellow: SafetyDecision = { state: 'yellow', reasons: ['疲劳 8/10'], allowedIntensity: 'low', blockedExerciseTags: ['cardio'], ruleSetVersion: '1' };
const red: SafetyDecision = { state: 'red', reasons: ['胸痛'], allowedIntensity: 'none', blockedExerciseTags: ['impact'], ruleSetVersion: '1' };

const hi: Exercise = {
  id: 'e1', name: '高冲击', ability: 'agility', scenes: ['home'], space: 1, equipment: 'none',
  durationMin: 1, intensity: 'high', cueMap: [], cue: '', timedPrompts: [], description: '', commonMistakes: [], safety: '',
};
const lo: Exercise = { ...hi, id: 'e2', name: '低强度', intensity: 'low' };

describe('allocateTraining', () => {
  it('red → 全部 recovery，停止训练', () => {
    const a = allocateTraining(red, []);
    expect(a.recovery).toBe(100);
    expect(a.technique).toBe(0);
  });

  it('yellow → recovery 占比高', () => {
    const a = allocateTraining(yellow, []);
    expect(a.recovery).toBe(40);
  });

  it('green + 下肢短板 → movement 配比最高', () => {
    const a = allocateTraining(green, [{ capacityId: 'balance', priority: 0.5, deficit: 1, goalRelevance: 1, transferEvidence: 1, dataConfidence: 1, trainability: 1, rationale: '', recommendation: '', retestProtocol: '', invalidatedBy: '' }]);
    expect(a.movement).toBe(35);
    expect(a.movement).toBeGreaterThan(a.technique);
  });

  it('配比五分量和为 100', () => {
    for (const a of [allocateTraining(green, []), allocateTraining(yellow, []), allocateTraining(red, [])]) {
      expect(a.general + a.movement + a.perception + a.technique + a.recovery).toBe(100);
    }
  });
});

describe('isExerciseAllowed', () => {
  it('red 全禁', () => {
    expect(isExerciseAllowed(hi, red)).toBe(false);
    expect(isExerciseAllowed(lo, red)).toBe(false);
  });

  it('yellow 禁高强度、放行低强度', () => {
    expect(isExerciseAllowed(hi, yellow)).toBe(false);
    expect(isExerciseAllowed(lo, yellow)).toBe(true);
  });

  it('green 全放行', () => {
    expect(isExerciseAllowed(hi, green)).toBe(true);
  });
});
