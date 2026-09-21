// 球源适配：发球机 / 多球（纯函数）
import type { ProgressionLayerId, Randomness } from '../types';

const ROBOT_LAYERS: ProgressionLayerId[] = ['L1', 'L2', 'L3', 'L4'];

/** 发球机适用性与抗提前移动提示 */
export function robotGuidance(layer: ProgressionLayerId, randomness: Randomness): string[] {
  const hints: string[] = [];
  if (ROBOT_LAYERS.includes(layer)) {
    hints.push('发球机适合本层：固定动作、固定步法、半随机');
  } else {
    hints.push('发球机对 L5–L7 效果有限，建议改用球搭子');
  }
  if (randomness !== 'fixed') {
    hints.push('随机训练加入位置随机、深浅随机、频率轻微随机，避免提前移动');
  }
  return hints;
}

/** 多球下旋起板进阶链 */
export const MULTIBALL_PROGRESSION: string[] = ['固定下旋 → 正手拉', '下旋深浅变化', '正反手随机'];
