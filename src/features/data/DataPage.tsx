import { Link } from 'react-router-dom';
import { useSessionStore } from '../../stores/sessionStore';
import { useCueStore } from '../../stores/cueStore';
import { useFeedbackStore } from '../../stores/feedbackStore';
import { useResultsStore } from '../../stores/resultsStore';
import { useTableStore } from '../../stores/tableStore';
import { useTableCheckStore } from '../../stores/tableCheckStore';
import { ERROR_LABELS, FIVE_CHECK_ITEMS } from '../../domain/tableCheck';
import { isThisWeek, streakDays, toDateStr } from '../../lib/date';
import type { TrainingResult } from '../../types';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 text-center ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
      <p className="text-xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

function resultSummary(r: TrainingResult): string {
  if (r.kind === 'reaction') {
    const c = r.metrics.correct ?? 0;
    const t = r.metrics.total ?? 0;
    return `反应 · 跟上 ${c}/${t}`;
  }
  if (r.kind === 'reaction_time') {
    return `反应时 · 平均 ${r.metrics.averageMs ?? 0}ms`;
  }
  if (r.kind === 'occlusion') {
    return `预判 · ${r.metrics.correct === 1 ? '对' : '错'}（${r.metrics.cutMs}ms）`;
  }
  return `张力 · ${r.metrics.tension ?? 0}/10`;
}

