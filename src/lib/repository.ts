// 统一 Repository 接口：隔离领域层与存储实现（Phase 0 用 localStorage，后续可换 IndexedDB/云）
export interface Repository<T> {
  getAll(): T[];
  add(item: T): void;
  replaceAll(items: T[]): void;
  clear(): void;
}

const NS = 'ttc:';

export function createLocalStorageRepository<T>(key: string): Repository<T> {
  const fullKey = NS + key;
  return {
    getAll(): T[] {
      try {
        const raw = localStorage.getItem(fullKey);
        const parsed = raw ? (JSON.parse(raw) as unknown) : [];
        return Array.isArray(parsed) ? (parsed as T[]) : [];
      } catch {
        return [];
      }
    },
    add(item: T): void {
      const all = this.getAll();
      all.unshift(item);
      localStorage.setItem(fullKey, JSON.stringify(all));
    },
    replaceAll(items: T[]): void {
      localStorage.setItem(fullKey, JSON.stringify(items));
    },
    clear(): void {
      localStorage.removeItem(fullKey);
    },
  };
}
