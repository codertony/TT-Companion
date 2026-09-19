import { useState } from 'react';
import { useCueStore } from '../../stores/cueStore';
import { useFeedbackStore } from '../../stores/feedbackStore';
import { today } from '../../lib/cue';
import type { FeedbackResult } from '../../types';

const options: { id: FeedbackResult; label: string }[] = [
  { id: 'much', label: '明显改善' },
  { id: 'slight', label: '略有改善' },
  { id: 'none', label: '没有变化' },
  { id: 'worse', label: '感觉更差' },
];

export default function Feedback() {
  const primary = useCueStore((s) => s.primary);
  const submitFeedback = useCueStore((s) => s.submitFeedback);
  const addFeedback = useFeedbackStore((s) => s.add);
  const [result, setResult] = useState<FeedbackResult | null>(null);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!primary) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center bg-slate-50 px-5 text-slate-900">
        <p className="text-slate-500">先设置本周 ONE CUE，再来验证</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center bg-slate-50 px-5 text-center text-slate-900">
        <p className="text-3xl">已记录</p>
        <p className="mt-2 text-sm text-slate-500">训练结束，下周继续验证</p>
      </div>
    );
  }

  const submit = () => {
    if (!result) return;
    const f = { date: today(), cueId: primary.id, result, note: note.trim() || undefined };
    addFeedback(f);
    submitFeedback(f);
    setSubmitted(true);
  };

  return (
    <div className="mx-auto min-h-dvh w-full max-w-md bg-slate-50 px-5 py-8 pb-24 text-slate-900">
      <h2 className="text-2xl font-semibold">周末验证</h2>
      <p className="mt-1 text-sm text-slate-500">本周 ONE CUE 在真实打球中有没有改善？</p>

      <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-slate-100">
        <p className="text-xs text-slate-400">只观察这一点</p>
        <p className="mt-1 text-xl font-semibold">{primary.text}</p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => setResult(o.id)}
            className={`h-12 rounded-xl text-sm ${
              result === o.id ? 'bg-blue-600 text-white' : 'bg-white ring-1 ring-slate-100'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="备注，如：正手定点明显好，但移动后仍抢手"
        className="mt-4 w-full rounded-lg border border-slate-200 p-2 text-sm"
        rows={3}
      />
      <button onClick={submit} disabled={!result} className="mt-4 h-12 w-full rounded-xl bg-blue-600 text-white disabled:opacity-40">
        提交
      </button>
    </div>
  );
}
