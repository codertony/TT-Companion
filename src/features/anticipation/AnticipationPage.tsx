import { useState } from 'react';
import { Link } from 'react-router-dom';

type Dim = 'spin' | 'stroke' | 'length';

interface CueCard {
  clue: string;
  spin: '上旋' | '下旋';
  stroke: '正手' | '反手';
  length: '长' | '短';
}

const cues: CueCard[] = [
  { clue: '对方引拍低、拍面后仰，从球的下部往上摩擦', spin: '下旋', stroke: '正手', length: '长' },
  { clue: '对方引拍高、拍面前倾，快速撞击球的中上部', spin: '上旋', stroke: '正手', length: '长' },
  { clue: '对方站位靠台、动作短促，落点贴网', spin: '上旋', stroke: '反手', length: '短' },
  { clue: '对方手腕下沉、拍头朝下，动作幅度小', spin: '下旋', stroke: '反手', length: '短' },
];

const dims: { key: Dim; label: string; values: string[] }[] = [
  { key: 'spin', label: '旋转', values: ['上旋', '下旋'] },
  { key: 'stroke', label: '正反手', values: ['正手', '反手'] },
  { key: 'length', label: '长短', values: ['长', '短'] },
];

function randomCue(): CueCard {
  return cues[Math.floor(Math.random() * cues.length)];
}

export default function AnticipationPage() {
  const [cue, setCue] = useState<CueCard | null>(null);
  const [dimIdx, setDimIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState({ total: 0, correct: 0 });

  const next = () => {
    setCue(randomCue());
    setDimIdx((i) => (i + 1) % dims.length);
    setRevealed(false);
    setPicked(null);
  };

  const judge = (v: string) => {
    if (!cue || revealed) return;
    setPicked(v);
    setScore((s) => ({ total: s.total + 1, correct: s.correct + (cue[dims[dimIdx].key] === v ? 1 : 0) }));
    setRevealed(true);
  };

  const dim = dims[dimIdx];

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-slate-50 px-5 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">预判 · 球分类</h2>
        <Link to="/" className="inline-flex h-12 items-center px-2 text-sm text-slate-400 dark:text-slate-500">
          返回
        </Link>
      </div>

      <a
        href="https://www.bilibili.com/video/BV1rgAdesEa8/"
        target="_blank"
        rel="noreferrer"
        className="mt-1 block text-xs text-blue-500 underline dark:text-blue-400"
      >
        📖 参考：接发球如何快速判断旋转（B 站视频）
      </a>

      <div className="flex flex-1 flex-col justify-center">
        {!cue ? (
          <div className="flex flex-col items-center text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              先看对方的触球前动作线索，再判断来球属性（入门）。
            </p>
            <button onClick={next} className="mt-6 h-12 w-full rounded-xl bg-blue-600 text-white">
              开始 →
            </button>
            <Link to="/occlusion" className="mt-3 text-sm text-blue-500 dark:text-blue-400">
              进阶：视频遮挡预判 — 黑屏后仅凭早期画面判断 →
            </Link>
          </div>
        ) : (
          <div>
            <p className="text-xs font-medium text-slate-400">线索（触球前动作）</p>
            <p className="mt-2 rounded-xl bg-slate-100 p-4 text-lg font-medium dark:bg-slate-800">{cue.clue}</p>

            <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">本次判断：{dim.label}</p>
            <div className="mt-2 flex gap-3">
              {dim.values.map((v) => {
                const isAnswer = cue[dim.key] === v;
                const isPicked = picked === v;
                return (
                  <button
                    key={v}
                    onClick={() => judge(v)}
                    className={`h-12 flex-1 rounded-xl text-sm ${
                      revealed
                        ? isAnswer
                          ? 'bg-lime-500 text-slate-900'
                          : isPicked
                            ? 'ring-1 ring-rose-400'
                            : 'bg-slate-100 dark:bg-slate-800'
                        : 'bg-slate-100 dark:bg-slate-800'
                    }`}
                  >
                    {v}
                    {revealed && isAnswer && ' ✓'}
                    {revealed && isPicked && !isAnswer && ' ✗'}
                  </button>
                );
              })}
            </div>

            {revealed && (
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {cue[dim.key] === picked ? '判断正确' : '判断错误'} · 实际：{cue.spin} · {cue.stroke} · {cue.length}
                </p>
                <button onClick={next} className="mt-4 h-12 w-full rounded-xl bg-blue-600 text-white">
                  下一球
                </button>
                <button onClick={() => setCue(null)} className="mt-3 text-sm text-slate-400">
                  结束本轮
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {cue && <p className="pb-2 text-center text-sm text-slate-400">正确 {score.correct}/{score.total}</p>}
    </div>
  );
}
