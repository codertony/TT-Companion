import type { Cue, CueTag, Feedback } from '../types';
import { toDateStr } from './date';

export interface CueCollection {
  primary: Cue | null;
  backlog: Cue[];
  history: Cue[];
}

export function today(): string {
  return toDateStr(new Date());
}

/** CueTag → 中文标签（单一事实来源，供 CueCard / Feedback / CueManage 展示） */
export const CUE_TAG_LABELS: Record<CueTag, string> = {
  arm_stiff: '手臂僵硬',
  hand_first: '手先启动',
  footwork_slow: '步法慢',
  recovery_slow: '还原慢',
  early_hit: '击球偏早',
};

/** 激活一个 Backlog Cue：旧 active 自动归档，保证唯一 active */
export function activateCue(state: CueCollection, id: string): CueCollection {
  const cue = state.backlog.find((c) => c.id === id);
  if (!cue) return state;
  const next: CueCollection = { primary: state.primary, backlog: state.backlog, history: state.history };
  if (state.primary) {
    next.history = [{ ...state.primary, status: 'archived' }, ...state.history];
  }
  next.primary = { ...cue, status: 'active', activeSince: today(), doneWeeks: 0 };
  next.backlog = state.backlog.filter((c) => c.id !== id);
  return next;
}

/** 手动归档当前 active Cue */
export function archiveCue(state: CueCollection, id: string): CueCollection {
  if (!state.primary || state.primary.id !== id) return state;
  return {
    primary: null,
    backlog: state.backlog,
    history: [{ ...state.primary, status: 'archived' }, ...state.history],
  };
}

/** 周末反馈：改善累计 doneWeeks，连续 2 周改善 → done */
export function applyFeedback(state: CueCollection, feedback: Feedback): CueCollection {
  const cue = state.primary;
  if (!cue) return state;
  const improved = feedback.result === 'much' || feedback.result === 'slight';
  const doneWeeks = improved ? cue.doneWeeks + 1 : cue.doneWeeks;
  if (improved && doneWeeks >= 2) {
    return {
      primary: null,
      backlog: state.backlog,
      history: [{ ...cue, status: 'done', doneWeeks }, ...state.history],
    };
  }
  return { primary: { ...cue, doneWeeks }, backlog: state.backlog, history: state.history };
}
