// 能力派生（四层模型：AssessmentResult → CapacityState，纯函数）
import type { AssessmentResult, CapacityId, CapacityDomain, CapacityState, CapacityStatus } from '../types';

export interface AssessmentMeta {
  capacityId: CapacityId;
  domain: CapacityDomain;
  label: string;
}

/** 评估协议 → 能力映射（首个纵向切片：单腿稳定 / 下肢控制） */
export const ASSESSMENT_CAPACITY: Record<string, AssessmentMeta> = {
  single_leg_stand: { capacityId: 'balance', domain: 'physical_base', label: '静态平衡' },
  sit_to_stand: { capacityId: 'joint_control', domain: 'physical_base', label: '下肢控制' },
};

/** 左右差异阈值：弱侧相对强侧 >25% 判 below */
export const DEFICIT_RATIO = 0.25;

function confidenceFor(basisCount: number): CapacityState['confidence'] {
  if (basisCount >= 3) return 'high';
  if (basisCount >= 2) return 'medium';
  return 'low';
}

/** 从某评估协议的历史结果派生能力状态（取最新一次，左右对比判短板） */
export function deriveCapacityState(assessmentId: string, results: AssessmentResult[]): CapacityState | null {
  const meta = ASSESSMENT_CAPACITY[assessmentId];
  if (!meta) return null;

  const rs = results.filter((r) => r.assessmentId === assessmentId);
  if (rs.length === 0) {
    return { capacityId: meta.capacityId, domain: meta.domain, status: 'unknown', confidence: 'low', basisCount: 0 };
  }

  const latest = rs[rs.length - 1];
  let status: CapacityStatus = 'normal';

  if (latest.left != null && latest.right != null) {
    const max = Math.max(latest.left, latest.right);
    const min = Math.min(latest.left, latest.right);
    if (max > 0 && (max - min) / max > DEFICIT_RATIO) status = 'below';
  } else {
    // 标量测试的阈值由协议定义，这里不硬编码
    status = 'unknown';
  }

  return {
    capacityId: meta.capacityId,
    domain: meta.domain,
    status,
    confidence: confidenceFor(rs.length),
    basisCount: rs.length,
  };
}
