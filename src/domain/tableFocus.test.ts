import { describe, it, expect } from 'vitest';
import { deriveTableFocus } from './tableFocus';
import type { Cue, LimiterFinding } from '../types';

function limiter(capacityId: LimiterFinding['capacityId'], deficit = 1): LimiterFinding {
  return {
    capacityId, priority: 0.5, deficit, goalRelevance: 0.9, transferEvidence: 0.8,
    dataConfidence: 0.6, trainability: 0.9, rationale: 'x', recommendation: 'x', retestProtocol: 'x', invalidatedBy: 'x',
  };
}

function cue(tags: Cue['tags']): Cue {
  return { id: 'c', text: '身体先走', skill: 'forehand_drive', tags, type: 'technique', priority: 1, status: 'active', doneWeeks: 0 };
}

describe('deriveTableFocus', () => {
  it('下肢稳定短板 → 步法稳定', () => {
    const f = deriveTableFocus(null, [limiter('balance')]);
    expect(f.title).toBe('步法稳定');
    expect(f.target).toBe('two_point_forehand');
  });
  it('CUE 指向步法 → 固定移动', () => {
    const f = deriveTableFocus(cue(['footwork_slow']), []);
    expect(f.target).toBe('two_point_forehand');
  });
  it('CUE 指向手抢 → 正手攻', () => {
    const f = deriveTableFocus(cue(['hand_first']), []);
    expect(f.target).toBe('forehand_drive');
  });
  it('无 CUE 无短板 → 默认正手攻', () => {
    const f = deriveTableFocus(null, []);
    expect(f.target).toBe('forehand_drive');
  });
  it('仅 unknown（数据不足）不判为短板 → 默认正手攻', () => {
    const f = deriveTableFocus(null, [limiter('balance', 0.5)]);
    expect(f.target).toBe('forehand_drive');
  });
});
