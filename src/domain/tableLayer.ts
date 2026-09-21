// 台上训练七层进阶模型（纯数据，见 docs/业余乒乓球训练操作系统.md §三）
import type { ProgressionLayer, ProgressionLayerId } from '../types';

export const LAYERS: Record<ProgressionLayerId, ProgressionLayer> = {
  L1: { id: 'L1', name: '单技术', ballKnowledge: '知道', purpose: '动作框架', coreTraining: '正手/反手对攻、直线、拉上旋、起下旋' },
  L2: { id: 'L2', name: '固定落点', ballKnowledge: '知道', purpose: '稳定性', coreTraining: '固定落点连续上台' },
  L3: { id: 'L3', name: '固定移动', ballKnowledge: '知道', purpose: '动作+步法', coreTraining: '两点正手、正反手转换、Falkenberg' },
  L4: { id: 'L4', name: '半随机', ballKnowledge: '部分知道', purpose: '判断', coreTraining: '第一球固定、第二球随机' },
  L5: { id: 'L5', name: '随机', ballKnowledge: '不知道', purpose: '反应', coreTraining: '全台移动 + 判断' },
  L6: { id: 'L6', name: '发接发+前三板', ballKnowledge: '部分知道', purpose: '实战衔接', coreTraining: '发抢 1/2/3' },
  L7: { id: 'L7', name: '条件比赛', ballKnowledge: '不知道', purpose: '技战术迁移', coreTraining: '条件局' },
};

/** 进阶链顺序（由 LAYERS 的声明顺序派生，避免与层定义手工维护两份） */
export const PROGRESSION_ORDER = Object.keys(LAYERS) as ProgressionLayerId[];
