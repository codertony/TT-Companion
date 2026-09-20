import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { accuracyByCut, earliestCueLevel, type OcclusionResult } from '../../lib/occlusion';
import { useResultsStore } from '../../stores/resultsStore';

const CUT_TIMES = [
  { ms: -300, label: '提前 300ms（最难）' },
  { ms: -200, label: '提前 200ms' },
  { ms: -100, label: '提前 100ms' },
  { ms: 0, label: '触球瞬间（最简单）' },
];

const DIMS = [
  { id: 'spin', name: '旋转', pool: ['上旋', '下旋'] },
  { id: 'length', name: '落点', pool: ['长球', '短球'] },
] as const;

export default function OcclusionPage() {
  const [cutMs, setCutMs] = useState(-200);
  const [dim, setDim] = useState<'spin' | 'length'>('spin');
  const [phase, setPhase] = useState<'idle' | 'playing' | 'blackout' | 'answered'>('idle');
  const [results, setResults] = useState<OcclusionResult[]>([]);
  const [curCorrect, setCurCorrect] = useState(false);
  const [trialNo, setTrialNo] = useState(0);
  const trueAnswerRef = useRef<string>('');
  const timerRef = useRef<number | null>(null);
  const addResult = useResultsStore((s) => s.add);

  const pool = DIMS.find((d) => d.id === dim)!.pool;
  const inTrial = phase === 'playing' || phase === 'blackout';

  const trial = () => {
    trueAnswerRef.current = pool[Math.floor(Math.random() * pool.length)];
    setTrialNo((n) => n + 1);
    setPhase('playing');
    const delay = Math.max(100, 600 - Math.abs(cutMs));
    timerRef.current = window.setTimeout(() => setPhase('blackout'), delay);
  };

  const judge = (v: string) => {
    const correct = v === trueAnswerRef.current;
    setCurCorrect(correct);
    setResults((r) => [...r, { cutMs, correct }]);
    addResult({ kind: 'occlusion', metrics: { correct: correct ? 1 : 0, cutMs, dim: dim === 'spin' ? 0 : 1 } });
    setPhase('answered');
  };

  const acc = accuracyByCut(results);
  const early = earliestCueLevel(acc);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-slate-50 px-5 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">视频遮挡预判</h2>
        <Link to="/" className="inline-flex h-12 items-center px-2 text-sm text-slate-400 dark:text-slate-500">
          返回
        </Link>
      </div>
      <a
        href="https://www.bilibili.com/video/BV1hvVa61Ey9/"
        target="_blank"
        rel="noreferrer"
        className="mt-1 block text-xs text-blue-500 underline dark:text-blue-400"
      >
        📖 参考：看不清旋转怎么办（B 站视频）
      </a>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        黑屏越早，留给你的线索越少，难度越高。
      </p>

      <div className="mt-4 flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
        {DIMS.map((d) => (
          <button
            key={d.id}
            onClick={() => setDim(d.id)}
            className={`flex-1 rounded-lg py-2 text-sm ${dim === d.id ? 'bg-white shadow-sm dark:bg-slate-700' : ''}`}
          >
            判断{d.name}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {CUT_TIMES.map((c) => (
          <button
            key={c.ms}
            disabled={inTrial}
            onClick={() => setCutMs(c.ms)}
            className={`min-h-12 rounded-xl px-4 text-left text-sm ${
              cutMs === c.ms
                ? 'bg-blue-600 text-white'
                : 'bg-white ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800'
            } ${inTrial ? 'opacity-50' : ''}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        {phase === 'idle' && (
          <button onClick={trial} className="h-12 w-full rounded-xl bg-blue-600 text-white">
            开始一题（演示版：用示意图代替视频）
          </button>
        )}
        {phase === 'playing' && (
          <p className="text-2xl text-slate-500 dark:text-slate-400">播放中：对方正在挥拍…</p>
        )}
        {phase === 'blackout' && (
          <div className="text-center">
            <p className="text-lg font-semibold">■ 黑屏于触球前 {Math.abs(cutMs)}ms</p>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{DIMS.find((d) => d.id === dim)!.name}？</p>
            <div className="mt-2 flex gap-3">
              {pool.map((s) => (
                <button key={s} onClick={() => judge(s)} className="h-12 w-32 rounded-xl bg-slate-100 text-sm dark:bg-slate-800">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {phase === 'answered' && (
          <div className="text-center">
            <p className="text-3xl">{curCorrect ? '✓ 正确' : '✗ 错误'}</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">实际：{trueAnswerRef.current}</p>
            <button onClick={trial} className="mt-6 h-12 w-full rounded-xl bg-blue-600 text-white">
              下一题
            </button>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="rounded-2xl bg-white p-4 text-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
          <p className="font-medium">早期线索水平（各时点正确率）</p>
          <p className="mt-1 text-xs text-slate-400">能看到触球前多早的画面，还能判断正确。</p>
          <div className="mt-2 space-y-1 text-slate-600 dark:text-slate-300">
            {CUT_TIMES.map((c) => (
              <div key={c.ms} className="flex justify-between">
                <span>{c.label}</span>
                <span>{acc[c.ms] != null ? `${Math.round(acc[c.ms] * 100)}%` : '—'}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {early != null
              ? `你在${CUT_TIMES.find((c) => c.ms === early)?.label}时仍能稳定判断（≥80%）`
              : `已练 ${trialNo} 题，每个时点多练几题后会生成报告`}
          </p>
        </div>
      )}
    </div>
  );
}
