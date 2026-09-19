import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrainStore } from '../../stores/trainStore';
import { useCueStore } from '../../stores/cueStore';
import { generatePlan } from '../../lib/generator';
import { exercises } from '../../data/exercises';
import type { Feeling } from '../../types';

const durations = [
  { min: 1, rec: false },
  { min: 3, rec: true },
  { min: 5, rec: true },
  { min: 10, rec: false },
];

const feelings: { id: Feeling; label: string }[] = [
  { id: 'good', label: '🙂 好' },
  { id: 'normal', label: '😐 普通' },
  { id: 'tired', label: '😫 累' },
];

export default function DurationSelect() {
  const nav = useNavigate();
  const scene = useTrainStore((s) => s.scene);
  const setDuration = useTrainStore((s) => s.setDuration);
  const setPlan = useTrainStore((s) => s.setPlan);
  const cue = useCueStore((s) => s.primary);
  const [feeling, setFeeling] = useState<Feeling>('normal');

  const start = (min: number) => {
    if (!scene) return;
    setDuration(min);
    setPlan(generatePlan({ scene, durationMin: min, cue, feeling, exercises }));
    nav('/train/run');
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-slate-50 px-5 py-8 text-slate-900">
      <h2 className="text-2xl font-semibold">练多久？</h2>

      <div className="mt-6 flex flex-col gap-3">
        {durations.map((d) => (
          <button
            key={d.min}
            onClick={() => start(d.min)}
            className="flex h-14 items-center justify-between rounded-2xl bg-white px-5 shadow-sm ring-1 ring-slate-100 active:scale-[0.98]"
          >
            <span className="text-lg font-medium">{d.min} 分钟</span>
            {d.rec ? <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">推荐</span> : null}
          </button>
        ))}
      </div>

      <p className="mt-8 text-sm font-medium text-slate-500">今日状态</p>
      <div className="mt-2 flex gap-3">
        {feelings.map((f) => (
          <button
            key={f.id}
            onClick={() => setFeeling(f.id)}
            className={`flex-1 rounded-xl p-3 text-sm ${
              feeling === f.id ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
