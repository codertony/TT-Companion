// 球搭子协议与水平适配（纯函数）
import type { Drill, PartnerLevel } from '../types';

/** 球搭子协议八条规则 */
export const PARTNER_PROTOCOL: string[] = [
  '每个项目说清楚：谁练什么',
  '规定发球/回球/落点',
  '双方都必须得到训练',
  '稳定优先：一旦连续掉球就降速、降力量、减少落点',
  '一次只增加一个难度',
  '每轮约 3–6 分钟换人',
  '练球目标和比赛目标不同',
  '最后一定进入开放球',
];

export interface PartnerAdaptation {
  rule: string;
  partnerTask: string;
  hints: string[];
}

/** 按球搭子水平适配套路：低水平降难度，高水平控 70% 质量 */
export function adaptForPartner(drill: Drill, level: PartnerLevel): PartnerAdaptation {
  if (level === 'beginner') {
    return {
      rule: `（降难度）落点放宽到半台、高弧线稳定连续、先上旋后下旋；原规则：${drill.rule}`,
      partnerTask: `${drill.partnerTask}（不要求落点精确/速度/复杂旋转）`,
      hints: ['落点放宽到半台', '高弧线、稳定、连续', '先上旋→上旋，再下旋→拉'],
    };
  }
  return {
    rule: drill.rule,
    partnerTask: `${drill.partnerTask}（请先给我 70% 质量）`,
    hints: ['请先给我 70% 质量', '更稳定、更真实、更高质量、更复杂'],
  };
}
