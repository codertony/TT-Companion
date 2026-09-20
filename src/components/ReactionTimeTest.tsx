import { useEffect, useRef, useState } from 'react';
import { useResultsStore } from '../stores/resultsStore';

const TOTAL = 8;

export default function ReactionTimeTest() {
  const addResult = useResultsStore((s) => s.add);
  const [phase, setPhase] = useState<'idle' | 'waiting' | 'showing' | 'done'>('idle');
  const [times, setTimes] = useState<number[]>([]);
  const shownAtRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  const startTrial = () => {
    setPhase('waiting');
    const delay = 600 + Math.random() * 1400;
    timerRef.current = window.setTimeout(() => {
      shownAtRef.current = performance.now();
      setPhase('showing');
    }, delay);
  };

  const begin = () => {
    setTimes([]);
    startTrial();
  };

  const hit = () => {
    const ms = Math.round(performance.now() - shownAtRef.current);
    const next = [...times, ms];
    setTimes(next);
    if (next.length >= TOTAL) {
      setPhase('done');
      const avg = Math.round(next.reduce((a, b) => a + b, 0) / next.length);
      const best = Math.min(...next);
      addResult({ kind: 'reaction_time', metrics: { averageMs: avg, bestMs: best, trials: next.length } });
    } else {
      startTrial();
    }
  };

  if (phase === 'idle') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p className="text-slate-600 dark:text-slate-300">测真实反应时（毫秒）</p>
        <p className="mt-2 text-sm text-slate-400">共 {TOTAL} 次，看到信号立刻点，测「眼睛到手指」的延迟。</p>
        <button onClick={begin} className="mt-6 h-12 w-full rounded-xl bg-blue-600 text-white">
          开始
        </button>
      </div>
    );
  }

  if (phase === 'done') {
    const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    const best = Math.min(...times);
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p className="text-3xl font-semibold text-slate-900 dark:text-white">平均 {avg}ms</p>
        <p className="mt-2 text-slate-500 dark:text-slate-400">最快 {best}ms · 共 {times.length} 次</p>
        <p className="mt-4 text-sm text-slate-400">普通人视觉反应约 200–250ms；练的是稳定快，不是拼一次爆发。</p>
        <button onClick={begin} className="mt-6 h-12 w-full rounded-xl bg-blue-600 text-white">
          再来一轮
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      {phase === 'waiting' ? (
        <p className="text-lg text-slate-500 dark:text-slate-400">等信号出现…</p>
      ) : (
        <button
          onClick={hit}
          className="flex h-64 w-64 items-center justify-center rounded-full bg-lime-500 text-2xl font-bold text-white active:scale-95"
        >
          点！
        </button>
      )}
      <p className="mt-6 text-xs text-slate-400">第 {times.length + 1}/{TOTAL} 次</p>
    </div>
  );
}
