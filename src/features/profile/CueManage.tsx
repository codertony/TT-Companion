import { useState } from 'react';
import { useCueStore } from '../../stores/cueStore';
import { CUE_TAG_LABELS } from '../../lib/cue';
import type { CueTag, CueType } from '../../types';

const types: { id: CueType; label: string; sub: string }[] = [
  { id: 'technique', label: '技术', sub: '动作怎么做' },
  { id: 'perception', label: '意识', sub: '什么时候看和判断' },
  { id: 'movement', label: '移动', sub: '脚下怎么到位' },
];

const tags = (Object.entries(CUE_TAG_LABELS) as [CueTag, string][]).map(([id, label]) => ({ id, label }));

export default function CueManage() {
  const { primary, backlog, history, add, activate, archive, reorder } = useCueStore();
  const [text, setText] = useState('');
  const [type, setType] = useState<CueType | null>(null);
  const [selectedTags, setSelectedTags] = useState<CueTag[]>([]);

  const submit = () => {
    if (!text.trim() || !type) return;
    add({ text: text.trim(), skill: 'forehand_drive', tags: selectedTags, type, priority: backlog.length + 1 });
    setText('');
    setType(null);
    setSelectedTags([]);
  };

  const toggleTag = (t: CueTag) =>
    setSelectedTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  return (
    <div className="mx-auto min-h-dvh w-full max-w-md bg-slate-50 px-5 py-8 pb-24 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <h2 className="text-2xl font-semibold">ONE CUE 管理</h2>

      {primary && (
        <div className="mt-4 rounded-2xl bg-blue-50 p-4 dark:bg-blue-950">
          <p className="text-xs text-blue-500 dark:text-blue-400">当前（本周唯一）</p>
          <p className="mt-1 text-xl font-semibold">{primary.text}</p>
          <button onClick={() => archive(primary.id)} className="mt-2 min-h-11 text-sm text-slate-500 dark:text-slate-400">
            暂停并归档
          </button>
        </div>
      )}

      <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
        <p className="text-sm font-medium">添加一个问题</p>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="这周最想改的毛病，如：身体先走，手不要抢"
          className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-700 dark:bg-slate-800"
        />

        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">它属于哪一类？</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {types.map((t) => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              className={`min-h-12 rounded-xl p-2 text-center ${
                type === t.id ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
              }`}
            >
              <span className="block text-sm font-medium">{t.label}</span>
              <span className={`block text-[10px] ${type === t.id ? 'text-blue-100' : 'text-slate-400'}`}>{t.sub}</span>
            </button>
          ))}
        </div>

        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">它通常表现为（可多选，不选也行）</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((t) => (
            <button
              key={t.id}
              onClick={() => toggleTag(t.id)}
              className={`min-h-11 rounded-lg px-3 text-xs ${
                selectedTags.includes(t.id) ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <button
          onClick={submit}
          disabled={!text.trim() || !type}
          className="mt-4 h-12 w-full rounded-lg bg-blue-600 text-sm text-white disabled:opacity-40"
        >
          添加
        </button>
        {(!text.trim() || !type) && <p className="mt-1 text-xs text-slate-400">先写下问题并选一个类别</p>}
      </div>

      <p className="mt-6 text-sm font-medium text-slate-500 dark:text-slate-400">待处理 Backlog</p>
      {backlog.length === 0 ? (
        <p className="mt-2 text-sm text-slate-400">暂无，添加一个问题开始</p>
      ) : (
        <div className="mt-2 flex flex-col gap-2">
          {backlog.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-xl bg-white p-3 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
              <span className="text-sm">{c.text}</span>
              <span className="flex items-center gap-1">
                <button onClick={() => reorder(c.id, -1)} className="flex h-11 w-11 items-center justify-center text-slate-400">
                  ↑
                </button>
                <button onClick={() => reorder(c.id, 1)} className="flex h-11 w-11 items-center justify-center text-slate-400">
                  ↓
                </button>
                <button
                  onClick={() => activate(c.id)}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-xs text-white"
                >
                  {primary ? '设为本周（当前将归档）' : '设为本周'}
                </button>
              </span>
            </div>
          ))}
        </div>
      )}

      {history.length > 0 && (
        <>
          <p className="mt-6 text-sm font-medium text-slate-500 dark:text-slate-400">历史</p>
          <div className="mt-2 flex flex-col gap-2">
            {history.map((c) => (
              <div key={c.id} className="rounded-xl bg-white p-3 text-sm text-slate-500 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
                {c.text}
                <span className={`ml-2 text-xs ${c.status === 'done' ? 'text-lime-600 dark:text-lime-400' : 'text-slate-400'}`}>
                  {c.status === 'done' ? '已达成' : '已归档'}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
