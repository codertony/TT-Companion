import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTableStore } from '../../stores/tableStore';
import { useTableCheckStore } from '../../stores/tableCheckStore';
import { useCountdown } from '../../hooks/useCountdown';
import { genId } from '../../lib/id';
import { todayStr } from '../../lib/date';
import { ERROR_LABELS, FIVE_CHECK_ITEMS, GATES, evaluateCheck, gatePassed, makeCheck } from '../../domain/tableCheck';
import type { ErrorKind, SelfCheckRecord, SelfCheckResult, TableSegment } from '../../types';

type NewCheck = Omit<SelfCheckRecord, 'id' | 'date'>;

interface RunResult {
  verdict: 'pass' | 'warn' | 'fail';
  gates: { id: string; name: string; threshold: string; passed: boolean }[];
  hint: string;
  durationMin: number;
  segmentCount: number;
}

function SegmentRunner({ segment, onDone }: { segment: TableSegment; onDone: () => void }) {
  const total = segment.minutes * 60;
  const { remainSec, running, pause, resume } = useCountdown(total, onDone);
  const mm = Math.floor(remainSec / 60);
  const ss = remainSec % 60;
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <p className="text-2xl font-semibold">{segment.name}</p>
      <p className="mt-1 text-sm text-slate-400">约 {segment.minutes} 分钟</p>
      <div className="mt-6 text-5xl font-bold tabular-nums text-slate-900 dark:text-white">
        {mm}:{String(ss).padStart(2, '0')}
      </div>
      <div className="mt-6 flex items-center gap-3">
        <button onClick={running ? pause : resume} className="h-12 flex-1 rounded-xl bg-slate-200 text-sm font-medium dark:bg-slate-700 dark:text-white">
          {running ? '暂停' : '继续'}
        </button>
        <button onClick={onDone} className="h-12 rounded-xl px-5 text-sm text-slate-400 dark:text-slate-500">完成此段</button>
      </div>
    </div>
  );
}

