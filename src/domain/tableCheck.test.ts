import { describe, it, expect } from 'vitest';
import {
  diagnose,
  evaluateCheck,
  gatePassed,
  LEVEL_NAMES,
  LEVELS,
  makeCheck,
  nextLevel,
  regressIfBroken,
} from './tableCheck';
import type { SelfCheckRecord } from '../types';

function rec(over: Partial<SelfCheckRecord> = {}): SelfCheckRecord {
  return {
    id: 'x',
    date: '2026-01-01',
    drillId: 'd',
    successMade: 0,
    successTotal: 0,
    longestStreak: 0,
    placementMade: 0,
    placementTotal: 0,
    rpe: 4,
    check: makeCheck(),
    focusPoint: 'f',
    topError: 'out',
    ...over,
  };
}

describe('evaluateCheck', () => {
  it('五项全过 = pass', () => {
    expect(evaluateCheck(makeCheck({ accurate: true, clean: true, relaxed: true, rhythm: true, recovered: true }))).toBe('pass');
  });
  it('3–4 项过 = warn', () => {
    expect(evaluateCheck(makeCheck({ accurate: true, clean: true, relaxed: true }))).toBe('warn');
  });
  it('≤2 项过 = fail', () => {
    expect(evaluateCheck(makeCheck({ accurate: true, clean: true }))).toBe('fail');
  });
});

describe('gatePassed', () => {
  it('稳定性门槛：上台率≥85%、落点≥70%、无板边 → 通过', () => {
    expect(gatePassed('stability', rec({ successMade: 18, successTotal: 20, placementMade: 15, placementTotal: 20, topError: 'out' }))).toBe(true);
  });
  it('稳定性门槛：上台率不足 → 不通过', () => {
    expect(gatePassed('stability', rec({ successMade: 10, successTotal: 20 }))).toBe(false);
  });
  it('迁移门槛：上台率≥70% → 通过', () => {
    expect(gatePassed('transfer', rec({ successMade: 7, successTotal: 10 }))).toBe(true);
  });
});

describe('进阶/退阶', () => {
  it('LEVELS 由 LEVEL_NAMES 派生且有序', () => {
    expect(LEVELS).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
    expect(LEVEL_NAMES.D).toBe('半随机');
  });
  it('nextLevel 与 regressLevel', () => {
    expect(nextLevel('A')).toBe('B');
    expect(nextLevel('G')).toBeNull();
    expect(regressIfBroken('A', makeCheck()).level).toBe('A');
  });
  it('明显崩掉（fail）→ 退一级', () => {
    const r = regressIfBroken('D', makeCheck({ accurate: true }));
    expect(r.regressed).toBe(true);
    expect(r.level).toBe('C');
  });
  it('未崩掉 → 不退', () => {
    const r = regressIfBroken('D', makeCheck({ accurate: true, clean: true, relaxed: true }));
    expect(r.regressed).toBe(false);
    expect(r.level).toBe('D');
  });
});

describe('3 球诊断法', () => {
  it('连续 3 次同类错误才判稳定问题', () => {
    expect(diagnose(['out', 'out', 'out'])).toEqual({ flag: true, error: 'out' });
  });
  it('不连续的错误不判', () => {
    expect(diagnose(['out', 'net', 'out'])).toEqual({ flag: false });
  });
});
