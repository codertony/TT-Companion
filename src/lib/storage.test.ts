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
});
