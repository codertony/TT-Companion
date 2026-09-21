// 台上重点推导：由离台 ONE CUE / limiter 决定「今天上球台练什么」（纯函数）
import type { Cue, LimiterFinding, TargetTechnique } from '../types';

export interface TableFocus {
  title: string;
  target: TargetTechnique;
  reason: string;
}

export function deriveTableFocus(cue: Cue | null, limiters: LimiterFinding[]): TableFocus {
  // 只有「明确短板」(deficit ≥ 1) 才算；unknown（数据不足）不作为短板依据
  const lowerLimb = limiters.some(
    (l) => (l.capacityId === 'balance' || l.capacityId === 'joint_control') && l.deficit >= 1,
  );
  if (lowerLimb) {
    return { title: '步法稳定', target: 'two_point_forehand', reason: '下肢稳定为当前短板，优先练固定移动（两点正手）' };
  }
  if (cue) {
    if (cue.tags.includes('footwork_slow') || cue.tags.includes('recovery_slow')) {
      return { title: '固定移动', target: 'two_point_forehand', reason: `本周 CUE「${cue.text}」指向步法/还原，练两点移动` };
    }
    if (cue.tags.includes('hand_first') || cue.tags.includes('arm_stiff')) {
      return { title: '正手攻', target: 'forehand_drive', reason: `本周 CUE「${cue.text}」指向发力/手抢，练正手攻` };
    }
    if (cue.tags.includes('early_hit')) {
      return { title: '反手起下旋', target: 'backhand_backspin', reason: `本周 CUE「${cue.text}」指向时机，练起下旋节奏` };
    }
    return { title: '正手攻', target: 'forehand_drive', reason: `结合本周 CUE「${cue.text}」练基础技术` };
  }
  return { title: '正手攻', target: 'forehand_drive', reason: '尚未设置 ONE CUE 或短板，从基础正手攻开始' };
}
