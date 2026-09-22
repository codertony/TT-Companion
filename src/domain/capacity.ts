// 能力派生（四层模型：AssessmentResult → CapacityState，纯函数）
import type { AssessmentResult, CapacityId, CapacityDomain, CapacityState, CapacityStatus } from '../types';

export interface AssessmentMeta {
  capacityId: CapacityId;
  domain: CapacityDomain;
  label: string;
  unit: string;
  kind: 'bilateral' | 'scalar';
  group: string;
  /** 标量阈值：min = 低于此判 below（越高越好）；max = 高于此判 below（越低越好） */
  threshold?: { min?: number; max?: number };
  /** 测试怎么做（协议说明，供评估中心展示） */
  howTo: string;
}

/** 评估协议目录（首个纵向切片 + Phase 2 扩展） */
export const ASSESSMENT_CATALOG: Record<string, AssessmentMeta> = {
  // 平衡与下肢（双侧，左右对比判短板）
  single_leg_stand: {
    capacityId: 'balance', domain: 'physical_base', label: '单腿站平衡', unit: '秒', kind: 'bilateral', group: '平衡与下肢',
    howTo: '脱鞋，单腿站立（另一脚离地、双手自然下垂或叉腰），计保持平衡的时间，失去平衡或脚落地即停。左右各测，记各自时间。',
  },
  sit_to_stand: {
    capacityId: 'joint_control', domain: 'physical_base', label: '单腿坐站', unit: '次', kind: 'bilateral', group: '平衡与下肢',
    howTo: '坐在约 45cm 高的椅子边缘，单腿支撑、另一脚离地，双手抱胸，30 秒内尽可能多起立再坐下。左右各测，记次数。',
  },
  // 力量（标量，越高越好）
  pushup: {
    capacityId: 'strength', domain: 'physical_base', label: '标准俯卧撑', unit: '次', kind: 'scalar', group: '力量', threshold: { min: 5 },
    howTo: '俯卧撑位，身体从头到脚一条线，胸部下降到接近地面再撑起，计做到力竭或动作明显变形的次数。',
  },
  // 核心（标量）
  side_plank: {
    capacityId: 'joint_control', domain: 'physical_base', label: '侧平板支撑', unit: '秒', kind: 'scalar', group: '核心', threshold: { min: 20 },
    howTo: '侧卧，用前臂和脚外侧撑起身体，肩、髋、脚成一条线，髋不塌也不拱，计保持到撑不住的时间。',
  },
  // 活动度（标量）
  ankle_dorsiflexion: {
    capacityId: 'mobility', domain: 'physical_base', label: '踝背屈（膝触墙）', unit: 'cm', kind: 'scalar', group: '活动度', threshold: { min: 8 },
    howTo: '脚尖距墙一定距离，屈膝让膝盖向前去碰墙，脚跟始终不离地；记录还能碰到墙时脚尖距墙的最大距离。',
  },
  // 心肺（标量，越低越好：同等负荷下 RPE 越低越省力）
  walk_rpe: {
    capacityId: 'aerobic', domain: 'physical_base', label: '30 分钟快走 RPE', unit: '1–10', kind: 'scalar', group: '心肺', threshold: { max: 6 },
    howTo: '快走 30 分钟后，用 1–10 分主观用力评分：6 分约等于「能说话但不想说」。数值越低，心肺越好。',
  },
};

/** 左右差异阈值：弱侧相对强侧 >25% 判 below */
export const DEFICIT_RATIO = 0.25;

function confidenceFor(basisCount: number): CapacityState['confidence'] {
  if (basisCount >= 3) return 'high';
  if (basisCount >= 2) return 'medium';
  return 'low';
}

/** 从某评估协议的历史结果派生能力状态（取最新一次；双侧左右对比、标量阈值判短板） */
export function deriveCapacityState(assessmentId: string, results: AssessmentResult[]): CapacityState | null {
  const meta = ASSESSMENT_CATALOG[assessmentId];
  if (!meta) return null;

  const rs = results.filter((r) => r.assessmentId === assessmentId);
  if (rs.length === 0) {
    return { capacityId: meta.capacityId, domain: meta.domain, status: 'unknown', confidence: 'low', basisCount: 0 };
  }

  const latest = rs[rs.length - 1];
  let status: CapacityStatus = 'normal';

  if (meta.kind === 'bilateral') {
    if (latest.left != null && latest.right != null) {
      const max = Math.max(latest.left, latest.right);
      const min = Math.min(latest.left, latest.right);
      if (max > 0 && (max - min) / max > DEFICIT_RATIO) status = 'below';
    } else {
      status = 'unknown';
    }
  } else {
    const v = latest.value ?? latest.left;
    if (v == null) {
      status = 'unknown';
    } else {
      const t = meta.threshold ?? {};
      if (t.min != null && v < t.min) status = 'below';
      else if (t.max != null && v > t.max) status = 'below';
      else status = 'normal';
    }
  }

  return {
    capacityId: meta.capacityId,
    domain: meta.domain,
    status,
    confidence: confidenceFor(rs.length),
    basisCount: rs.length,
  };
}
