import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTrainStore } from '../../stores/trainStore';
import { useSessionStore } from '../../stores/sessionStore';
import { useCueStore } from '../../stores/cueStore';
import { useCountdown } from '../../hooks/useCountdown';
import { currentPrompt } from '../../hooks/useTimedPrompts';
import { getExercise } from '../../data/exercises';
import { genId } from '../../lib/id';
import { today } from '../../lib/cue';
import type { PlanStep } from '../../types';

function StepRunner({ step, onDone }: { step: PlanStep; onDone: () => void }) {
  const exercise = getExercise(step.exerciseId);
  const { remainSec, running, pause, resume } = useCountdown(step.durationSec, onDone);
  const elapsed = step.durationSec - remainSec;
  const prompt = currentPrompt(exercise?.timedPrompts ?? [], elapsed);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-2 text-center">
      <p className="text-2xl font-semibold text-white">{step.name}</p>
      {exercise?.description ? <p className="mt-2 text-sm text-slate-300">{exercise.description}</p> : null}
      <p className="mt-8 min-h-12 text-3xl font-bold text-lime-300">{prompt?.text ?? exercise?.cue ?? ''}</p>
      <p className="mt-10 text-6xl font-bold tabular-nums text-white">{remainSec}</p>
      <div className="mt-12 flex gap-3">
        <button
          onClick={running ? pause : resume}
          className="h-11 rounded-xl bg-slate-700 px-6 text-sm text-white active:scale-[0.98]"
        >
          {running ? '暂停' : '继续'}
        </button>
        <button
          onClick={onDone}
          className="h-11 rounded-xl bg-slate-700 px-6 text-sm text-white active:scale-[0.98]"
        >
          跳过
        </button>
      </div>
    </div>
  );
}

export default function TrainRun() {
  const nav = useNavigate();
  const plan = useTrainStore((s) => s.plan);
  const scene = useTrainStore((s) => s.scene);
  const durationMin = useTrainStore((s) => s.durationMin);
  const cue = useCueStore((s) => s.primary);
  const addSession = useSessionStore((s) => s.add);
  const [stepIdx, setStepIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const savedRef = useRef(false);

  if (!plan || plan.steps.length === 0) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center bg-slate-900 px-5 text-white">
        <p className="text-slate-300">暂无训练计划</p>
        <Link to="/train" className="mt-4 text-blue-400">
          去生成
        </Link>
      </div>
    );
  }

  const finish = () => {
    if (!savedRef.current) {
      savedRef.current = true;
      addSession({
        id: genId('s'),
        date: today(),
        scene: scene ?? 'home',
        durationMin,
        types: plan.steps.map((s) => getExercise(s.exerciseId)?.ability ?? 'technique'),
        cueId: cue?.id,
        feeling: 'normal',
        completed: true,
        completedAt: Date.now(),
      });
    }
    setDone(true);
  };

  const next = () => {
    if (stepIdx + 1 < plan.steps.length) setStepIdx(stepIdx + 1);
    else finish();
  };

  if (done) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center bg-slate-900 px-5 text-center text-white">
        <p className="text-3xl">完成</p>
        <p className="mt-2 text-slate-300">本次训练 {durationMin} 分钟</p>
        <p className="mt-4 text-sm text-slate-400">训练结束，周末再验证</p>
        <Link to="/" className="mt-8 block h-12 w-full rounded-xl bg-blue-600 text-center leading-[48px]">
          完成
        </Link>
      </div>
    );
  }

  const step = plan.steps[stepIdx];

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-slate-900 px-5 py-8">
      <div className="flex items-center justify-between text-sm text-slate-300">
        <span>
          步骤 {stepIdx + 1}/{plan.steps.length}
        </span>
        {confirmEnd ? (
          <span className="flex gap-3">
            <button onClick={() => nav('/')} className="text-red-400">
              确认结束
            </button>
            <button onClick={() => setConfirmEnd(false)} className="text-slate-400">
              取消
            </button>
          </span>
        ) : (
          <button onClick={() => setConfirmEnd(true)} className="text-slate-400">
            结束
          </button>
        )}
      </div>
      <div className="mt-3 rounded-xl bg-slate-800 px-4 py-2 text-sm text-lime-300">
        {plan.cueText ? `本周 ONE CUE：${plan.cueText}` : '专注当下'}
      </div>
      <StepRunner key={stepIdx} step={step} onDone={next} />
    </div>
  );
}
