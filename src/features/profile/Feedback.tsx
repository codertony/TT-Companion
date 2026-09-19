import { useState } from 'react';
import { useCueStore } from '../../stores/cueStore';
import { useFeedbackStore } from '../../stores/feedbackStore';
import { today } from '../../lib/cue';
import type { FeedbackResult } from '../../types';

const options: { id: FeedbackResult; label: string; color: string }[] = [
  { id: 'much', label: '明显改善', color: 'bg-emerald-600' },
  { id: 'slight', label: '略有改善', color: 'bg-emerald-400' },
  { id: 'none', label: '没有变化', color: 'bg-slate-400' },
  { id: 'worse', label: '感觉更差', color: 'bg-orange-400' },
];

export default function Feedback() {
  const primary = useCueStore((s) => s.primary);
  const submitFeedback = useCueStore((s) => s.submitFeedback);
  const addFeedback = useFeedbackStore((s) => s.add);
  const [result, setResult] = useState<FeedbackResult | null>(null);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState<FeedbackResult | 'skipped' | null>(null);

  if (!primary) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center bg-slate-50 px-5 text-center dark:bg-slate-950">
        <p className="text-slate-600 dark:text-slate-300">还没有本周 ONE CUE</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">先定一个这周最想改的问题，验证才有对象。</p>
        <a href="#/profile/cue" className="mt-6 block h-12 w-full rounded-xl bg-blue-600 leading-[48px] text-white">
          去设置 ONE CUE
        </a>
      </div>
    );
  }

  if (submitted) {
    const label = submitted === 'skipped' ? '这周没上球台' : options.find((o) => o.id === submitted)?.label;
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center bg-slate-50 px-5 text-center dark:bg-slate-950">
        <p className="text-3xl font-semibold text-slate-900 dark:text-white">已记录</p>
        <p className="mt-2 text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-4 text-sm text-slate-400">{submitted === 'skipped' ? '下周末回球台再验证' : '下周末回球台时，再验证同一点'}</p>
        <a href="#/" className="mt-8 block h-12 w-full rounded-xl bg-blue-600 leading-[48px] text-white">
          回到首页
        </a>
      </div>
    );
  }

  const submit = () => {
    if (!result) return;
    const f = { date: today(), cueId: primary.id, result, note: note.trim() || undefined };
    addFeedback(f);
    submitFeedback(f);
    setSubmitted(result);
  };

  const skip = () => setSubmitted('skipped');

  return (
    <div className="mx-auto min-h-dvh w-full max-w-md bg-slate-50 px-5 py-8 pb-24 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <h2 className="text-2xl font-semibold">周末验证</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">本周 ONE CUE 在真实打球中有没有改善？</p>

      <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
        <p className="text-xs text-slate-400">只观察这一点</p>
        <p className="mt-1 text-xl font-semibold">{primary.text}</p>
        {primary.tags.length > 0 && (
          <p className="mt-1 text-xs text-slate-400">{primary.tags.join(' · ')}</p>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => setResult(o.id)}
            className={`flex h-12 items-center gap-3 rounded-xl pl-4 text-sm ${
              result === o.id ? 'bg-blue-600 text-white' : 'bg-white ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800'
            }`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${o.color}`} />
            {o.label}
          </button>
        ))}
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="备注，如：正手定点明显好，但移动后仍抢手"
        className="mt-4 w-full rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-700 dark:bg-slate-800"
        rows={3}
      />
      <button onClick={submit} disabled={!result} className="mt-4 h-12 w-full rounded-xl bg-blue-600 text-white disabled:opacity-40">
        提交
      </button>
      {!result && <p className="mt-1 text-xs text-slate-400">请先选择一个结果</p>}

      <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
        <button onClick={skip} className="h-12 w-full rounded-xl text-sm text-slate-400">
          这周还没上球台
        </button>
      </div>
    </div>
  );
}