function SelfCheckForm({ drillId, focusPoint, onSubmit }: { drillId: string; focusPoint?: string; onSubmit: (r: NewCheck) => void }) {
  const [check, setCheck] = useState<SelfCheckResult>(makeCheck());
  const [successMade, setSuccessMade] = useState('');
  const [successTotal, setSuccessTotal] = useState('');
  const [streak, setStreak] = useState('');
  const [placeMade, setPlaceMade] = useState('');
  const [placeTotal, setPlaceTotal] = useState('');
  const [rpe, setRpe] = useState('');
  const [topError, setTopError] = useState<ErrorKind | null>(null);

  const hasFiveCheck = Object.values(check).some(Boolean);
  const hasTotal = Number(successTotal) > 0;
  const canSubmit = hasFiveCheck && hasTotal;

  const submit = () => {
    if (!canSubmit) return;
    onSubmit({
      drillId,
      successMade: Number(successMade) || 0,
      successTotal: Number(successTotal) || 0,
      longestStreak: Number(streak) || 0,
      placementMade: Number(placeMade) || 0,
      placementTotal: Number(placeTotal) || 0,
      rpe: Number(rpe) || 0,
      check,
      focusPoint: focusPoint ?? '结合当天目标技术',
      topError: topError ?? 'out',
    });
  };

  const input = 'h-12 w-full min-w-0 rounded-xl border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-slate-800';

  return (
    <div className="flex-1">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">五问自检（准·净·松·顺·回）</p>
      <div className="mt-2 grid grid-cols-5 gap-2">
        {FIVE_CHECK_ITEMS.map((it) => (
          <button
            key={it.key}
            onClick={() => setCheck((c) => ({ ...c, [it.key]: !c[it.key] }))}
            className={`h-12 rounded-xl text-sm ${check[it.key] ? 'bg-emerald-500 text-white' : 'bg-white ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800'}`}
          >
            {it.label}
          </button>
        ))}
      </div>
      <p className="mt-1 text-xs text-slate-400">
        {FIVE_CHECK_ITEMS.map((it) => `${it.label}=${it.hint}`).join(' · ')}
      </p>

      <p className="mt-5 text-sm font-medium text-slate-500 dark:text-slate-400">六指标记录</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <input type="number" inputMode="numeric" placeholder="上台数" value={successMade} onChange={(e) => setSuccessMade(e.target.value)} className={input} />
        <input type="number" inputMode="numeric" placeholder="总数" value={successTotal} onChange={(e) => setSuccessTotal(e.target.value)} className={input} />
        <input type="number" inputMode="numeric" placeholder="最长连续" value={streak} onChange={(e) => setStreak(e.target.value)} className={input} />
        <input type="number" inputMode="numeric" placeholder="主观用力 RPE 1–10" value={rpe} onChange={(e) => setRpe(e.target.value)} className={input} />
        <input type="number" inputMode="numeric" placeholder="落点命中数" value={placeMade} onChange={(e) => setPlaceMade(e.target.value)} className={input} />
        <input type="number" inputMode="numeric" placeholder="落点总数" value={placeTotal} onChange={(e) => setPlaceTotal(e.target.value)} className={input} />
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500 dark:text-slate-400">今天最常见失误（只选一个）</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {(Object.keys(ERROR_LABELS) as ErrorKind[]).map((e) => (
          <button key={e} onClick={() => setTopError(e)} className={`h-11 rounded-xl px-4 text-sm ${topError === e ? 'bg-blue-600 text-white' : 'bg-white ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800'}`}>
            {ERROR_LABELS[e]}
          </button>
        ))}
      </div>
      <p className="mt-1 text-xs text-slate-400">3 球诊断：连续 3 次同类错误才判稳定问题，一次只调一个变量</p>

      <button onClick={submit} disabled={!canSubmit} className="mt-6 h-12 w-full rounded-xl bg-blue-600 text-base font-medium text-white disabled:opacity-40">
        完成并记录
      </button>
      {!canSubmit && <p className="mt-1 text-xs text-slate-400">请至少勾一项自检并填写「总数」</p>}
    </div>
  );
}

