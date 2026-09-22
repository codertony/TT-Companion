import type { Scene } from '../types';

/**
 * 场景卡片主落点路由（纯函数，供单测）：
 * - 球馆有真实球台，主路径进入「台上训练编排」（/table）
 * - 其余离台场景进入「选时长」（/train/duration）生成离台课表
 */
export function scenePrimaryRoute(scene: Scene): string {
  return scene === 'club' ? '/table' : '/train/duration';
}

/**
 * 场景卡片副落点路由（纯函数，供单测）：
 * - 仅球馆提供「记录验证」副动作（打完球回来记录验证结果）
 * - 其余场景无副动作，返回 null
 */
export function sceneSecondaryRoute(scene: Scene): string | null {
  return scene === 'club' ? '/profile/feedback' : null;
}
