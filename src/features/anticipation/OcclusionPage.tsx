import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { accuracyByCut, earliestCueLevel, type OcclusionResult } from '../../lib/occlusion';

const CUT_TIMES = [-300, -200, -100, 0];
const spins = ['上旋', '下旋'];

export default function OcclusionPage() {
  const [cutMs, setCutMs] = useState(-200);
  const [phase, setPhase] = useState<'idle' | 'playing' | 'blackout' | 'answered'>('idle');
  const [results, setResults] = useState<OcclusionResult[]>([]);
  const [curCorrect, setCurCorrect] = useState(false);
  const trueAnswerRef = useRef<string>('');
  const timerRef = useRef<number | null>(null);

  const trial = () => {
    trueAnswerRef.current = spins[Math.floor(Math.random() * 2)];
    setPhase('playing');
    // 模拟从 T-600ms 播放到触球，在 |cutMs| 处黑屏
    const delay = Math.max(100, 600 - Math.abs(cutMs));
    timerRef.current = window.setTimeout(() => setPhase('blackout'), delay);
  };

  const judge = (v: string) => {
    const correct = v === trueAnswerRef.current;
    setCurCorrect(correct);
    setResults((r) => [...r, { cutMs, correct }]);
    setPhase('answered');
  };

  const acc = accuracyByCut(results);
  const early = earliestCueLevel(acc);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-slate-900 px-5 py-8 text-white">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">视频遮挡预判</h2>
        <Link to="/" className="text-sm text-slate-400">
          返回
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {CUT_TIMES.map((c) => (
          <button
            key={c}
            onClick={() => setCutMs(c)}
            className={`rounded-lg px-3 py-1 text-xs ${cutMs === c ? 'bg-blue-600' : 'bg-slate-700'}`}
          >
            T{c}ms
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        {phase === 'idle' && (
          <button onClick={trial} className="h-12 w-full rounded-xl bg-blue-600">
            开始一题（模拟视频）
          </button>
        )}
        {phase === 'playing' && <p className="text-2xl text-slate-400">视频播放中…</p>}
        {phase === 'blackout' && (
          <div className="text-center">
            <p className="text-lg">■ 黑屏（触球前 {cutMs}ms）</p>
            <p className="mt-4 text-sm text-slate-400">旋转？</p>
            <div className="mt-2 flex gap-3">
              {spins.map((s) => (
                <button key={s} onClick={() => judge(s)} className="h-12 w-28 rounded-xl bg-slate-700 text-sm">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {phase === 'answered' && (
          <div className="text-center">
            <p className="text-3xl">{curCorrect ? '✓ 正确' : '✗ 错误'}</p>
            <p className="mt-2 text-sm text-slate-400">实际：{trueAnswerRef.current}</p>
            <button onClick={trial} className="mt-6 h-12 w-full rounded-xl bg-blue-600">
              下一题
            </button>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="rounded-2xl bg-slate-800 p-4 text-sm">
          <p className="font-medium">Early Cue Level（各时点正确率）</p>
          <div className="mt-2 space-y-1 text-slate-300">
            {CUT_TIMES.map((c) => (
              <div key={c} className="flex justify-between">
                <span>T{c}ms</span>
                <span>{acc[c] != null ? `${Math.round(acc[c] * 100)}%` : '—'}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {early != null ? `最早可稳定判断：T${early}ms` : '样本不足，继续训练'}
          </p>
        </div>
      )}
    </div>
  );
}
