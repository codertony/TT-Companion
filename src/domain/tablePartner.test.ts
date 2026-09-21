import { describe, it, expect } from 'vitest';
import { adaptForPartner, PARTNER_PROTOCOL } from './tablePartner';
import { getDrill } from '../data/tableDrills';

describe('球搭子协议', () => {
  it('八条规则', () => {
    expect(PARTNER_PROTOCOL).toHaveLength(8);
  });
});

describe('adaptForPartner', () => {
  const drill = getDrill('l1_fh_drive')!;

  it('低水平 → 落点放宽到半台、先上旋后下旋', () => {
    const a = adaptForPartner(drill, 'beginner');
    expect(a.rule).toContain('半台');
    expect(a.rule).toContain('上旋');
    expect(a.rule).toContain('下旋');
    expect(a.partnerTask).toContain('不要求落点精确');
  });

  it('高水平 → 提示 70% 质量', () => {
    const a = adaptForPartner(drill, 'higher');
    expect(a.partnerTask).toContain('70%');
  });
});
