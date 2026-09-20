// 备份/导入的纯逻辑：封套、校验、版本迁移（可单测，不依赖 localStorage/DOM）

export const BACKUP_FORMAT = 'ttc-backup';
export const CURRENT_SCHEMA_VERSION = 1;

export interface BackupEnvelope {
  format: string;
  schemaVersion: number;
  exportedAt: string;
  data: Record<string, unknown>;
}

/** schema 迁移表：key 为「从该版本迁移」，value 返回迁移后的 data（v1→v2 时在此登记） */
const MIGRATIONS: Record<number, (data: Record<string, unknown>) => Record<string, unknown>> = {};

export function buildEnvelope(data: Record<string, unknown>, now = new Date()): BackupEnvelope {
  return {
    format: BACKUP_FORMAT,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    exportedAt: now.toISOString(),
    data,
  };
}

export type ValidateResult = { ok: true; value: BackupEnvelope } | { ok: false; error: string };

export function validateEnvelope(input: unknown): ValidateResult {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    return { ok: false, error: '不是有效的备份对象' };
  }
  const env = input as Partial<BackupEnvelope>;
  if (env.format !== BACKUP_FORMAT) {
    return { ok: false, error: '文件缺少备份标记，可能不是本应用导出的文件' };
  }
  if (typeof env.schemaVersion !== 'number' || env.schemaVersion < 1 || env.schemaVersion > CURRENT_SCHEMA_VERSION) {
    return { ok: false, error: `不支持的备份版本 ${String(env.schemaVersion)}` };
  }
  if (typeof env.data !== 'object' || env.data === null || Array.isArray(env.data)) {
    return { ok: false, error: '备份数据为空或格式错误' };
  }
  return { ok: true, value: env as BackupEnvelope };
}

export function migrateData(data: Record<string, unknown>, fromVersion: number): Record<string, unknown> {
  let cur = data;
  for (let v = fromVersion; v < CURRENT_SCHEMA_VERSION; v++) {
    const fn = MIGRATIONS[v];
    if (fn) cur = fn(cur);
  }
  return cur;
}