export default function DataPage() {
  const sessions = useSessionStore((s) => s.sessions);
  const history = useCueStore((s) => s.history);
  const primary = useCueStore((s) => s.primary);
  const feedback = useFeedbackStore((s) => s.feedback);
  const results = useResultsStore((s) => s.results);
  const tableSessions = useTableStore((s) => s.sessions);
  const checkRecords = useTableCheckStore((s) => s.records);
  const weekDays = new Set([
    ...sessions.filter((s) => isThisWeek(s.date)).map((s) => s.date),
    ...tableSessions.filter((s) => isThisWeek(s.date)).map((s) => s.date),
  ]).size;
  const allSessionDates = [...sessions.map((s) => s.date), ...tableSessions.map((t) => t.date)];
  const streak = streakDays(allSessionDates);
  const total = sessions.length + tableSessions.length;

  const latestFeedback = primary ? feedback.find((f) => f.cueId === primary.id) : undefined;
  const resultLabel = { much: '明显改善', slight: '略有改善', none: '没有变化', worse: '感觉更差' }[
    latestFeedback?.result ?? 'none'
  ];
  const reactionResults = results.filter((r) => r.kind === 'reaction');
  const lastReaction = reactionResults[0];
  const reactionAcc = lastReaction
    ? Math.round(((lastReaction.metrics.correct ?? 0) / Math.max(1, lastReaction.metrics.total ?? 0)) * 100)
    : null;
  const lastRt = results.find((r) => r.kind === 'reaction_time');
  const moveLabel = latestFeedback?.movementResult
    ? ({ much: '明显改善', slight: '略有改善', none: '没有变化', worse: '感觉更差' } as const)[latestFeedback.movementResult]
    : null;

  const checkTrend = (() => {
    if (checkRecords.length < 2) return null;
    const latest = checkRecords[0];
    const prev = checkRecords.slice(1).find((r) => r.drillId === latest.drillId);
    if (!prev) return null;
    const rate = (r: (typeof checkRecords)[number]) =>
      r.successTotal > 0 ? Math.round((r.successMade / r.successTotal) * 100) : 0;
    return { drillId: latest.drillId, prev: rate(prev), latest: rate(latest) };
  })();

  const bars = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const ds = toDateStr(d);
    return {
      label: d.getDate(),
      count: sessions.filter((s) => s.date === ds).length + tableSessions.filter((t) => t.date === ds).length,
    };
  });
  const maxCount = Math.max(1, ...bars.map((b) => b.count));

  if (total === 0 && results.length === 0 && tableSessions.length === 0) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center bg-slate-50 px-5 text-center text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <p className="text-lg font-semibold">还没有训练数据</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">完成第一次训练后，这里会显示你的训练节奏和变化。</p>
        <Link to="/train" className="mt-6 block h-12 w-full rounded-xl bg-blue-600 leading-[48px] text-white">
          离台练习
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-dvh w-full max-w-md bg-slate-50 px-5 py-8 pb-24 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <h2 className="text-2xl font-semibold">数据</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">本周已练 {weekDays} 天 · 连续打卡 {streak} 天</p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Stat label="本周训练" value={`${weekDays}/7 天`} />
        <Stat label="连续打卡" value={`${streak} 天`} />
        <Stat label="累计训练" value={`${total} 次`} />
      </div>

      <p className="mt-8 text-sm font-medium text-slate-500 dark:text-slate-400">近 7 天训练</p>
      <div className="mt-3 flex items-end gap-2 rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
        {bars.map((b, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            {b.count > 0 && <span className="text-[10px] text-slate-500 dark:text-slate-400">{b.count}</span>}
            <div
              className={`w-full rounded-t ${i === bars.length - 1 ? 'bg-blue-600' : 'bg-blue-400'}`}
              style={{ height: `${Math.max(4, (b.count / maxCount) * 72)}px` }}
            />
            <span className="text-xs text-slate-400">{b.label}</span>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm font-medium text-slate-500 dark:text-slate-400">本周 ONE CUE 验证</p>
      <div className="mt-2 rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
        {primary ? (
          <>
            <p className="font-medium">{primary.text}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {latestFeedback ? `最近验证：${resultLabel}（${latestFeedback.date.slice(5)}）` : '本周还没验证'}
            </p>
          </>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">先设置本周 ONE CUE</p>
        )}
        <p className="mt-2 text-xs text-slate-400">累计达成 {history.filter((c) => c.status === 'done').length} 个</p>
      </div>

      {results.length > 0 && (
        <>
          <p className="mt-8 text-sm font-medium text-slate-500 dark:text-slate-400">最近专项结果</p>
          <div className="mt-2 rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
            {results.slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-center justify-between border-b border-slate-50 py-1.5 text-sm last:border-0 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-300">{resultSummary(r)}</span>
                <span className="text-xs text-slate-400">{r.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {tableSessions.length > 0 && (
        <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
          <p className="text-sm font-medium">最近台上训练</p>
          <div className="mt-2">
            {tableSessions.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center justify-between border-b border-slate-50 py-1.5 text-sm last:border-0 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-300">
                  {t.target} · {t.ballSource === 'partner' ? '球搭子' : t.ballSource === 'robot' ? '发球机' : '多球'}
                </span>
                <span className="text-xs text-slate-400">{t.date.slice(5)} · {t.durationMin}min{t.swaps ? ` · 换人 ${t.swaps} 次` : ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {checkRecords.length > 0 && (
        <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
          <p className="text-sm font-medium">最近自我验收</p>
          {checkTrend && (
            <p className="mt-1 text-xs text-slate-400">
              {checkTrend.drillId} 上台率：{checkTrend.prev}% → {checkTrend.latest}%（{checkTrend.latest >= checkTrend.prev ? '↑ 改善' : '↓ 下降'}）
            </p>
          )}
          <div className="mt-2">
            {checkRecords.slice(0, 3).map((r) => (
              <div key={r.id} className="border-b border-slate-50 py-2 text-xs last:border-0 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">{r.drillId} · 上台 {r.successMade}/{r.successTotal} · RPE {r.rpe}</span>
                  <span className="text-slate-400">{r.date.slice(5)}</span>
                </div>
                <p className="mt-1 text-slate-400">
                  五问：{FIVE_CHECK_ITEMS.map((it) => `${it.label}${r.check[it.key] ? '✓' : '✗'}`).join(' ')} · 失误：{ERROR_LABELS[r.topError]}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {(reactionAcc != null || lastRt || moveLabel || tableSessions.length > 0) && (
        <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
          <p className="text-sm font-medium">迁移线索（离台 → 球台）</p>
          <div className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
            {reactionAcc != null && <p>离台反应正确率：{reactionAcc}%</p>}
            {lastRt && <p>最近反应时：{lastRt.metrics.averageMs}ms</p>}
            {moveLabel && <p>球台移动迁移：{moveLabel}</p>}
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {moveLabel ? '离台指标与球台验证会逐步对齐；多记录几周后看趋势。' : '去「周末验证」记录移动迁移，才能看出离台训练有没有带到球台。'}
          </p>
        </div>
      )}
    </div>
  );
}
