import { describe, it, expect } from 'vitest';
import { identifyLimiters } from './limiter';
import type { CapacityState } from '../types';

const below: CapacityState = { capacityId: 'balance', domain: 'physical_base', status: 'below', confidence: 'high', basisCount: 3 };
const unknown: CapacityState = { capacityId: 'joint_control', domain: 'physical_base', status: 'unknown', confidence: 'low', basisCount: 1 };
const normal: CapacityState = { capacityId: 'mobility', domain: 'physical_base', status: 'normal', confidence: 'high', basisCount: 5 };

describe('identifyLimiters', () => {
  it('排除 normal，只保留 below 与 unknown', () => {
    const out = identifyLimiters([below, normal, unknown], { goalRelevance: {}, transferEvidence: {}, trainability: {} });
    expect(out.map((l) => l.capacityId)).toEqual(expect.arrayContaining(['balance', 'joint_control']));
    expect(out.map((l) => l.capacityId)).not.toContain('mobility');
  });

  it('below + 高置信度 + 高相关 > unknown', () => {
    const out = identifyLimiters([unknown, below], {
      goalRelevance: { balance: 1, joint_control: 1 },
      transferEvidence: { balance: 1, joint_control: 1 },
      trainability: { balance: 1, joint_control: 1 },
    });
    expect(out[0].capacityId).toBe('balance');
  });

  it('按优先级降序排列', () => {
    const out = identifyLimiters([unknown, below], {
      goalRelevance: { balance: 0.9, joint_control: 0.9 },
      transferEvidence: { balance: 0.9, joint_control: 0.9 },
      trainability: { balance: 0.9, joint_control: 0.9 },
    });
    for (let i = 1; i < out.length; i++) {
      expect(out[i - 1].priority).toBeGreaterThanOrEqual(out[i].priority);
    }
  });

  it('priority = 五个因子乘积', () => {
    const out = identifyLimiters([below], {
      goalRelevance: { balance: 1 },
      transferEvidence: { balance: 1 },
      trainability: { balance: 1 },
    });
    const l = out[0];
    expect(l.priority).toBeCloseTo(l.deficit * l.goalRelevance * l.transferEvidence * l.dataConfidence * l.trainability);
  });
});
