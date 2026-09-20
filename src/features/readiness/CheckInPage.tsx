import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCheckinStore } from '../../stores/checkinStore';

const SLEEP_OPTS = [
  { h: 4, label: '≤5h' },
  { h: 6, label: '6–7h' },
  { h: 8, label: '≥8h' },
];

const FATIGUE_OPTS = [
  { v: 2, label: '精神好' },
  { v: 5, label: '一般' },
  { v: 8, label: '很累' },
];

const PAIN_PARTS = ['肩', '肘', '腰', '膝', '踝'];
const WARNING = ['胸痛', '晕厥', '异常气促'];

export default function CheckInPage() {
  const nav = useNavigate();
  const add = useCheckinStore((s) => s.add);
  const [sleep, setSleep] = useState<number | null>(null);
  const [fatigue, setFatigue] = useState(5);
  const [pain, setPain] = useState<string[]>([]);
  const [warning, setWarning] = useState<string[]>([]);

  const toggle = (list: string[], set: (v: string[]) => void, v: string) => {
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  };

  const save = () => {
    add({
      sleepHours: sleep ?? undefined,
      fatigue,
      painParts: pain.length ? pain : undefined,
      warningSymptoms: warning.length ? warning : undefined,
    });
    nav('/');
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-slate-50 px-5 py-8 pb-24 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">今日 Check-in</h2>
        <Link to="/" className="inline-flex h-12 items-center px-2 text-sm text-slate-400 dark:text-slate-500">
          返回
        </Link>
      </div>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">20 秒，判断今天能不能练、练多重。</p>

      <p className="mt-6 text-sm font-medium text-slate-500 dark:text-slate-400">昨晚睡眠</p>
      <div className="mt-2 flex gap-2">
        {SLEEP_OPTS.map((o) => (
          <button
            key={o.h}
            onClick={() => setSleep(o.h)}
            className={`h-12 flex-1 rounded-xl text-sm ${
              sleep === o.h ? 'bg-blue-600 text-white' : 'bg-white ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm font-medium text-slate-500 dark:text-slate-400">现在感觉</p>
      <div className="mt-2 flex gap-2">
        {FATIGUE_OPTS.map((o) => (
          <button
            key={o.v}
            onClick={() => setFatigue(o.v)}
            className={`h-12 flex-1 rounded-xl text-sm ${
              fatigue === o.v ? 'bg-blue-600 text-white' : 'bg-white ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm font-medium text-slate-500 dark:text-slate-400">有疼痛或不适的部位（可多选）</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {PAIN_PARTS.map((p) => (
          <button
            key={p}
            onClick={() => toggle(pain, setPain, p)}
            className={`h-12 rounded-xl px-4 text-sm ${
              pain.includes(p) ? 'bg-amber-500 text-white' : 'bg-white ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm font-medium text-slate-500 dark:text-slate-400">是否有以下症状（若有，今天先休息）</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {WARNING.map((w) => (
          <button
            key={w}
            onClick={() => toggle(warning, setWarning, w)}
            className={`h-12 rounded-xl px-4 text-sm ${
              warning.includes(w) ? 'bg-red-600 text-white' : 'bg-white ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800'
            }`}
          >
            {w}
          </button>
        ))}
      </div>

      <button onClick={save} className="mt-8 h-12 w-full rounded-xl bg-blue-600 text-base font-medium text-white">
        保存并返回
      </button>
    </div>
  );
}