export default function TableRunPage() {
  const plan = useTableStore((s) => s.plan);
  const addSession = useTableStore((s) => s.add);
  const addCheck = useTableCheckStore((s) => s.add);
  const [idx, setIdx] = useState(0);
  const [swapped, setSwapped] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);

  const finish = (r: NewCheck) => {
    const record: SelfCheckRecord = { ...r, id: genId('chk'), date: todayStr() };
    const summary: RunResult = {
      verdict: evaluateCheck(r.check),
      gates: GATES.map((g) => ({ id: g.id, name: g.name, threshold: g.threshold, passed: gatePassed(g.id, record) })),
      hint: '',
      durationMin: plan?.durationMin ?? 0,
      segmentCount: plan?.segments.length ?? 0,
    };
    summary.hint =
      summary.verdict === 'fail'
        ? '五问明显崩掉，建议退一级，找当前最高可控难度'
        : summary.verdict === 'pass'
          ? '五问全过，可尝试进入下一级（更难条件）'
          : '部分通过，继续在当前难度巩固';
    addCheck(r);
    addSession({
      id: genId('ts'),
      date: todayStr(),
      target: plan?.target ?? '',
      ballSource: plan?.ballSource ?? 'partner',
      durationMin: summary.durationMin,
      segments: plan?.segments ?? [],
      completed: true,
      completedAt: Date.now(),
    });
    setResult(summary);
  };

  if (result) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-slate-50 px-5 py-8 pb-24 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <p className="text-3xl font-semibold">训练课已记录</p>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          {result.durationMin} 分钟 · {result.segmentCount} 段 · 已存自检记录
        </p>
        <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
          <p className="text-sm font-medium">五问自检：{result.verdict === 'pass' ? '✅ 全过' : result.verdict === 'warn' ? '⚠️ 部分通过' : '❌ 明显崩掉'}</p>
          <p className="mt-3 text-sm font-medium">四道进阶门槛</p>
          <div className="mt-1 space-y-1">
            {result.gates.map((g) => (
              <div key={g.id} className="flex items-start justify-between gap-2 text-xs">
                <span className="text-slate-600 dark:text-slate-300">{g.name}（{g.threshold}）</span>
                <span className="shrink-0">{g.passed ? '✅' : '—'}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-400">{result.hint}</p>
        </div>
        <Link to="/" className="mt-8 block h-12 w-full rounded-xl bg-blue-600 leading-[48px] text-white">回到首页</Link>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center bg-slate-50 px-5 text-center dark:bg-slate-950">
        <p className="text-slate-600 dark:text-slate-300">还没有台上训练课</p>
        <Link to="/table" className="mt-6 block h-12 w-full rounded-xl bg-blue-600 leading-[48px] text-white">去编排</Link>
      </div>
    );
  }

  if (plan.segments.length === 0) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center bg-slate-50 px-5 text-center dark:bg-slate-950">
        <p className="text-slate-600 dark:text-slate-300">{plan.reason ?? '无法生成训练课'}</p>
        <Link to="/" className="mt-6 block h-12 w-full rounded-xl bg-blue-600 leading-[48px] text-white">回到首页</Link>
      </div>
    );
  }

  const done = idx >= plan.segments.length;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-slate-50 px-5 py-8 pb-24 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">台上训练 · {plan.target}</h2>
        {confirmEnd ? (
          <span className="flex gap-3">
            <Link to="/" className="text-sm text-red-500">确认结束</Link>
            <button onClick={() => setConfirmEnd(false)} className="text-sm text-slate-400 dark:text-slate-500">取消</button>
          </span>
        ) : (
          <button onClick={() => setConfirmEnd(true)} className="min-h-12 text-sm text-slate-500 dark:text-slate-400">结束</button>
        )}
      </div>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {plan.durationMin} 分钟 · 球源 {plan.ballSource === 'partner' ? '球搭子' : plan.ballSource === 'robot' ? '发球机' : '多球'}
      </p>

      {(plan.rule || plan.partnerTask || plan.focusPoint) && (
        <div className="mt-3 rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
          {plan.focusPoint && <p className="text-sm font-medium">只注意：{plan.focusPoint}</p>}
          {plan.rule && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{plan.rule}</p>}
          {plan.partnerTask && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">搭档：{plan.partnerTask}</p>}
        </div>
      )}

      {plan.ballSource === 'partner' && (
        <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-100 px-4 py-2 text-sm dark:bg-slate-800">
          <span className="text-slate-600 dark:text-slate-300">每轮约 3–6 分钟换人，保持质量</span>
          <button onClick={() => setSwapped((s) => !s)} className="shrink-0 rounded-lg bg-white px-3 py-1 text-xs text-slate-600 ring-1 ring-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:ring-slate-600">
            {swapped ? '已换人' : '换人'}
          </button>
        </div>
      )}

      {!done && (
        <>
          <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div className="h-full bg-blue-500 transition-all" style={{ width: `${((idx + 1) / plan.segments.length) * 100}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-xs text-slate-400">
            <span>段 {idx + 1}/{plan.segments.length}</span>
            <span>下一段：{plan.segments[idx + 1]?.name ?? '自检'}</span>
          </div>
          <SegmentRunner key={idx} segment={plan.segments[idx]} onDone={() => setIdx((i) => i + 1)} />
        </>
      )}

      {done && (
        <div className="mt-6 flex flex-1 flex-col">
          <p className="text-sm text-slate-500 dark:text-slate-400">训练课段已完成，做一次自我验收：</p>
          <SelfCheckForm drillId={plan.target} focusPoint={plan.focusPoint} onSubmit={finish} />
        </div>
      )}
    </div>
  );
}
