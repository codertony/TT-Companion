import { useRef, useState } from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import { storage } from '../../lib/storage';
import type { Theme } from '../../types';

const themes: { id: Theme; label: string }[] = [
  { id: 'light', label: '普通' },
  { id: 'dark', label: '暗黑' },
  { id: 'system', label: '跟随系统' },
];

export default function SettingsPage() {
  const reaction = useSettingsStore((s) => s.reaction);
  const sound = useSettingsStore((s) => s.sound);
  const theme = useSettingsStore((s) => s.theme);
  const update = useSettingsStore((s) => s.update);
  const [confirmClear, setConfirmClear] = useState(false);
  const [importMsg, setImportMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const downloadBackup = () => {
    const json = storage.exportBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tt-companion-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const importBackup = async (file: File) => {
    const text = await file.text();
    const result = storage.importBackup(text);
    if (result.ok) {
      setImportMsg({
        ok: true,
        text: result.migratedFrom
          ? `已从 v${result.migratedFrom} 迁移并导入 ${result.keysWritten} 项数据，即将刷新`
          : `已导入 ${result.keysWritten} 项数据，即将刷新`,
      });
      window.setTimeout(() => window.location.reload(), 800);
    } else {
      setImportMsg({ ok: false, text: result.error ?? '导入失败' });
    }
  };

  const clearData = () => {
    storage.clearAll();
    window.location.reload();
  };

  return (
    <div className="mx-auto min-h-dvh w-full max-w-md bg-slate-50 px-5 py-8 pb-24 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <h2 className="text-2xl font-semibold">设置</h2>

      <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
        <p className="text-sm font-medium">外观主题</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => update({ theme: t.id })}
              className={`min-h-12 rounded-xl text-sm ${theme === t.id ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
        <p className="text-sm font-medium">反应提示闪现时长</p>
        <p className="mt-1 text-xs text-slate-400">数值越小越难看清，练的是眼快手快</p>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {[300, 500, 800, 1000].map((ms) => (
            <button
              key={ms}
              onClick={() => update({ reaction: { ...reaction, displayMs: ms } })}
              className={`min-h-12 rounded-xl text-xs ${reaction.displayMs === ms ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
            >
              {ms}ms{ms === 500 ? ' 推荐' : ''}
            </button>
          ))}
        </div>

        <p className="mt-4 text-sm font-medium">训练提示音</p>
        <button
          onClick={() => update({ sound: !sound })}
          role="switch"
          aria-checked={sound}
          className="mt-2 min-h-12 rounded-xl bg-slate-100 px-4 text-sm dark:bg-slate-800"
        >
          {sound ? '开' : '关'}
        </button>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
        <p className="text-sm font-medium">备份与恢复</p>
        <p className="mt-1 text-xs text-slate-400">导出后请妥善保存；换手机或误删后可用 JSON 文件完整恢复。</p>
        <div className="mt-2 flex gap-2">
          <button onClick={downloadBackup} className="min-h-12 flex-1 rounded-xl bg-slate-100 px-4 text-sm dark:bg-slate-800">
            下载备份
          </button>
          <button onClick={() => fileRef.current?.click()} className="min-h-12 flex-1 rounded-xl bg-slate-100 px-4 text-sm dark:bg-slate-800">
            导入备份
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void importBackup(f);
            e.target.value = '';
          }}
        />
        {importMsg && (
          <p className={`mt-2 text-xs ${importMsg.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {importMsg.text}
          </p>
        )}
      </div>

      <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
        <p className="text-sm font-medium text-red-600 dark:text-red-400">清空全部数据</p>
        <p className="mt-1 text-xs text-slate-400">将删除训练记录、ONE CUE 与设置，且无法恢复。</p>
        {confirmClear ? (
          <div className="mt-2 flex gap-2">
            <button onClick={clearData} className="min-h-12 flex-1 rounded-xl bg-red-600 text-sm text-white">
              确认清空（不可恢复）
            </button>
            <button onClick={() => setConfirmClear(false)} className="min-h-12 flex-1 rounded-xl bg-slate-100 text-sm dark:bg-slate-800">
              取消
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirmClear(true)} className="mt-2 min-h-12 rounded-xl border border-red-200 px-4 text-sm text-red-600 dark:border-red-900 dark:text-red-400">
            清空全部数据
          </button>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">TT-Companion · 数据仅存于本机</p>
    </div>
  );
}
