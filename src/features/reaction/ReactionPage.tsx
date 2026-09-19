import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReaction } from '../../hooks/useReaction';
import { useSettingsStore } from '../../stores/settingsStore';
import type { ReactionMode } from '../../types';

const modes: { id: ReactionMode; name: string; desc: string }[] = [
  { id: 'direction', name: '方向', desc: '看到箭头，立刻朝该方向并步再回位' },
  { id: 'stroke', name: '正反手', desc: '看到「正手/反手」，做对应的徒手挥拍' },
  { id: 'color', name: '颜色', desc: '只对约定的颜色做动作，其余保持不动' },
  { id: 'number', name: '数字', desc: '数字 ≥ 5 向右、< 5 向左（先约定好）' },
  { id: 'dual', name: '双条件', desc: '颜色 + 数字两个条件同时满足才动' },
];

export default function ReactionPage() {
  const reaction = useSettingsStore((s) => s.reaction);
  const [mode, setMode] = useState<ReactionMode>('direction');
  const [started, setStarted] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const { phase, stimulus, count, start, stop } = useReaction({
    mode,
    displayMs: reaction.displayMs,
    gapRange: reaction.gapRange,
    durationSec: reaction.durationSec,
  });

  const currentMode = modes.find((m) => m.id === mode)!;

  const begin = () => {
    setCorrect(0);
    setSkipped(0);
    setStarted(true);
    start();
  };

  const end = () => {
    stop();
    setStarted(false);
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-slate-50 px-5 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">反应训练</h2>
        <Link to="/" className="inline-flex h-12 items-center px-2 text-sm text-slate-400 dark:text-slate-500">
          返回
        </Link>
      </div>

      {!started && (
        <>
          <p className="mt-6 text-sm font-medium text-slate-500 dark:text-slate-400">选一种模式</p>
          <div className="mt-2 flex flex-col gap-2">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`min-h-14 rounded-2xl p-3 text-left ${
                  mode === m.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800'
                }`}
              >
                <span className="block text-sm font-medium">{m.name}</span>
                <span className={`mt-0.5 block text-xs ${mode === m.id ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'}`}>
                  {m.desc}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            本模式：{currentMode.desc}。刺激 {reaction.displayMs}ms · 共 {reaction.durationSec} 秒。
          </p>
          <button onClick={begin} className="mt-4 h-12 w-full rounded-xl bg-blue-600 text-base font-medium text-white">
            开始 →
          </button>
        </>
      )}

      {started && phase !== 'finished' && (
        <div className="flex flex-1 flex-col items-center justify-center">
          {phase === 'showing' ? (
            <p className="text-8xl font-bold text-lime-400">{stimulus}</p>
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-lg text-slate-500 dark:text-slate-400">刚才是什么？</p>
              <div className="mt-6 flex gap-4">
                <button onClick={() => setCorrect((c) => c + 1)} className="h-12 w-32 rounded-xl ring-1 ring-slate-300 dark:ring-slate-600">
                  正确
                </button>
                <button onClick={() => setSkipped((s) => s + 1)} className="h-12 w-32 rounded-xl ring-1 ring-slate-300 dark:ring-slate-600">
                  没跟上
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {started && phase === 'finished' && (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-3xl font-semibold">本轮结束</p>
          <p className="mt-2 text-slate-500 dark:text-slate-400">共 {count} 次刺激</p>
          <p className="mt-1 text-sm text-slate-400">自评：正确 {correct} · 没跟上 {skipped}</p>
          <button onClick={begin} className="mt-8 h-12 w-full rounded-xl bg-blue-600 text-white">
            再来一轮
          </button>
          <button onClick={end} className="mt-3 text-sm text-slate-400">
            换个模式
          </button>
        </div>
      )}
    </div>
  );
}
