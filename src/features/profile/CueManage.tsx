import { useState } from 'react';
import { useCueStore } from '../../stores/cueStore';
import type { CueTag, CueType } from '../../types';

const types: { id: CueType; label: string }[] = [
  { id: 'technique', label: '技术' },
  { id: 'perception', label: '意识' },
  { id: 'movement', label: '移动' },
];

const tags: { id: CueTag; label: string }[] = [
  { id: 'arm_stiff', label: '手臂僵硬' },
  { id: 'hand_first', label: '手先启动' },
  { id: 'footwork_slow', label: '步法慢' },
  { id: 'recovery_slow', label: '还原慢' },
  { id: 'early_hit', label: '击球偏早' },
];

export default function CueManage() {
  const { primary, backlog, history, add, activate, archive, reorder } = useCueStore();
  const [text, setText] = useState('');
  const [type, setType] = useState<CueType>('technique');
  const [selectedTags, setSelectedTags] = useState<CueTag[]>([]);

  const submit = () => {
    if (!text.trim()) return;
    add({ text: text.trim(), skill: 'forehand_drive', tags: selectedTags, type, priority: backlog.length + 1 });
    setText('');
    setSelectedTags([]);
  };

  const toggleTag = (t: CueTag) =>
    setSelectedTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  return (
    <div className="mx-auto min-h-dvh w-full max-w-md bg-slate-50 px-5 py-8 pb-24 text-slate-900">
      <h2 className="text-2xl font-semibold">ONE CUE 管理</h2>

      {primary && (
        <div className="mt-4 rounded-2xl bg-blue-50 p-4">
          <p className="text-xs text-blue-500">当前（本周唯一）</p>
          <p className="mt-1 text-xl font-semibold">{primary.text}</p>
          <button onClick={() => archive(primary.id)} className="mt-2 text-sm text-slate-500">
            暂停并归档
          </button>
        </div>
      )}

      <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-slate-100">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="想改的问题，如：身体先走，手不要抢"
          className="w-full rounded-lg border border-slate-200 p-2 text-sm"
        />
        <div className="mt-3 flex gap-2">
          {types.map((t) => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              className={`rounded-lg px-3 py-1 text-xs ${type === t.id ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((t) => (
            <button
              key={t.id}
              onClick={() => toggleTag(t.id)}
              className={`rounded-lg px-2 py-1 text-xs ${selectedTags.includes(t.id) ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button onClick={submit} className="mt-3 h-10 w-full rounded-lg bg-blue-600 text-sm text-white">
          添加
        </button>
      </div>

      <p className="mt-6 text-sm font-medium text-slate-500">待处理 Backlog</p>
      {backlog.length === 0 ? (
        <p className="mt-2 text-sm text-slate-400">暂无，添加一个问题开始</p>
      ) : (
        <div className="mt-2 flex flex-col gap-2">
          {backlog.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-xl bg-white p-3 ring-1 ring-slate-100">
              <span className="text-sm">{c.text}</span>
              <span className="flex items-center gap-1">
                <button onClick={() => reorder(c.id, -1)} className="px-1 text-slate-400">
                  ↑
                </button>
                <button onClick={() => reorder(c.id, 1)} className="px-1 text-slate-400">
                  ↓
                </button>
                <button onClick={() => activate(c.id)} className="rounded-lg bg-blue-600 px-2 py-1 text-xs text-white">
                  设为本周
                </button>
              </span>
            </div>
          ))}
        </div>
      )}

      {history.length > 0 && (
        <>
          <p className="mt-6 text-sm font-medium text-slate-500">历史</p>
          <div className="mt-2 flex flex-col gap-2">
            {history.map((c) => (
              <div key={c.id} className="rounded-xl bg-white p-3 text-sm text-slate-500 ring-1 ring-slate-100">
                {c.text}
                <span className="ml-2 text-xs text-slate-400">{c.status === 'done' ? '已达成' : '已归档'}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
