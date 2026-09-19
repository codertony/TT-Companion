import { useState } from 'react';
import { Link } from 'react-router-dom';

type Spin = '上旋' | '下旋';
type Stroke = '正手' | '反手';
type Length = '长' | '短';

interface Ball {
  spin: Spin;
  stroke: Stroke;
  length: Length;
}

const spins: Spin[] = ['上旋', '下旋'];
const strokes: Stroke[] = ['正手', '反手'];
const lengths: Length[] = ['长', '短'];

function randomBall(): Ball {
  return {
    spin: spins[Math.floor(Math.random() * 2)],
    stroke: strokes[Math.floor(Math.random() * 2)],
    length: lengths[Math.floor(Math.random() * 2)],
  };
}

export default function AnticipationPage() {
  const [ball, setBall] = useState<Ball | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ total: 0, correct: 0 });

  const next = () => {
    setBall(randomBall());
    setRevealed(false);
  };

  const judge = (field: keyof Ball, value: string) => {
    if (!ball || revealed) return;
    setScore((s) => ({ total: s.total + 1, correct: s.correct + (ball[field] === value ? 1 : 0) }));
    setRevealed(true);
  };

  const fields: { key: keyof Ball; label: string; values: string[] }[] = [
    { key: 'spin', label: '旋转', values: spins },
    { key: 'stroke', label: '正反手', values: strokes },
    { key: 'length', label: '长短', values: lengths },
  ];

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-slate-900 px-5 py-8 text-white">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">预判 · 球分类</h2>
        <Link to="/" className="text-sm text-slate-400">
          返回
        </Link>
      </div>

      <div className="flex flex-1 flex-col justify-center">
        {!ball ? (
          <div className="flex flex-col items-center">
            <p className="text-slate-400">根据触球前动作判断来球属性</p>
            <button onClick={next} className="mt-6 h-12 w-full rounded-xl bg-blue-600">
              开始 →
            </button>
            <Link to="/occlusion" className="mt-3 text-sm text-blue-400">
              去视频遮挡训练
            </Link>
          </div>
        ) : (
          <div>
            <p className="text-center text-xl font-semibold">来球（触球前）</p>
            <div className="mt-6 space-y-4">
              {fields.map((f) => (
                <div key={f.key}>
                  <p className="text-sm text-slate-400">{f.label}</p>
                  <div className="mt-2 flex gap-2">
                    {f.values.map((v) => (
                      <button
                        key={v}
                        onClick={() => judge(f.key, v)}
                        className={`flex-1 rounded-lg p-2 text-sm ${
                          revealed ? (ball[f.key] === v ? 'bg-lime-500' : 'bg-slate-700') : 'bg-slate-700'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {revealed && (
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-300">
                  正确答案：{ball.spin} · {ball.stroke} · {ball.length}
                </p>
                <button onClick={next} className="mt-4 h-12 w-full rounded-xl bg-blue-600">
                  下一球
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="pb-2 text-center text-sm text-slate-400">
        正确 {score.correct}/{score.total}
      </p>
    </div>
  );
}
