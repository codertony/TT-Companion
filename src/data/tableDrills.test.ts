import { describe, it, expect } from 'vitest';
import { tableDrills } from './tableDrills';
import { LAYERS } from '../domain/tableLayer';

describe('tableDrills 内容库', () => {
  it('覆盖 L1–L7 每一层', () => {
    const layers = new Set(tableDrills.map((d) => d.layer));
    for (const id of Object.keys(LAYERS)) {
      expect(layers.has(id as keyof typeof LAYERS)).toBe(true);
    }
  });

  it('每条含 A/B 双方任务与自检要素', () => {
    for (const d of tableDrills) {
      expect(d.rule).toBeTruthy();
      expect(d.partnerTask).toBeTruthy();
      expect(d.selfCheck).toBeTruthy();
      expect(d.retentionTest).toBeTruthy();
      expect(d.transferTest).toBeTruthy();
    }
  });

  it('L1 覆盖 8 项单技术', () => {
    const l1 = tableDrills.filter((d) => d.layer === 'L1');
    expect(l1.length).toBeGreaterThanOrEqual(8);
  });

  it('L6 覆盖发抢、L7 覆盖条件局', () => {
    expect(tableDrills.filter((d) => d.layer === 'L6').length).toBeGreaterThanOrEqual(3);
    expect(tableDrills.filter((d) => d.layer === 'L7').length).toBeGreaterThanOrEqual(1);
  });

  it('三点落点为大正手/追身/大反手，不含左中右', () => {
    const l5 = tableDrills.filter((d) => d.layer === 'L5');
    expect(l5.length).toBeGreaterThan(0);
    for (const d of l5) {
      expect(d.rule).not.toMatch(/左|右|中/);
      expect(d.rule).toContain('大正手');
      expect(d.rule).toContain('大反手');
      expect(d.rule).toContain('追身');
    }
  });
});
