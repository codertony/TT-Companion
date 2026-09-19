// localStorage 封装：所有持久化访问收敛到此单例，便于未来迁 IndexedDB/云端
const NS = 'ttc:';

export const storage = {
  get<T>(key: string): T | null {
    const raw = localStorage.getItem(NS + key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  set(key: string, value: unknown): void {
    localStorage.setItem(NS + key, JSON.stringify(value));
  },

  remove(key: string): void {
    localStorage.removeItem(NS + key);
  },

  exportAll(): string {
    const data: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(NS)) {
        data[k] = JSON.parse(localStorage.getItem(k) ?? 'null');
      }
    }
    return JSON.stringify(data, null, 2);
  },

  clearAll(): void {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(NS)) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
  },
};
