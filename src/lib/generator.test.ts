import { describe, it, expect } from 'vitest';
import { generatePlan } from './generator';
import { exercises } from '../data/exercises';
import type { Cue } from '../types';

const cue: Cue = {
  id: 'c1',
  text: '身体先走，手不要抢',
  skill: 'forehand_drive',
  tags: ['hand_first'],
  type: 'technique',
  priority: 1,
  status: 'active',
  doneWeeks: 0,
};

describe('generatePlan', () => {
  it('生成非空计划且总时长接近目标（±15s）', () => {
    const plan = generatePlan({ scene: 'home', durationMin: 10, cue, feeling: 'normal', exercises });
    expect(plan.steps.length).toBeGreaterThan(0);
    const total = plan.steps.reduce((a, s) => a + s.durationSec, 0);
    expect(Math.abs(total - 600)).toBeLessThanOrEqual(15);
  });

  it('地铁场景不含 space>0 或 high 强度动作', () => {
    const plan = generatePlan({ scene: 'metro_sit', durationMin: 3, cue: null, feeling: 'normal', exercises });
    const byId = new Map(exercises.map((e) => [e.id, e]));
    for (const s of plan.steps) {
      const e = byId.get(s.exerciseId)!;
      expect(e.space).toBe(0);
      expect(e.intensity).not.toBe('high');
    }
  });

  it('Cue 命中动作被置顶', () => {
    const plan = generatePlan({ scene: 'home', durationMin: 5, cue, feeling: 'normal', exercises });
    const first = exercises.find((e) => e.id === plan.steps[0].exerciseId)!;
    expect(first.cueMap).toContain('hand_first');
  });

  it('纯函数：相同输入产生相同 steps', () => {
    const a = generatePlan({ scene: 'home', durationMin: 5, cue, feeling: 'normal', exercises });
    const b = generatePlan({ scene: 'home', durationMin: 5, cue, feeling: 'normal', exercises });
    expect(a.steps).toEqual(b.steps);
  });

  it('疲劳状态不含 high 强度动作', () => {
    const plan = generatePlan({ scene: 'home', durationMin: 5, cue: null, feeling: 'tired', exercises });
    const byId = new Map(exercises.map((e) => [e.id, e]));
    for (const s of plan.steps) {
      expect(byId.get(s.exerciseId)!.intensity).not.toBe('high');
    }
  });

  it('无动作场景（club）返回空计划并给出明确原因', () => {
    const plan = generatePlan({ scene: 'club', durationMin: 5, cue: null, feeling: 'normal', exercises });
    expect(plan.steps.length).toBe(0);
    expect(plan.reason).toBeTruthy();
    expect(plan.reason).toContain('暂无可用训练动作');
  });

  it('yellow 安全状态不含 high 强度动作', () => {
    const plan = generatePlan({
      scene: 'home',
      durationMin: 5,
      cue: null,
      feeling: 'normal',
      exercises,
      safety: { state: 'yellow', reasons: [], allowedIntensity: 'low', blockedExerciseTags: [], ruleSetVersion: '1' },
    });
    const byId = new Map(exercises.map((e) => [e.id, e]));
    for (const s of plan.steps) {
      expect(byId.get(s.exerciseId)!.intensity).not.toBe('high');
    }
  });

  it('red 安全状态返回空计划并给出休息原因', () => {
    const plan = generatePlan({
      scene: 'home',
      durationMin: 5,
      cue: null,
      feeling: 'normal',
      exercises,
      safety: { state: 'red', reasons: [], allowedIntensity: 'none', blockedExerciseTags: [], ruleSetVersion: '1' },
    });
    expect(plan.steps.length).toBe(0);
    expect(plan.reason).toContain('休息');
  });
});
