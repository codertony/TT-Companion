import type { Ability, Cue, Exercise, Feeling, PlanStep, Scene, TrainingPlan } from '../types';
import { genId } from './id';

export interface GenerateInput {
  scene: Scene;
  durationMin: number;
  cue: Cue | null;
  feeling: Feeling;
  exercises: Exercise[];
}

function rankAbility(a: Ability): number {
  return a === 'relaxation' || a === 'mobility' ? 0 : 1;
}

/** 纯函数训练计划生成器：场景 × 时长 × Cue × 状态 → 分步计划 */
export function generatePlan(input: GenerateInput): TrainingPlan {
  const targetSec = input.durationMin * 60;
  let candidates = input.exercises.filter((e) => e.scenes.includes(input.scene));

  // 地铁约束：零空间、禁高强度
  if (input.scene === 'metro_sit' || input.scene === 'metro_stand') {
    candidates = candidates.filter((e) => e.space === 0 && e.intensity !== 'high');
  }

  // 疲劳降负荷：排除高强度，放松/活动度优先
  if (input.feeling === 'tired') {
    candidates = candidates
      .filter((e) => e.intensity !== 'high')
      .slice()
      .sort((a, b) => rankAbility(a.ability) - rankAbility(b.ability));
  }

  // Cue 命中置顶
  if (input.cue && input.cue.tags.length > 0) {
    const tags = new Set(input.cue.tags);
    candidates = candidates.slice().sort((a, b) => {
      const ah = a.cueMap.some((t) => tags.has(t)) ? 0 : 1;
      const bh = b.cueMap.some((t) => tags.has(t)) ? 0 : 1;
      return ah - bh;
    });
  }

  // 时长填充
  const steps: PlanStep[] = [];
  let acc = 0;
  for (const e of candidates) {
    if (acc >= targetSec) break;
    const remain = targetSec - acc;
    const sec = Math.min(e.durationMin * 60, remain);
    steps.push({
      exerciseId: e.id,
      name: e.name,
      durationSec: sec,
      cue: e.cue,
      ...(e.mode ? { mode: e.mode } : {}),
    });
    acc += sec;
  }

  return {
    id: genId('plan'),
    scene: input.scene,
    durationMin: input.durationMin,
    cueText: input.cue?.text,
    steps,
  };
}
