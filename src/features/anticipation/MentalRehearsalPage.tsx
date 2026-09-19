import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCueStore } from '../../stores/cueStore';

const steps = [
  { q: '看见什么？', hint: '对方引拍方向、拍面角度、触球点' },
  { q: '判断什么？', hint: '旋转和落点，先定长短' },
  { q: '第一脚怎么动？', hint: '非持拍侧脚先动，一步到位' },
  { q: '身体怎么稳定？', hint: '重心压在前脚掌，膝盖微屈不晃' },
  { q: '本周提示词是什么？', hint: '心里默念本周唯一的动作提醒' },
  { q: '击球后怎么还原？', hint: '击球即回位，回到准备姿势' },
];
const balls = ['正手上旋', '正手下旋', '反手上旋', '反手下旋'];

export default function MentalRehearsalPage() {
  const cue = useCueStore((s) => s.primary);
  const [running, setRunning] = useState(false);
  const [ball, setBall] = useState('');
  const [stepIdx, setStepIdx] = useState(0);

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    window.speechSynthesis.speak(u);
  };

  const stop = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  useEffect(() => stop, []);

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
      speak(steps[i].q.replace('？', ''));
    } else {
      stop();
      setRunning(false);
    }
  };

  const end = () => {
    stop();
    setRunning(false);
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-slate-50 px-5 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">心理模拟</h2>
        <Link to="/" className="inline-flex h-12 items-center px-2 text-sm text-slate-400 dark:text-slate-500">
          返回
        </Link>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        {!running ? (
          <>
            <p className="text-sm text-slate-500 dark:text-slate-400">语音引导完整击球链路 · 6 步约 30 秒</p>
            <button onClick={start} className="mt-6 h-12 w-full rounded-xl bg-blue-600 text-white">
              开始 →
            </button>
            {!cue && (
              <p className="mt-3 text-xs text-slate-400">还没有本周提示词，去「整合」页选一个问题。</p>
            )}
          </>
        ) : (
          <>
            <p className="text-sm text-slate-400">来球</p>
            <p className="mt-1 text-2xl font-semibold">{ball}</p>
            <p className="mt-2 text-xs text-slate-400">
              步骤 {stepIdx + 1}/{steps.length}
            </p>
            <p className="mt-8 text-3xl font-bold text-blue-600 dark:text-blue-400">{steps[stepIdx].q}</p>
            <p className="mt-3 text-sm text-slate-400 dark:text-slate-500">{steps[stepIdx].hint}</p>
            <button onClick={next} className="mt-10 h-12 w-full rounded-xl bg-blue-600 text-white">
              {stepIdx + 1 < steps.length ? '下一步' : '结束'}
            </button>
            <button onClick={end} className="mt-3 text-sm text-slate-400">
              结束
            </button>
          </>
        )}
      </div>

      {cue && <p className="pb-2 text-center text-xs text-slate-400">本周提示词：{cue.text}</p>}
    </div>
  );
}
