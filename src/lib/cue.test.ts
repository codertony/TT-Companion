import { describe, it, expect } from 'vitest';
import { activateCue, applyFeedback, archiveCue, type CueCollection } from './cue';
import type { Cue } from '../types';

function mk(id: string, status: Cue['status'] = 'draft'): Cue {
  return {
    id,
    text: `cue ${id}`,
    skill: 'forehand_drive',
    tags: [],
    type: 'technique',
    priority: 1,
    status,
    doneWeeks: 0,
  };
}

describe('cue lifecycle', () => {
  it('激活新 Cue 时旧 active 自动归档，保持唯一 active', () => {
    let state: CueCollection = { primary: mk('a', 'active'), backlog: [mk('b')], history: [] };
    state = activateCue(state, 'b');
    expect(state.primary?.id).toBe('b');
    expect(state.primary?.status).toBe('active');
    expect(state.history.some((c) => c.id === 'a' && c.status === 'archived')).toBe(true);
  });

  it('连续 2 周改善自动 done', () => {
    let state: CueCollection = { primary: mk('a', 'active'), backlog: [], history: [] };
    state = applyFeedback(state, { date: '2026-09-20', cueId: 'a', result: 'slight' });
    state = applyFeedback(state, { date: '2026-09-27', cueId: 'a', result: 'much' });
    expect(state.primary).toBeNull();
    expect(state.history.some((c) => c.id === 'a' && c.status === 'done')).toBe(true);
  });

  it('无变化不累计 doneWeeks', () => {
    let state: CueCollection = { primary: mk('a', 'active'), backlog: [], history: [] };
    state = applyFeedback(state, { date: '2026-09-20', cueId: 'a', result: 'none' });
    expect(state.primary?.doneWeeks).toBe(0);
  });

  it('归档当前 Cue', () => {
    let state: CueCollection = { primary: mk('a', 'active'), backlog: [], history: [] };
    state = archiveCue(state, 'a');
    expect(state.primary).toBeNull();
    expect(state.history[0].status).toBe('archived');
  });
});
