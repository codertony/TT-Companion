import type { Cue } from '../types';

export default function CueCard({ cue }: { cue: Cue | null }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <p className="text-xs text-slate-400">本周 ONE CUE</p>
      {cue ? (
        <>
          <p className="mt-1 text-2xl font-semibold">{cue.text}</p>
          <p className="mt-2 text-sm text-slate-400">本周所有影子训练只关注这一点</p>
        </>
      ) : (
        <p className="mt-1 text-sm text-slate-500">先记录一个想改的问题</p>
      )}
    </div>
  );
}
