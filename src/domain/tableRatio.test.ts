import { describe, it, expect } from 'vitest';
import { tableRatio, SKILL_PROGRESSION } from './tableRatio';

describe('tableRatio', () => {
  const levels = [0, 0.25, 0.5, 0.75, 1];

  it('配比和始终为 100', () => {
    for (const t of levels) {
      const r = tableRatio(t);
      expect(r.fixed + r.footwork + r.semi + r.serveReceive + r.random).toBe(100);
    }
  });

  it('随水平提升，随机/比赛占比单调不降，固定占比单调不升', () => {
    const rs = levels.map(tableRatio);
    for (let i = 1; i < rs.length; i++) {
      expect(rs[i].random).toBeGreaterThanOrEqual(rs[i - 1].random);
      expect(rs[i].fixed).toBeLessThanOrEqual(rs[i - 1].fixed);
    }
  });

  it('进阶顺序为 稳定性 → 落点 → 节奏 → 速度 → 力量', () => {
    expect(SKILL_PROGRESSION).toEqual(['稳定性', '落点', '节奏', '速度', '力量']);
  });
});
