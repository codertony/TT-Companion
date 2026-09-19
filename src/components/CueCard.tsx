import { Link } from 'react-router-dom';
import type { Cue } from '../types';

const tagLabel: Record<string, string> = {
  arm_stiff: '手臂僵硬',
  hand_first: '手先启动',
  footwork_slow: '步法慢',
  recovery_slow: '还原慢',
  early_hit: '击球偏早',
};

export default function CueCard({ cue }: { cue: Cue | null }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
      <p className="text-xs text-slate-400">本周 ONE CUE</p>
      {cue ? (
        <>
          <p className="mt-1 text-2xl font-semibold">{cue.text}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {cue.tags.length > 0 &&
              cue.tags.map((t) => (
                <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {tagLabel[t] ?? t}
                </span>
              ))}
            {cue.doneWeeks > 0 && <span className="text-xs text-slate-400">已坚持 {cue.doneWeeks} 周</span>}
          </div>
        </>
      ) : (
        <Link to="/profile/cue" className="mt-1 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>记一个最想改的问题，本周只盯它</span>
          <span className="text-blue-500">去记录 ›</span>
        </Link>
      )}
    </div>
  );
}
