import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReaction } from '../../hooks/useReaction';
import { useSettingsStore } from '../../stores/settingsStore';
import type { ReactionMode } from '../../types';

const modes: { id: ReactionMode; name: string }[] = [
  { id: 'direction', name: '方向' },
  { id: 'stroke', name: '正反手' },
  { id: 'color', name: '颜色' },
  { id: 'number', name: '数字' },
  { id: 'dual', name: '双条件' },
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
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-slate-900 px-5 py-8 text-white">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">反应训练</h2>
        <Link to="/" className="text-sm text-slate-400">
          返回
        </Link>
      </div>

      {!started && (
        <>
          <div className="mt-6 grid grid-cols-5 gap-2">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`rounded-lg p-2 text-sm ${mode === m.id ? 'bg-blue-600' : 'bg-slate-700'}`}
              >
                {m.name}
              </button>
            ))}
          </div>
          <button onClick={begin} className="mt-8 h-12 rounded-xl bg-blue-600 text-base font-medium">
            开始 →
          </button>
        </>
      )}

      {started && phase !== 'finished' && (
        <div className="flex flex-1 flex-col items-center justify-center">
          {phase === 'showing' ? (
            <p className="text-7xl font-bold text-lime-300">{stimulus}</p>
          ) : (
            <p className="text-2xl text-slate-500">准备…</p>
          )}
          <div className="mt-14 flex gap-4">
            <button onClick={() => setCorrect((c) => c + 1)} className="h-12 w-28 rounded-xl bg-slate-700 text-sm">
              正确
            </button>
            <button onClick={() => setSkipped((s) => s + 1)} className="h-12 w-28 rounded-xl bg-slate-700 text-sm">
              跳过
            </button>
          </div>
        </div>
      )}

      {started && phase === 'finished' && (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-3xl">完成</p>
          <p className="mt-2 text-slate-300">本轮 {count} 次刺激</p>
          <p className="mt-1 text-sm text-slate-400">
            自评：正确 {correct} · 跳过 {skipped}
          </p>
          <button onClick={end} className="mt-8 h-12 w-full rounded-xl bg-blue-600">
            再练一次
          </button>
        </div>
      )}
    </div>
  );
}
