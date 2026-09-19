import { useState } from 'react';
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
  const [exported, setExported] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  const exportData = () => setExported(storage.exportAll());
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
        <p className="text-sm font-medium">备份数据</p>
        <p className="mt-1 text-xs text-slate-400">导出后请自行保存；换手机时可用来恢复（导入暂未开放）</p>
        <button onClick={exportData} className="mt-2 min-h-12 rounded-xl bg-slate-100 px-4 text-sm dark:bg-slate-800">
          导出 JSON
        </button>
        {exported && <textarea readOnly value={exported} className="mt-2 h-32 w-full rounded-lg border border-slate-200 p-2 text-xs dark:border-slate-700 dark:bg-slate-800" />}
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
