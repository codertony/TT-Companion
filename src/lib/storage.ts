// localStorage 封装：所有持久化访问收敛到此单例，便于未来迁 IndexedDB/云端
import { buildEnvelope, migrateData, validateEnvelope, CURRENT_SCHEMA_VERSION } from './backup';

const NS = 'ttc:';

export interface ImportResult {
  ok: boolean;
  keysWritten: number;
  migratedFrom?: number;
  error?: string;
}

function readAll(): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(NS)) {
      try {
        data[k] = JSON.parse(localStorage.getItem(k) ?? 'null');
      } catch {
        data[k] = null;
      }
    }
  }
  return data;
}

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

  /** 原始数据（key 为完整 `ttc:*` 前缀），供导出与测试使用 */
  exportAll(): string {
    return JSON.stringify(readAll(), null, 2);
  },

  /** 导出带封套的完整备份（含 schemaVersion 与导出时间） */
  exportBackup(): string {
    return JSON.stringify(buildEnvelope(readAll()), null, 2);
  },

  /** 导入备份：解析 → 校验 → 迁移 → 写回。返回结果而非抛异常。 */
  importBackup(json: string): ImportResult {
    let parsed: unknown;
    try {
      parsed = JSON.parse(json);
    } catch {
      return { ok: false, keysWritten: 0, error: '无法解析 JSON，请确认文件内容' };
    }
    const v = validateEnvelope(parsed);
    if (!v.ok) return { ok: false, keysWritten: 0, error: v.error };

    const env = v.value;
    const data = migrateData(env.data, env.schemaVersion);
    const keys = Object.keys(data).filter((k) => k.startsWith(NS));
    for (const k of keys) {
      localStorage.setItem(k, JSON.stringify(data[k]));
    }
    return {
      ok: true,
      keysWritten: keys.length,
      ...(env.schemaVersion < CURRENT_SCHEMA_VERSION ? { migratedFrom: env.schemaVersion } : {}),
    };
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
