import { useState } from 'react';
import { Link } from 'react-router-dom';
import BodyDiagram, { type BodyPart } from '../../components/BodyDiagram';
import TensionScale from '../../components/TensionScale';
import { getExercise } from '../../data/exercises';
import { useResultsStore } from '../../stores/resultsStore';

interface ChainStage {
  id: string;
  name: string;
  desc: string;
  region: BodyPart;
}

const chainGroups: { title: string; stages: ChainStage[] }[] = [
  {
    title: '① 稳定（脚下与核心）',
    stages: [
      { id: 'fh_ground_connection', name: '地面连接', desc: '脚掌抓地，力从地面起', region: 'feet' },
      { id: 'fh_hip_loading', name: '屈髋蓄力', desc: '髋向后坐，像坐下再弹起', region: 'hip' },
      { id: 'bh_stable_base', name: '稳定基底（反手）', desc: '非持拍侧腿撑住不晃', region: 'feet' },
    ],
  },
  {
    title: '② 传递（髋—躯干）',
    stages: [
      { id: 'fh_pelvis_rotation', name: '骨盆旋转', desc: '髋先转，肩膀后跟', region: 'hip' },
      { id: 'shadow_slow_fh', name: '躯干传递', desc: '腰腹把转动传给手臂', region: 'trunk' },
    ],
  },
  {
    title: '③ 加速（手臂与拍）',
    stages: [
      { id: 'fh_arm_lag', name: '手臂滞后', desc: '手臂别抢，被身体带着走', region: 'arm' },
      { id: 'fh_forearm_accel', name: '前臂加速', desc: '触球前 0.1 秒收前臂', region: 'arm' },
      { id: 'bh_elbow_platform', name: '肘部平台（反手）', desc: '肘固定高度，做支点', region: 'arm' },
      { id: 'fh_loop_backspin', name: '拉下旋', desc: '重心下沉，把球拽起来', region: 'trunk' },
    ],
  },
];

export default function PowerChainPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tension, setTension] = useState(3);
  const [saved, setSaved] = useState(false);
  const addResult = useResultsStore((s) => s.add);
  const selected = selectedId ? getExercise(selectedId) : null;
  const selectedRegion = chainGroups
    .flatMap((g) => g.stages)
    .find((s) => s.id === selectedId)?.region ?? null;

  return (
    <div className="mx-auto min-h-dvh w-full max-w-md bg-slate-50 px-5 py-8 pb-24 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">发力链</h2>
        <Link to="/" className="inline-flex h-12 items-center px-2 text-sm text-slate-400 dark:text-slate-500">
          返回
        </Link>
      </div>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">稳定 — 传递 — 加速 · 逐个环节徒手体会</p>
      <a
        href="https://zhuanlan.zhihu.com/p/1921489385779601585"
        target="_blank"
        rel="noreferrer"
        className="mt-1 block text-xs text-blue-500 underline dark:text-blue-400"
      >
        📖 参考：乒乓球发力「框架动力链」详解（知乎）
      </a>

      <div className="mt-6 space-y-5">
        {chainGroups.map((g) => (
          <div key={g.title}>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{g.title}</p>
            <div className="mt-2 flex flex-col gap-2">
              {g.stages.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className={`min-h-14 rounded-xl p-3 text-left ${
                    selectedId === s.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800'
                  }`}
                >
                  <span className="block text-sm font-medium">{s.name}</span>
                  <span className={`mt-0.5 block text-xs ${selectedId === s.id ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'}`}>
                    {s.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="mt-6 rounded-2xl bg-white p-5 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
          <div className="flex items-center gap-4">
            <BodyDiagram active={selectedRegion} />
            <div className="flex-1">
              <p className="font-medium">{selected.name}</p>
              <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">{selected.cue}</p>
              <ul className="mt-2 space-y-1">
                {selected.timedPrompts.map((p, i) => (
                  <li key={i} className="text-xs text-slate-500 dark:text-slate-400">
                    {p.atSec}s · {p.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <p className="mt-8 text-sm font-medium text-slate-500 dark:text-slate-400">张力自评（0–10）</p>
      <div className="mt-3 rounded-2xl bg-white p-5 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
        <TensionScale
          value={tension}
          onChange={(v) => {
            setTension(v);
            setSaved(false);
          }}
        />
        <button
          onClick={() => {
            addResult({ kind: 'tension', metrics: { tension } });
            setSaved(true);
          }}
          className="mt-3 h-12 w-full rounded-xl bg-blue-600 text-sm font-medium text-white"
        >
          {saved ? '已记录 ✓' : '记录本次张力'}
        </button>
        <p className="mt-2 text-center text-xs text-slate-400">
          {tension <= 3
            ? '松：准备与还原阶段应保持'
            : tension <= 7
              ? '中：建立动作'
              : '紧：只在触球前 0.1 秒短暂收紧'}
        </p>
      </div>
    </div>
  );
}
