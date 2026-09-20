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
import { PROMPT_META } from '../../lib/prompt';
import ProgressRing from '../../components/ProgressRing';
import ReactionTrainer from '../../components/ReactionTrainer';
import { useSettingsStore } from '../../stores/settingsStore';
import type { PlanStep } from '../../types';

function StepRunner({ step, onDone }: { step: PlanStep; onDone: () => void }) {
  if (step.mode) {
    return <ReactionStep step={step} onDone={onDone} />;
  }
  return <TimedStep step={step} onDone={onDone} />;
}

function ReactionStep({ step, onDone }: { step: PlanStep; onDone: () => void }) {
  const exercise = getExercise(step.exerciseId);
  const reaction = useSettingsStore((s) => s.reaction);
  return (
    <div className="flex flex-1 flex-col">
      <p className="text-center text-2xl font-semibold text-slate-900 dark:text-white">{step.name}</p>
      {exercise?.description ? (
        <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">{exercise.description}</p>
      ) : null}
      <ReactionTrainer
        mode={step.mode!}
        displayMs={reaction.displayMs}
        gapRange={reaction.gapRange}
        durationSec={step.durationSec}
        onFinished={onDone}
      />
    </div>
  );
}

function TimedStep({ step, onDone }: { step: PlanStep; onDone: () => void }) {
  const exercise = getExercise(step.exerciseId);
  const { remainSec, running, pause, resume } = useCountdown(step.durationSec, onDone);
  const elapsed = step.durationSec - remainSec;
  const prompt = currentPrompt(exercise?.timedPrompts ?? [], elapsed);
  const meta = prompt ? PROMPT_META[prompt.type] : null;
  const warn = remainSec <= 5;

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-2 text-center">
      <p className="text-2xl font-semibold text-slate-900 dark:text-white">{step.name}</p>
      {exercise?.description ? (
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{exercise.description}</p>
      ) : null}

      <div className="mt-6 flex min-h-24 w-full flex-col justify-center">
        {prompt && (
          <div className="rounded-xl bg-slate-100 p-4 dark:bg-slate-800">
            {meta && (
              <span className={`rounded px-2 py-0.5 text-xs font-medium ${meta.className}`}>{meta.label}</span>
            )}
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{prompt.text}</p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <ProgressRing
          value={remainSec}
          max={step.durationSec}
          size={92}
          thickness={6}
          strokeColor={warn ? '#f59e0b' : '#84cc16'}
          trackColor="rgba(148,163,184,0.3)"
          label={`${remainSec}`}
          ariaLabel={`剩余 ${remainSec} 秒`}
        />
      </div>

      {(exercise?.safety || (exercise?.commonMistakes?.length ?? 0) > 0) && (
        <div className="mt-5 w-full text-left">
          {exercise?.safety && (
            <p className="rounded-lg bg-amber-500/15 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
              注意：{exercise.safety}
            </p>
          )}
          {exercise?.commonMistakes?.length ? (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              常见错误：{exercise.commonMistakes.join(' · ')}
            </p>
          ) : null}
        </div>
      )}

      {exercise?.refs?.length ? (
        <div className="mt-3 w-full text-left">
          {exercise.refs.map((r) => (
            <a
              key={r.url}
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="block truncate text-xs text-blue-500 underline dark:text-blue-400"
            >
              📖 {r.title}
            </a>
          ))}
        </div>
      ) : null}

      <div className="mt-6 flex w-full items-center gap-3">
        <button
          onClick={running ? pause : resume}
          className="h-12 flex-1 rounded-xl bg-slate-200 text-sm font-medium dark:bg-slate-700 dark:text-white"
        >
          {running ? '暂停' : '继续'}
        </button>
        <button onClick={onDone} className="h-12 rounded-xl px-5 text-sm text-slate-400 dark:text-slate-500">
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
  const feeling = useTrainStore((s) => s.feeling);
  const cue = useCueStore((s) => s.primary);
  const addSession = useSessionStore((s) => s.add);
  const [stepIdx, setStepIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const savedRef = useRef(false);

  if (!plan || plan.steps.length === 0) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center bg-slate-50 px-5 text-center dark:bg-slate-950">
        <p className="text-slate-600 dark:text-slate-300">{plan?.reason ?? '还没有训练计划'}</p>
        <p className="mt-1 text-sm text-slate-400">先选一个训练地点和时长，30 秒生成一组</p>
        <Link to="/train" className="mt-6 h-12 w-full rounded-xl bg-blue-600 leading-[48px] text-white">
          去生成计划
        </Link>
        <Link to="/" className="mt-3 text-sm text-slate-400">
          回到首页
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
        feeling,
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
      <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center bg-slate-50 px-5 text-center dark:bg-slate-950">
        <p className="text-3xl font-semibold text-slate-900 dark:text-white">这组练完了</p>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          今天练了 {durationMin} 分钟 · {plan.steps.length} 个动作
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {plan.steps.map((s, i) => (
            <span key={i} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {s.name}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-400">训练结束，周末回球台再验证</p>
        <Link to="/" className="mt-8 block h-12 w-full rounded-xl bg-blue-600 leading-[48px] text-white">
          回到首页
        </Link>
      </div>
    );
  }

  const step = plan.steps[stepIdx];

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-slate-50 px-5 py-8 dark:bg-slate-950">
      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <span>
          步骤 {stepIdx + 1}/{plan.steps.length}
        </span>
        {confirmEnd ? (
          <span className="flex gap-3">
            <button onClick={() => nav('/')} className="text-red-500">
              确认结束
            </button>
            <button onClick={() => setConfirmEnd(false)} className="text-slate-400">
              取消
            </button>
          </span>
        ) : (
          <button onClick={() => setConfirmEnd(true)} className="min-h-12 text-slate-500 dark:text-slate-400">
            结束
          </button>
        )}
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className="h-full bg-blue-500 transition-all" style={{ width: `${((stepIdx + 1) / plan.steps.length) * 100}%` }} />
      </div>
      <div className="mt-3 rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        {plan.cueText ? `本周 CUE：${plan.cueText}` : '专注当下'}
      </div>
      <StepRunner key={stepIdx} step={step} onDone={next} />
    </div>
  );
}
