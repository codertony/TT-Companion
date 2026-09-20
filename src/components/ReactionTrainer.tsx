import { useEffect, useRef, useState } from 'react';
import { useReaction } from '../hooks/useReaction';
import type { ReactionMode } from '../types';

const COLOR_STYLES: Record<string, string> = {
  红: 'bg-red-500',
  绿: 'bg-green-500',
  蓝: 'bg-blue-500',
  黄: 'bg-yellow-400',
};

export default function ReactionTrainer({
  mode,
  displayMs,
  gapRange,
  durationSec,
  onFinished,
  onResult,
}: {
  mode: ReactionMode;
  displayMs: number;
  gapRange: [number, number];
  durationSec: number;
  onFinished?: () => void;
  onResult?: (r: { correct: number; skipped: number; total: number }) => void;
}) {
  const { phase, stimulus, count, start, stop } = useReaction({ mode, displayMs, gapRange, durationSec });
  const [correct, setCorrect] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const reportedRef = useRef(false);

  useEffect(() => {
    reportedRef.current = false;
    start();
    return () => stop();
  }, [start, stop]);

  useEffect(() => {
    if (phase === 'finished' && !reportedRef.current) {
      reportedRef.current = true;
      onResult?.({ correct, skipped, total: count });
    }
  }, [phase, correct, skipped, count, onResult]);

  if (phase === 'finished') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p className="text-3xl font-semibold text-slate-900 dark:text-white">本步完成</p>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          共 {count} 次 · 跟上 {correct} · 没跟上 {skipped}
        </p>
        {onFinished && (
          <button onClick={onFinished} className="mt-6 h-12 w-full rounded-xl bg-blue-600 text-white">
            下一步
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      {phase === 'showing' ? (
        mode === 'color' ? (
          <div className={`h-48 w-48 rounded-full ${COLOR_STYLES[stimulus] ?? 'bg-slate-500'}`} />
        ) : (
          <p className="text-9xl font-bold text-lime-500">{stimulus}</p>
        )
      ) : (
        <div className="flex flex-col items-center text-center">
          <p className="text-lg text-slate-600 dark:text-slate-300">刚才跟上了吗？</p>
          <div className="mt-6 flex gap-4">
            <button onClick={() => setCorrect((c) => c + 1)} className="h-12 w-32 rounded-xl bg-emerald-500 text-white">
              跟上了
            </button>
            <button onClick={() => setSkipped((s) => s + 1)} className="h-12 w-32 rounded-xl ring-1 ring-slate-300 dark:ring-slate-600">
              没跟上
            </button>
          </div>
        </div>
      )}
      <p className="mt-8 text-center text-xs text-slate-400">已闪 {count} 次 · 共 {durationSec} 秒</p>
    </div>
  );
}
