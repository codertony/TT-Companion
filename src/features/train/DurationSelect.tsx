import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrainStore } from '../../stores/trainStore';
import { useCueStore } from '../../stores/cueStore';
import { generatePlan } from '../../lib/generator';
import { exercises } from '../../data/exercises';
import type { Feeling } from '../../types';

const durations = [
  { min: 1, desc: '神经激活' },
  { min: 3, desc: '日常最小量', rec: true },
  { min: 5, desc: '主训练量' },
  { min: 10, desc: '周末补量' },
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
  const setFeeling = useTrainStore((s) => s.setFeeling);
  const setPlan = useTrainStore((s) => s.setPlan);
  const cue = useCueStore((s) => s.primary);
  const [feeling, setFeelingLocal] = useState<Feeling>('normal');

  const sceneName = { metro_sit: '地铁 · 坐', metro_stand: '地铁 · 站', office: '办公室', home: '家', club: '球馆' }[scene ?? 'home'];

  const start = (min: number) => {
    if (!scene) return;
    setFeeling(feeling);
    setDuration(min);
    setPlan(generatePlan({ scene, durationMin: min, cue, feeling, exercises }));
    nav('/train/run');
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-slate-50 px-5 py-8 pb-24 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <h2 className="text-2xl font-semibold">今天状态怎么样？</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        在「{sceneName}」训练 · 状态一般会给你更短的组数和更低强度
      </p>

      <div className="mt-4 flex gap-3">
        {feelings.map((f) => (
          <button
            key={f.id}
            onClick={() => setFeelingLocal(f.id)}
            className={`flex-1 rounded-xl p-3 text-sm ${
              feeling === f.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 ring-1 ring-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="mt-8 text-sm font-medium text-slate-500 dark:text-slate-400">练多久？</p>
      <div className="mt-3 flex flex-col gap-3">
        {durations.map((d) => (
          <button
            key={d.min}
            onClick={() => start(d.min)}
            className="flex h-14 items-center justify-between rounded-2xl bg-white px-5 shadow-sm ring-1 ring-slate-100 active:scale-[0.98] dark:bg-slate-900 dark:ring-slate-800"
          >
            <span className="text-lg font-medium">{d.min} 分钟</span>
            <span className="text-sm text-slate-400 dark:text-slate-500">{d.desc}</span>
            {d.rec && <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600 dark:bg-blue-950 dark:text-blue-400">推荐</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
