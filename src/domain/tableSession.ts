// 台上训练课编排（纯函数）：90–120 分钟课表 + 安全门降负荷
import type { BallSource, SafetyDecision, TableRatio, TableSegment, TableSegmentKind } from '../types';

export interface TableSessionPlan {
  target: string;
  ballSource: BallSource;
  durationMin: number;
  segments: TableSegment[];
  ratio: TableRatio;
  rationale: string[];
  reason?: string;
  focusPoint?: string; // 当前唯一主注意点（用于自检记录）
}

const SEGMENT_TEMPLATE: { kind: TableSegmentKind; name: string; minutes: number }[] = [
  { kind: 'warmup', name: '身体+空挥热身', minutes: 10 },
  { kind: 'basic', name: '正手/反手基本球', minutes: 10 },
  { kind: 'core', name: '当天核心动作', minutes: 15 },
  { kind: 'movement', name: '固定移动', minutes: 15 },
  { kind: 'semi', name: '半随机', minutes: 15 },
  { kind: 'serve_receive', name: '发接发/前三板', minutes: 15 },
  { kind: 'open', name: '随机/开放球', minutes: 10 },
  { kind: 'match', name: '条件比赛/比赛', minutes: 20 },
];

const TOTAL_TEMPLATE = SEGMENT_TEMPLATE.reduce((a, s) => a + s.minutes, 0);

export function buildTableSession(input: {
  target: string;
  ballSource: BallSource;
  durationMin: number;
  ratio: TableRatio;
  safety: SafetyDecision;
}): TableSessionPlan {
  const { target, ballSource, durationMin, ratio, safety } = input;
  const rationale = [...ratio.rationale];

  if (safety.state === 'red') {
    return {
      target,
      ballSource,
      durationMin,
      segments: [],
      ratio,
      rationale,
      reason: '今日状态不适合训练（出现警示症状），请先休息',
    };
  }

  const yellow = safety.state === 'yellow';
  const scale = durationMin / TOTAL_TEMPLATE;
  let segments = SEGMENT_TEMPLATE.map((s) => {
    let minutes = Math.round(s.minutes * scale);
    if (yellow && (s.kind === 'match' || s.kind === 'open')) {
      minutes = Math.round(minutes * 0.5); // 降负荷：缩短比赛与开放球
    }
    return { kind: s.kind, name: s.name, minutes };
  });

  if (yellow) {
    segments = segments.filter((s) => s.kind !== 'match'); // 不含高强度段（条件比赛）
    rationale.push('今日降负荷，去除条件比赛并缩短开放球段');
  } else {
    // 把舍入差补到最后一段，保证总时长精确等于 durationMin
    const sum = segments.reduce((a, s) => a + s.minutes, 0);
    const diff = durationMin - sum;
    segments = segments.map((s, i) => (i === segments.length - 1 ? { ...s, minutes: s.minutes + diff } : s));
  }

  return { target, ballSource, durationMin, segments, ratio, rationale };
}
