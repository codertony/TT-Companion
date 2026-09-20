// Limiter 引擎：短板优先级 = Deficit × GoalRelevance × TransferEvidence × DataConfidence × Trainability（纯函数）
import type { CapacityId, CapacityState, LimiterFinding } from '../types';

export interface LimiterWeights {
  goalRelevance: Partial<Record<CapacityId, number>>;
  transferEvidence: Partial<Record<CapacityId, number>>;
  trainability: Partial<Record<CapacityId, number>>;
}

function confidenceWeight(c: CapacityState['confidence']): number {
  if (c === 'high') return 1;
  if (c === 'medium') return 0.6;
  return 0.3;
}

/** 只把 below（明确短板）与 unknown（数据不足候选）纳入 limiter 排序 */
export function identifyLimiters(states: CapacityState[], weights: LimiterWeights): LimiterFinding[] {
  const out: LimiterFinding[] = [];

  for (const s of states) {
    if (s.status !== 'below' && s.status !== 'unknown') continue;

    const deficit = s.status === 'below' ? 1 : 0.5;
    const goalRelevance = weights.goalRelevance[s.capacityId] ?? 0.5;
    const transferEvidence = weights.transferEvidence[s.capacityId] ?? 0.5;
    const trainability = weights.trainability[s.capacityId] ?? 0.5;
    const dataConfidence = confidenceWeight(s.confidence);
    const priority = deficit * goalRelevance * transferEvidence * dataConfidence * trainability;

    out.push({
      capacityId: s.capacityId,
      priority,
      deficit,
      goalRelevance,
      transferEvidence,
      dataConfidence,
      trainability,
      rationale: `该能力当前${s.status === 'below' ? '存在左右/基线短板' : '数据不足'}（${s.basisCount} 次记录）`,
      recommendation: '以退阶动作建立基础，再逐步进阶',
      retestProtocol: s.capacityId === 'balance' ? 'single_leg_stand' : 'sit_to_stand',
      invalidatedBy: '复测左右差异 ≤25% 且达到目标相关度阈值',
    });
  }

  return out.sort((a, b) => b.priority - a.priority);
}
