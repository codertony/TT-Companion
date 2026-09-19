import { useState } from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import { storage } from '../../lib/storage';

export default function SettingsPage() {
  const reaction = useSettingsStore((s) => s.reaction);
  const sound = useSettingsStore((s) => s.sound);
  const update = useSettingsStore((s) => s.update);
  const [exported, setExported] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  const exportData = () => setExported(storage.exportAll());
  const clearData = () => {
    storage.clearAll();
    window.location.reload();
  };

  return (
    <div className="mx-auto min-h-dvh w-full max-w-md bg-slate-50 px-5 py-8 pb-24 text-slate-900">
      <h2 className="text-2xl font-semibold">设置</h2>

      <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-slate-100">
        <p className="text-sm font-medium">反应刺激显示时长</p>
        <div className="mt-2 flex gap-2">
          {[300, 500, 800, 1000].map((ms) => (
            <button
              key={ms}
              onClick={() => update({ reaction: { ...reaction, displayMs: ms } })}
              className={`rounded-lg px-3 py-1 text-xs ${reaction.displayMs === ms ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}
            >
              {ms}ms
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm font-medium">声音</p>
        <button onClick={() => update({ sound: !sound })} className="mt-2 rounded-lg bg-slate-100 px-3 py-1 text-xs">
          {sound ? '开' : '关'}
        </button>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-slate-100">
        <p className="text-sm font-medium">数据</p>
        <button onClick={exportData} className="mt-2 rounded-lg bg-slate-100 px-3 py-1 text-xs">
          导出 JSON
        </button>
        {exported && <textarea readOnly value={exported} className="mt-2 h-32 w-full rounded-lg border border-slate-200 p-2 text-xs" />}
        {confirmClear ? (
          <div className="mt-2 flex gap-2">
            <button onClick={clearData} className="rounded-lg bg-red-600 px-3 py-1 text-xs text-white">
              确认清空
            </button>
            <button onClick={() => setConfirmClear(false)} className="rounded-lg bg-slate-100 px-3 py-1 text-xs">
              取消
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirmClear(true)} className="mt-2 rounded-lg bg-slate-100 px-3 py-1 text-xs">
            清空全部数据
          </button>
        )}
      </div>
    </div>
  );
}
