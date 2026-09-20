import { describe, it, expect, beforeEach } from 'vitest';
import { createLocalStorageRepository } from './repository';

describe('repository', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('空仓库返回空数组', () => {
    const repo = createLocalStorageRepository<{ id: string }>('x');
    expect(repo.getAll()).toEqual([]);
  });

  it('add/getAll 往返一致，新项在前', () => {
    const repo = createLocalStorageRepository<{ id: string }>('x');
    repo.add({ id: 'a' });
    repo.add({ id: 'b' });
    expect(repo.getAll()).toEqual([{ id: 'b' }, { id: 'a' }]);
  });

  it('replaceAll 覆盖', () => {
    const repo = createLocalStorageRepository<{ id: string }>('x');
    repo.replaceAll([{ id: 'z' }]);
    expect(repo.getAll()).toEqual([{ id: 'z' }]);
  });

  it('clear 清空', () => {
    const repo = createLocalStorageRepository<{ id: string }>('x');
    repo.add({ id: 'a' });
    repo.clear();
    expect(repo.getAll()).toEqual([]);
  });

  it('损坏数据返回空数组而非抛错', () => {
    localStorage.setItem('ttc:x', '{bad json');
    const repo = createLocalStorageRepository<{ id: string }>('x');
    expect(repo.getAll()).toEqual([]);
  });
});
