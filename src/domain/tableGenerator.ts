// 训练生成公式：技术 × 落点 × 移动 × 旋转 × 随机度 × 前后板 → Level A–G 进阶链（纯函数）
import type { ProgressionLevel, Randomness, TargetTechnique } from '../types';

export const TARGET_LABELS: Record<TargetTechnique, string> = {
  forehand_drive: '正手攻',
  backhand_drive: '反手攻',
  forehand_loop: '正手拉上旋',
  backhand_loop: '反手拉上旋',
  forehand_backspin: '正手起下旋',
  backhand_backspin: '反手起下旋',
  two_point_forehand: '两点正手',
  fh_bh_switch: '正反手转换',
  serve_attack: '发抢',
  receive_attack: '接抢',
};

export interface DrillChainStep {
  level: ProgressionLevel;
  name: string;
  randomness: Randomness;
  rule: string;
}

/** 给定目标技术，生成「固定 → 两落点 → 随机 → 发抢 → 前后板 → 条件比赛」进阶链 */
export function generateDrillChain(target: TargetTechnique): DrillChainStep[] {
  const label = TARGET_LABELS[target];
  return [
    { level: 'A', name: `${label}·固定`, randomness: 'fixed', rule: `${label}固定位置、固定速度、固定旋转` },
    { level: 'B', name: `${label}·提高质量`, randomness: 'fixed', rule: `同一球，提高一点速度或落点要求` },
    { level: 'C', name: `${label}·两落点`, randomness: 'semi', rule: `${label}两个落点/两种深浅` },
    { level: 'D', name: `${label}·半随机`, randomness: 'semi', rule: `知道两种可能，但不知道下一球是哪种` },
    { level: 'E', name: `${label}·随机`, randomness: 'random', rule: `多点、多速度随机` },
    { level: 'F', name: `${label}·前后板组合`, randomness: 'random', rule: `发球 → 对方回球 → ${label} → 连续` },
    { level: 'G', name: `${label}·比赛迁移`, randomness: 'random', rule: `条件比赛，强制使用${label}` },
  ];
}
