// 自我教练闭环（纯函数）：五问自检、四道进阶门槛、Level A–G 进阶/退阶、3 球诊断
import type { ErrorKind, Gate, GateId, ProgressionLevel, SelfCheckRecord, SelfCheckResult } from '../types';

/** 五问自检（准·净·松·顺·回）——单一事实来源：key 绑定 SelfCheckResult，label/hint 供 UI 展示 */
export const FIVE_CHECK_ITEMS: { key: keyof SelfCheckResult; label: string; hint: string }[] = [
  { key: 'accurate', label: '准', hint: '球是否稳定落到目标区域' },
  { key: 'clean', label: '净', hint: '触球是否干净、稳定' },
  { key: 'relaxed', label: '松', hint: '是否在合理用力下完成，没越来越僵' },
  { key: 'rhythm', label: '顺', hint: '能否看清球、从容击球，不被节奏追' },
  { key: 'recovered', label: '回', hint: '打完能否自然还原准备下一板' },
];

export function makeCheck(p: Partial<SelfCheckResult> = {}): SelfCheckResult {
  return { accurate: false, clean: false, relaxed: false, rhythm: false, recovered: false, ...p };
}

/** 五问结果映射：5 项全过 = pass；3–4 项 = warn；≤2 项 = fail（明显崩掉） */
export function evaluateCheck(c: SelfCheckResult): 'pass' | 'warn' | 'fail' {
  const passed = [c.accurate, c.clean, c.relaxed, c.rhythm, c.recovered].filter(Boolean).length;
  if (passed === 5) return 'pass';
  if (passed >= 3) return 'warn';
  return 'fail';
}

/** 四道进阶门槛（训练操作阈值，可校准）——单一事实来源 */
export const GATES: Gate[] = [
  { id: 'stability', name: '稳定性通过', description: '连续多组达到上台率/落点命中阈值且最后几板不变形', threshold: '上台率≥85% 且 落点命中≥70% 且 无板边' },
  { id: 'quality', name: '质量通过', description: '提高速度/落点/弧线质量后技术结构仍存在', threshold: '加 10% 速度后上台率仍≥85%' },
  { id: 'retention', name: '延迟保持', description: '隔次不热身直接测仍达标', threshold: '下次热身后直接测仍达 75–85% 质量' },
  { id: 'transfer', name: '迁移通过', description: '改变来球位置/速度/正反手条件仍能完成', threshold: '来球 ±30cm 随机仍正常完成' },
];

/** 进阶算法 Level A–G 名称——单一事实来源 */
export const LEVEL_NAMES: Record<ProgressionLevel, string> = {
  A: '固定',
  B: '增加质量',
  C: '增加变化',
  D: '半随机',
  E: '随机',
  F: '前后板组合',
  G: '比赛迁移',
};

/** 由 LEVEL_NAMES 派生的有序 key 列表（避免与类型联合体手工维护两份） */
export const LEVELS = Object.keys(LEVEL_NAMES) as ProgressionLevel[];

/** 最常见失误分类 label——单一事实来源 */
export const ERROR_LABELS: Record<ErrorKind, string> = {
  net: '下网',
  out: '出界',
  edge: '板边',
  late: '来不及',
  jammed: '被顶',
  flat_foot: '站死',
  slow_recovery: '还原慢',
};

export function nextLevel(current: ProgressionLevel): ProgressionLevel | null {
  const i = LEVELS.indexOf(current);
  return i >= 0 && i < LEVELS.length - 1 ? LEVELS[i + 1] : null;
}

export function regressLevel(current: ProgressionLevel): ProgressionLevel {
  const i = LEVELS.indexOf(current);
  return i > 0 ? LEVELS[i - 1] : LEVELS[0];
}

/** 崩掉退一级：五问明显崩掉（≤2 项过）则退回上一级，找当前最高可控难度 */
export function regressIfBroken(
  current: ProgressionLevel,
  check: SelfCheckResult,
): { level: ProgressionLevel; regressed: boolean } {
  if (evaluateCheck(check) === 'fail') return { level: regressLevel(current), regressed: true };
  return { level: current, regressed: false };
}

/** 四道门槛判定 */
export function gatePassed(gate: GateId, r: SelfCheckRecord): boolean {
  const successRate = r.successTotal > 0 ? r.successMade / r.successTotal : 0;
  const placementRate = r.placementTotal > 0 ? r.placementMade / r.placementTotal : 0;
  if (gate === 'stability') return successRate >= 0.85 && placementRate >= 0.7 && r.topError !== 'edge';
  if (gate === 'quality') return successRate >= 0.85;
  if (gate === 'retention') return successRate >= 0.75;
  return successRate >= 0.7; // transfer
}

/** 3 球诊断法：连续 3 次同类错误才判为稳定问题 */
export function diagnose(errors: ErrorKind[]): { flag: boolean; error?: ErrorKind } {
  let run = 1;
  for (let i = 1; i < errors.length; i++) {
    run = errors[i] === errors[i - 1] ? run + 1 : 1;
    if (run >= 3) return { flag: true, error: errors[i] };
  }
  return { flag: false };
}
