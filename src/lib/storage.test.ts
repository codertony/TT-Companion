import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from './storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('set/get 往返一致', () => {
    storage.set('test', { a: 1, b: 'x' });
    expect(storage.get('test')).toEqual({ a: 1, b: 'x' });
  });

  it('缺失 key 返回 null', () => {
    expect(storage.get('missing')).toBeNull();
  });

  it('remove 后返回 null', () => {
    storage.set('test', 1);
    storage.remove('test');
    expect(storage.get('test')).toBeNull();
  });

  it('exportBackup → importBackup 往返一致', () => {
    storage.set('sessions', [{ id: 's1', date: '2026-09-20' }]);
    storage.set('settings', { theme: 'dark' });
    const json = storage.exportBackup();
    storage.clearAll();
    const result = storage.importBackup(json);
    expect(result.ok).toBe(true);
    expect(result.keysWritten).toBe(2);
    expect(storage.get('sessions')).toEqual([{ id: 's1', date: '2026-09-20' }]);
    expect(storage.get('settings')).toEqual({ theme: 'dark' });
  });

  it('importBackup 拒绝非法 JSON', () => {
    const result = storage.importBackup('not-json');
    expect(result.ok).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('importBackup 拒绝非备份文件', () => {
    const result = storage.importBackup(JSON.stringify({ hello: 'world' }));
    expect(result.ok).toBe(false);
  });
});
