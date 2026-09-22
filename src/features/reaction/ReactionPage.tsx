import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReaction } from '../../hooks/useReaction';
import { useSettingsStore } from '../../stores/settingsStore';
import { useResultsStore } from '../../stores/resultsStore';
import ReactionTimeTest from '../../components/ReactionTimeTest';
import type { ReactionMode } from '../../types';

interface ModeDef {
  id: ReactionMode;
  name: string;
  howTo: string;
  mapping: { s: string; a: string }[];
}

const MODES: ModeDef[] = [
  {
    id: 'direction',
    name: '方向',
    howTo: '看到方向箭头，立刻朝那个方向并步一步，再回到中位',
    mapping: [
      { s: '←', a: '向左并步' },
      { s: '→', a: '向右并步' },
      { s: '↑', a: '向前一步' },
      { s: '↓', a: '向后一步' },
    ],
  },
  {
    id: 'stroke',
    name: '正反手',
    howTo: '看到「正手 / 反手」，立刻做对应的徒手挥拍',
    mapping: [
      { s: '正手', a: '正手挥拍' },
      { s: '反手', a: '反手挥拍' },
    ],
  },
  {
    id: 'color',
    name: '颜色',
    howTo: '看到色块，按固定颜色做动作：红=左、绿=右、蓝=正手、黄=反手',
    mapping: [
      { s: '红', a: '向左并步' },
      { s: '绿', a: '向右并步' },
      { s: '蓝', a: '正手挥拍' },
      { s: '黄', a: '反手挥拍' },
    ],
  },
  {
    id: 'number',
    name: '数字',
    howTo: '看到数字：大数（5 及以上）向右、小数（1–4）向左',
    mapping: [
      { s: '1–4', a: '向左并步' },
      { s: '5–8', a: '向右并步' },
    ],
  },
  {
    id: 'dual',
    name: '双条件',
    howTo: '颜色定方向 + 数字定击球，两个都看对才做动作',
    mapping: [
      { s: '红 3', a: '左 + 正手' },
      { s: '蓝 4', a: '右 + 反手' },
    ],
  },
];

const COLOR_STYLES: Record<string, string> = {
  红: 'bg-red-500',
  绿: 'bg-green-500',
  蓝: 'bg-blue-500',
  黄: 'bg-yellow-400',
};

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
  const addResult = useResultsStore((s) => s.add);
  const reportedRef = useRef(false);
  const [tab, setTab] = useState<'follow' | 'time'>('follow');

  const currentMode = MODES.find((m) => m.id === mode)!;

  const toggle = (
    <div className="mt-4 flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
      <button
        onClick={() => setTab('follow')}
        className={`flex-1 rounded-lg py-2 text-sm ${tab === 'follow' ? 'bg-white shadow-sm dark:bg-slate-700' : ''}`}
      >
        跟随反应
      </button>
      <button
        onClick={() => setTab('time')}
        className={`flex-1 rounded-lg py-2 text-sm ${tab === 'time' ? 'bg-white shadow-sm dark:bg-slate-700' : ''}`}
      >
        测反应时
      </button>
    </div>
  );

  useEffect(() => {
    if (phase === 'finished' && started && !reportedRef.current) {
      reportedRef.current = true;
      addResult({ kind: 'reaction', mode, metrics: { correct, skipped, total: count } });
    }
  }, [phase, started, correct, skipped, count, mode, addResult]);

  const begin = () => {
    setCorrect(0);
    setSkipped(0);
    setStarted(true);
    reportedRef.current = false;
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

      {toggle}

      {tab === 'time' ? (
        <ReactionTimeTest />
      ) : (
        <>
      {!started && (
        <>
          <div className="mt-4 rounded-2xl bg-blue-50 p-4 dark:bg-blue-950">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">怎么练</p>
            <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
              屏幕会快速闪出一个字/符号 → 你立刻做出对应的徒手动作 → 结束后如实点「跟上了 / 没跟上」。练的是「眼睛看到 → 脚和手立刻动」，不是拼速度按屏幕。
            </p>
          </div>

          <p className="mt-6 text-sm font-medium text-slate-500 dark:text-slate-400">选一种练法</p>
          <div className="mt-2 flex flex-col gap-2">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`rounded-2xl p-3 text-left ${
                  mode === m.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800'
                }`}
              >
                <span className="block text-sm font-medium">{m.name}</span>
                <span className={`mt-0.5 block text-xs ${mode === m.id ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'}`}>
                  {m.howTo}
                </span>
              </button>
            ))}
          </div>

          <p className="mt-6 text-sm font-medium text-slate-500 dark:text-slate-400">对应关系（看到 → 做什么）</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {currentMode.mapping.map((mp) => (
              <div key={mp.s} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
                <span className="text-sm font-semibold">{mp.s}</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">→ {mp.a}</span>
              </div>
            ))}
          </div>

          <button onClick={begin} className="mt-6 h-12 w-full rounded-xl bg-blue-600 text-base font-medium text-white">
            开始（共 {reaction.durationSec} 秒）
          </button>
        </>
      )}

      {started && phase !== 'finished' && (
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
                <button onClick={() => setSkipped((s) => s + 1)} className="h-12 w-32 rounded-xl bg-slate-100 text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
                  没跟上
                </button>
              </div>
            </div>
          )}
          <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">{currentMode.howTo}</p>
          <p className="mt-1 text-center text-xs text-slate-400">
            已闪 {count} 次 · 本轮共 {reaction.durationSec} 秒
          </p>
        </div>
      )}

      {started && phase === 'finished' && (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-3xl font-semibold">本轮结束</p>
          <p className="mt-2 text-slate-500 dark:text-slate-400">共 {count} 次刺激</p>
          <p className="mt-1 text-sm text-slate-400">自评：跟上了 {correct} · 没跟上 {skipped}</p>
          <button onClick={begin} className="mt-8 h-12 w-full rounded-xl bg-blue-600 text-white">
            再来一轮
          </button>
          <button onClick={end} className="mt-3 text-sm text-slate-400">
            换个模式
          </button>
        </div>
      )}
        </>
      )}
    </div>
  );
}
