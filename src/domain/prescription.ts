// 训练处方引擎（六阶段中的「配比分配」与「安全过滤」，纯函数）
import type { Exercise, LimiterFinding, SafetyDecision } from '../types';

export interface TrainingAllocation {
  general: number;
  movement: number;
  perception: number;
  technique: number;
  recovery: number;
  rationale: string[];
}

/** 配比分配：按安全状态与 limiter 决定五分量比例（数值为可校准的产品假设） */
export function allocateTraining(safety: SafetyDecision, limiters: LimiterFinding[]): TrainingAllocation {
  if (safety.state === 'red') {
    return { general: 0, movement: 0, perception: 0, technique: 0, recovery: 100, rationale: ['出现警示症状，今日停止训练'] };
  }
  if (safety.state === 'yellow') {
    return { general: 10, movement: 10, perception: 20, technique: 20, recovery: 40, rationale: ['今日降负荷，去除高冲击与高心肺'] };
  }
  const lowerLimb = limiters.some((l) => l.capacityId === 'balance' || l.capacityId === 'joint_control');
  if (lowerLimb) {
    return { general: 20, movement: 35, perception: 15, technique: 25, recovery: 5, rationale: ['下肢稳定为当前短板，提高移动/稳定配比'] };
  }
  return { general: 15, movement: 20, perception: 20, technique: 40, recovery: 5, rationale: ['无明确短板，以技术为主'] };
}

/** 安全门动作过滤：red 全禁；yellow 禁高强度（冲击）动作；green 全通过 */
export function isExerciseAllowed(e: Exercise, safety: SafetyDecision): boolean {
  if (safety.state === 'red') return false;
  if (safety.state === 'yellow') return e.intensity !== 'high';
  return true;
}
