import type { CueTag } from '../types';

export interface ErrorDrill {
  id: string;
  problem: string;
  tags: CueTag[];
  drills: string[];
  primaryCue: string;
}

/** 技术问题 → 训练专题 + Primary Cue 映射（Phase 3） */
export const errorDrills: ErrorDrill[] = [
  {
    id: 'arm_snatches',
    problem: '正手大臂抢',
    tags: ['arm_stiff', 'hand_first'],
    drills: ['张力训练', '髋旋转', '手臂滞后'],
    primaryCue: '身体先走',
  },
  {
    id: 'bh_arm_lifts',
    problem: '反手起下旋大臂上抬',
    tags: ['arm_stiff'],
    drills: ['稳定肘部', '前臂路径', '躯干传递'],
    primaryCue: '前臂打开，不抬整条手臂',
  },
  {
    id: 'late_on_ball',
    problem: '总被球顶住',
    tags: ['footwork_slow', 'recovery_slow'],
    drills: ['预判', '第一步', '准备姿态'],
    primaryCue: '更早启动',
  },
  {
    id: 'unstable_stroke',
    problem: '脚到了但击球不稳',
    tags: ['footwork_slow'],
    drills: ['制动', '稳定基底'],
    primaryCue: '先站稳，再出手',
  },
];

export function findErrorDrill(id: string): ErrorDrill | undefined {
  return errorDrills.find((e) => e.id === id);
}
