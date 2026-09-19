export interface OcclusionResult {
  cutMs: number;
  correct: boolean;
}

/** 各截断时点的正确率（Early Cue Level 的基础） */
export function accuracyByCut(results: OcclusionResult[]): Record<number, number> {
  const byCut = new Map<number, { total: number; correct: number }>();
  for (const r of results) {
    const cur = byCut.get(r.cutMs) ?? { total: 0, correct: 0 };
    cur.total += 1;
    if (r.correct) cur.correct += 1;
    byCut.set(r.cutMs, cur);
  }
  const acc: Record<number, number> = {};
  for (const [cut, { total, correct }] of byCut) {
    acc[cut] = total > 0 ? correct / total : 0;
  }
  return acc;
}

/** 最早可稳定判断的截断时点：正确率 ≥ 阈值的第一个（最早）时点 */
export function earliestCueLevel(acc: Record<number, number>, threshold = 0.8): number | null {
  const cuts = Object.keys(acc)
    .map(Number)
    .sort((a, b) => a - b);
  for (const cut of cuts) {
    if (acc[cut] >= threshold) return cut;
  }
  return null;
}
