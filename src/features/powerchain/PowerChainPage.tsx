import { useState } from 'react';
import { Link } from 'react-router-dom';
import BodyDiagram, { type BodyPart } from '../../components/BodyDiagram';
import TensionScale from '../../components/TensionScale';
import { exercises } from '../../data/exercises';

const regionByStage: Record<string, BodyPart> = {
  ground_connection: 'feet',
  hip_loading: 'hip',
  pelvis_rotation: 'hip',
  trunk_transfer: 'trunk',
  arm_lag: 'arm',
  forearm_accel: 'arm',
  stable_base: 'feet',
  core_loading: 'trunk',
  elbow_platform: 'arm',
  loop_backspin: 'trunk',
};

const chainExercises = exercises.filter((e) => e.chainStage);

export default function PowerChainPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tension, setTension] = useState(3);
  const selected = chainExercises.find((e) => e.id === selectedId);

  return (
    <div className="mx-auto min-h-dvh w-full max-w-md bg-slate-50 px-5 py-8 pb-24 text-slate-900">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">发力链</h2>
        <Link to="/" className="text-sm text-slate-400">
          返回
        </Link>
      </div>
      <p className="mt-1 text-sm text-slate-500">稳定 — 传递 — 加速</p>

      <p className="mt-6 text-sm font-medium text-slate-500">阶段（点选查看发力要点）</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {chainExercises.map((e) => (
          <button
            key={e.id}
            onClick={() => setSelectedId(e.id)}
            className={`rounded-xl p-3 text-left text-sm ${
              selectedId === e.id ? 'bg-blue-600 text-white' : 'bg-white ring-1 ring-slate-100'
            }`}
          >
            {e.name.replace('正手·', '正手 ').replace('反手·', '反手 ')}
          </button>
        ))}
      </div>

      {selected && (
        <div className="mt-6 rounded-2xl bg-white p-5 ring-1 ring-slate-100">
          <div className="flex items-center gap-4">
            <BodyDiagram active={selected.chainStage ? regionByStage[selected.chainStage] ?? null : null} />
            <div className="flex-1">
              <p className="font-medium">{selected.name}</p>
              <p className="mt-1 text-sm text-slate-400">{selected.cue}</p>
              <ul className="mt-2 space-y-1">
                {selected.timedPrompts.map((p, i) => (
                  <li key={i} className="text-xs text-slate-500">
                    {p.atSec}s · {p.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <p className="mt-8 text-sm font-medium text-slate-500">张力自评（0–10）</p>
      <div className="mt-3 rounded-2xl bg-white p-5 ring-1 ring-slate-100">
        <TensionScale value={tension} onChange={setTension} />
        <p className="mt-2 text-center text-xs text-slate-400">
          {tension <= 3 ? '松：准备与还原阶段' : tension <= 7 ? '中：建立动作' : '紧：短暂加速，别全程'}
        </p>
      </div>
    </div>
  );
}
