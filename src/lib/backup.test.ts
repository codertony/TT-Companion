import { describe, it, expect } from 'vitest';
import { BACKUP_FORMAT, buildEnvelope, migrateData, validateEnvelope, CURRENT_SCHEMA_VERSION } from './backup';

describe('backup', () => {
  it('buildEnvelope 产物可被 validateEnvelope 接受', () => {
    const env = buildEnvelope({ 'ttc:settings': { theme: 'dark' } });
    const v = validateEnvelope(env);
    expect(v.ok).toBe(true);
    if (v.ok) {
      expect(v.value.format).toBe(BACKUP_FORMAT);
      expect(v.value.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
      expect(v.value.data['ttc:settings']).toEqual({ theme: 'dark' });
    }
  });

  it('拒绝非对象输入', () => {
    expect(validateEnvelope('x').ok).toBe(false);
    expect(validateEnvelope(null).ok).toBe(false);
    expect(validateEnvelope([1, 2]).ok).toBe(false);
  });

  it('拒绝错误格式标记', () => {
    const v = validateEnvelope({ format: 'other', schemaVersion: 1, exportedAt: '', data: {} });
    expect(v.ok).toBe(false);
    if (!v.ok) expect(v.error).toContain('备份标记');
  });

  it('拒绝未来版本', () => {
    const v = validateEnvelope({ format: BACKUP_FORMAT, schemaVersion: 99, exportedAt: '', data: {} });
    expect(v.ok).toBe(false);
  });

  it('拒绝空 data', () => {
    const v = validateEnvelope({ format: BACKUP_FORMAT, schemaVersion: 1, exportedAt: '', data: null });
    expect(v.ok).toBe(false);
  });

  it('migrateData 对当前版本为恒等', () => {
    const data = { 'ttc:settings': { theme: 'light' } };
    expect(migrateData(data, CURRENT_SCHEMA_VERSION)).toBe(data);
  });
});
