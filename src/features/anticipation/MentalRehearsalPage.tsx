import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCueStore } from '../../stores/cueStore';

const steps = ['看见什么？', '判断什么？', '第一脚怎么动？', '身体怎么稳定？', 'ONE CUE 是什么？', '击球后怎么还原？'];
const balls = ['正手长球', '反手长球', '正手下旋', '反手下旋'];

export default function MentalRehearsalPage() {
  const cue = useCueStore((s) => s.primary);
  const [running, setRunning] = useState(false);
  const [ball, setBall] = useState('');
  const [stepIdx, setStepIdx] = useState(0);
  const timerRef = useRef<number | null>(null);

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    window.speechSynthesis.speak(u);
  };

  const start = () => {
    const b = balls[Math.floor(Math.random() * balls.length)];
    setBall(b);
    setStepIdx(0);
    setRunning(true);
    speak(`准备，${b}`);
  };

  const next = () => {
    if (stepIdx + 1 < steps.length) {
      const i = stepIdx + 1;
      setStepIdx(i);
      speak(steps[i].replace('？', ''));
    } else {
      stop();
    }
  };

  const stop = () => {
    setRunning(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-slate-900 px-5 py-8 text-white">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">心理模拟</h2>
        <Link to="/" className="text-sm text-slate-400">
          返回
        </Link>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        {!running ? (
          <>
            <p className="text-slate-400">语音引导完整击球链路</p>
            <button onClick={start} className="mt-6 h-12 w-full rounded-xl bg-blue-600">
              开始 →
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-400">来球</p>
            <p className="mt-1 text-2xl font-semibold">{ball}</p>
            <p className="mt-8 text-3xl font-bold text-lime-300">{steps[stepIdx]}</p>
            <p className="mt-2 text-sm text-slate-400">在脑内完成这一步</p>
            <button onClick={next} className="mt-10 h-12 w-full rounded-xl bg-blue-600">
              {stepIdx + 1 < steps.length ? '下一步' : '结束'}
            </button>
          </>
        )}
      </div>

      {cue && <p className="pb-2 text-center text-xs text-slate-400">本周 ONE CUE：{cue.text}</p>}
    </div>
  );
}
