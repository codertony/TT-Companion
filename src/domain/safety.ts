// 训练准入三态安全门（可解释规则，纯函数）
import type { CheckinInput, SafetyDecision } from '../types';

export const RULE_SET_VERSION = '1';

const WARNING_SYMPTOMS = ['胸痛', '晕厥', '异常气促'];

export function evaluateSafety(checkin: CheckinInput): SafetyDecision {
  const symptoms = (checkin.warningSymptoms ?? []).filter((s) => WARNING_SYMPTOMS.includes(s));

  // Red：用户主动报告的警示症状，直接停止处方
  if (symptoms.length > 0) {
    return {
      state: 'red',
      reasons: symptoms.map((s) => `出现警示症状：${s}`),
      allowedIntensity: 'none',
      blockedExerciseTags: ['impact', 'cardio', 'agility'],
      ruleSetVersion: RULE_SET_VERSION,
    };
  }

  const reasons: string[] = [];
  const blocked = new Set<string>();

  const fatigue = checkin.fatigue ?? 0;
  if (fatigue >= 7) reasons.push(`疲劳 ${fatigue}/10`);
  if (checkin.sleepHours != null && checkin.sleepHours < 6) reasons.push(`睡眠 ${checkin.sleepHours}h`);
  const pain = checkin.painParts ?? [];
  if (pain.length > 0) reasons.push(`疼痛：${pain.join('、')}`);

  // Yellow：降负荷、去冲击
  if (reasons.length > 0) {
    if (pain.length > 0) blocked.add('impact');
    if (fatigue >= 8) {
      blocked.add('cardio');
      blocked.add('agility');
    }
    return {
      state: 'yellow',
      reasons,
      allowedIntensity: 'low',
      blockedExerciseTags: [...blocked],
      ruleSetVersion: RULE_SET_VERSION,
    };
  }

  // Green
  return {
    state: 'green',
    reasons: [],
    allowedIntensity: 'high',
    blockedExerciseTags: [],
    ruleSetVersion: RULE_SET_VERSION,
  };
}
