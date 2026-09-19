import { useState } from 'react';
import { Link } from 'react-router-dom';
import { errorDrills } from '../../data/errorDrills';
import { useCueStore } from '../../stores/cueStore';

const balls = ['FH Topspin', 'FH Backspin', 'BH Topspin', 'BH Backspin'];
const chain = ['判断来球', '移动到位', '稳定', '组织发力', '模拟击球', '还原'];

export default function IntegrationPage() {
  const add = useCueStore((s) => s.add);
  const activate = useCueStore((s) => s.activate);
  const [ball, setBall] = useState('');
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);

  const nextBall = () => {
    setBall(balls[Math.floor(Math.random() * balls.length)]);
    setStep(0);
    setRunning(true);
  };

  const advance = () => {
    if (step + 1 < chain.length) setStep(step + 1);
    else setRunning(false);
  };

  const applyDrill = (id: string) => {
    const drill = errorDrills.find((d) => d.id === id);
    if (!drill) return;
    const cueId = add({
      text: drill.primaryCue,
      skill: 'forehand_drive',
      tags: drill.tags,
      type: 'technique',
      priority: 0,
    });
    activate(cueId);
  };

  return (
    <div className="mx-auto min-h-dvh w-full max-w-md bg-slate-50 px-5 py-8 pb-24 text-slate-900">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">整合</h2>
        <Link to="/" className="text-sm text-slate-400">
          返回
        </Link>
      </div>

      <p className="mt-6 text-sm font-medium text-slate-500">我的问题 → 推荐专题</p>
      <div className="mt-2 flex flex-col gap-2">
        {errorDrills.map((d) => (
          <div key={d.id} className="rounded-2xl bg-white p-4 ring-1 ring-slate-100">
            <div className="flex items-center justify-between">
              <p className="font-medium">{d.problem}</p>
              <button onClick={() => applyDrill(d.id)} className="rounded-lg bg-blue-600 px-2 py-1 text-xs text-white">
                设为本周 Cue
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {d.drills.join(' + ')} · Cue「{d.primaryCue}」
            </p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm font-medium text-slate-500">整合训练（Full Shadow Rally）</p>
      <div className="mt-3 rounded-2xl bg-slate-900 p-5 text-white">
        {!running ? (
          <button onClick={nextBall} className="h-12 w-full rounded-xl bg-blue-600">
            开始 →
          </button>
        ) : (
          <div className="text-center">
            <p className="text-sm text-slate-400">来球</p>
            <p className="mt-1 text-2xl font-bold text-lime-300">{ball}</p>
            <p className="mt-4 text-xl font-semibold">{chain[step]}</p>
            <button onClick={advance} className="mt-6 h-12 w-full rounded-xl bg-blue-600">
              {step + 1 < chain.length ? '下一步' : '下一球'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
