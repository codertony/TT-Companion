import { useState } from 'react';
import { Link } from 'react-router-dom';
import { errorDrills } from '../../data/errorDrills';
import { useCueStore } from '../../stores/cueStore';

const balls = ['正手上旋', '正手下旋', '反手上旋', '反手下旋'];
const chain = [
  { name: '判断来球', hint: '看引拍与拍面，先定长短' },
  { name: '移动到位', hint: '非持拍侧脚先动，一步到位' },
  { name: '稳定', hint: '脚下不晃，重心压住' },
  { name: '组织发力', hint: '髋先转，手臂被带着走' },
  { name: '模拟击球', hint: '触球前 0.1 秒收前臂' },
  { name: '还原', hint: '击球即回位' },
];

export default function IntegrationPage() {
  const add = useCueStore((s) => s.add);
  const activate = useCueStore((s) => s.activate);
  const primary = useCueStore((s) => s.primary);
  const backlog = useCueStore((s) => s.backlog);
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
    else nextBall();
  };

  const applyDrill = (id: string) => {
    const drill = errorDrills.find((d) => d.id === id);
    if (!drill) return;
    const existing = [...backlog, primary].find((c) => c && c.text === drill.primaryCue);
    if (existing) {
      activate(existing.id);
    } else {
      const cueId = add({
        text: drill.primaryCue,
        skill: 'forehand_drive',
        tags: drill.tags,
        type: 'technique',
        priority: 0,
      });
      activate(cueId);
    }
  };

  const isActive = (drillId: string) => primary?.text === errorDrills.find((d) => d.id === drillId)?.primaryCue;

  return (
    <div className="mx-auto min-h-dvh w-full max-w-md bg-slate-50 px-5 py-8 pb-24 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">整合训练</h2>
        <Link to="/" className="inline-flex h-12 items-center px-2 text-sm text-slate-400 dark:text-slate-500">
          返回
        </Link>
      </div>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">把判断、移动、发力、还原串成一条完整链路</p>

      <p className="mt-8 text-sm font-medium text-slate-500 dark:text-slate-400">完整链路模拟（6 步）</p>
      <div className="mt-3 rounded-2xl bg-white p-5 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
        {!running ? (
          <button onClick={nextBall} className="h-12 w-full rounded-xl bg-blue-600 text-white">
            开始 →
          </button>
        ) : (
          <div className="text-center">
            <p className="text-sm text-slate-400">来球</p>
            <p className="mt-1 text-2xl font-bold text-lime-500">{ball}</p>
            <p className="mt-1 text-xs text-slate-400">
              步骤 {step + 1}/{chain.length}
            </p>
            <p className="mt-4 text-xl font-semibold">{chain[step].name}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{chain[step].hint}</p>
            <button onClick={advance} className="mt-6 h-12 w-full rounded-xl bg-blue-600 text-white">
              {step + 1 < chain.length ? '下一步' : '完成，出下一球'}
            </button>
          </div>
        )}
      </div>

      <p className="mt-8 text-sm font-medium text-slate-500 dark:text-slate-400">我的问题 → 推荐专题</p>
      <div className="mt-2 flex flex-col gap-2">
        {errorDrills.map((d) => (
          <div key={d.id} className="rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
            <div className="flex items-center justify-between">
              <p className="font-medium">{d.problem}</p>
              {isActive(d.id) ? (
                <span className="rounded-lg bg-lime-500/20 px-2 py-1 text-xs text-lime-600 dark:text-lime-400">✓ 本周 Cue</span>
              ) : (
                <button onClick={() => applyDrill(d.id)} className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs text-white">
                  设为本周 Cue
                </button>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              {d.drills.join(' + ')} · Cue「{d.primaryCue}」
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
