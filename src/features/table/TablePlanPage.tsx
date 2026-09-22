import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCueStore } from '../../stores/cueStore';
import { useCheckinStore, todayCheckin } from '../../stores/checkinStore';
import { useAssessmentStore } from '../../stores/assessmentStore';
import { useTableStore } from '../../stores/tableStore';
import { evaluateSafety } from '../../domain/safety';
import { deriveTableFocus } from '../../domain/tableFocus';
import { ASSESSMENT_CATALOG, deriveCapacityState } from '../../domain/capacity';
import { identifyLimiters } from '../../domain/limiter';
import { TARGET_LABELS, generateDrillChain } from '../../domain/tableGenerator';
import { tableRatio } from '../../domain/tableRatio';
import { buildTableSession } from '../../domain/tableSession';
import { robotGuidance, MULTIBALL_PROGRESSION } from '../../domain/tableBallSource';
import { adaptForPartner, PARTNER_PROTOCOL } from '../../domain/tablePartner';
import { getDrill, TARGET_DRILL } from '../../data/tableDrills';
import { GLOSSARY } from '../../data/tableGlossary';
import type { BallSource, CapacityState, PartnerLevel, TargetTechnique } from '../../types';

const BALL_SOURCES: { id: BallSource; label: string }[] = [
  { id: 'partner', label: '球搭子' },
  { id: 'robot', label: '发球机' },
  { id: 'multiball', label: '多球' },
];

const DURATIONS = [45, 60, 90, 120];

const READY = {
  green: { label: '今天适合上台训练', cls: 'bg-emerald-50 ring-emerald-100 dark:bg-emerald-950 dark:ring-emerald-900', text: 'text-emerald-700 dark:text-emerald-300' },
  yellow: { label: '今天降负荷练', cls: 'bg-amber-50 ring-amber-100 dark:bg-amber-950 dark:ring-amber-900', text: 'text-amber-700 dark:text-amber-300' },
  red: { label: '今天先休息，不生成训练课', cls: 'bg-red-50 ring-red-100 dark:bg-red-950 dark:ring-red-900', text: 'text-red-700 dark:text-red-300' },
} as const;

export default function TablePlanPage() {
  const nav = useNavigate();
  const cue = useCueStore((s) => s.primary);
  const records = useCheckinStore((s) => s.records);
  const results = useAssessmentStore((s) => s.results);
  const setPlan = useTableStore((s) => s.setPlan);
  const [target, setTarget] = useState<TargetTechnique>('forehand_drive');
  const [ballSource, setBallSource] = useState<BallSource>('partner');
  const [partnerLevel, setPartnerLevel] = useState<PartnerLevel>('beginner');
  const [durationMin, setDurationMin] = useState(90);
  const [helpOpen, setHelpOpen] = useState(false);

  const safety = evaluateSafety(todayCheckin(records) ?? {});
  const states = Object.entries(ASSESSMENT_CATALOG)
    .map(([id]) => deriveCapacityState(id, results))
    .filter((s): s is CapacityState => s != null);
  const limiters = identifyLimiters(states, {
    goalRelevance: { balance: 0.9, joint_control: 0.9, strength: 0.6, mobility: 0.6, aerobic: 0.5 },
    transferEvidence: { balance: 0.8, joint_control: 0.8, strength: 0.5, mobility: 0.5, aerobic: 0.4 },
    trainability: { balance: 0.9, joint_control: 0.9, strength: 0.8, mobility: 0.7, aerobic: 0.6 },
  });
  const focus = deriveTableFocus(cue, limiters);
  const chain = generateDrillChain(target);
  const rep = getDrill(TARGET_DRILL[target]);
  const adaptation = rep ? adaptForPartner(rep, partnerLevel) : null;
  const robotHints = robotGuidance(rep?.layer ?? 'L1', rep?.randomness ?? 'fixed');
  const ratio = tableRatio(0.5);

  const start = () => {
    if (safety.state === 'red') return;
    const plan = buildTableSession({ target: TARGET_LABELS[target], ballSource, durationMin, ratio, safety });
    setPlan({
      ...plan,
      focusPoint: rep?.focusPoint,
      rule: adaptation?.rule ?? rep?.rule,
      partnerTask: adaptation?.partnerTask ?? rep?.partnerTask,
    });
    nav('/table/run');
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-slate-50 px-5 py-8 pb-24 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">台上训练编排</h2>
        <div className="flex items-center">
          <button onClick={() => setHelpOpen(true)} className="inline-flex h-12 items-center px-2 text-sm text-blue-600 dark:text-blue-400">说明</button>
          <Link to="/" className="inline-flex h-12 items-center px-2 text-sm text-slate-400 dark:text-slate-500">返回</Link>
        </div>
      </div>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">周末把有限台上时间花在高价值组合上。</p>

      <div className={`mt-4 rounded-2xl p-4 ring-1 ${READY[safety.state].cls}`}>
        <p className={`font-medium ${READY[safety.state].text}`}>{READY[safety.state].label}</p>
        {safety.reasons.length > 0 && <p className={`mt-1 text-sm ${READY[safety.state].text}`}>{safety.reasons.join('；')}</p>}
      </div>

      <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
        <p className="text-xs text-slate-400">今天台上重点（由 ONE CUE / 短板推导）</p>
        <p className="mt-1 text-lg font-semibold">{focus.title}</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{focus.reason}</p>
        {focus.target !== target && (
          <button onClick={() => setTarget(focus.target)} className="mt-3 h-10 rounded-xl bg-blue-50 px-4 text-sm text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            就用「{focus.title}」
          </button>
        )}
      </div>

      <p className="mt-6 text-sm font-medium text-slate-500 dark:text-slate-400">目标技术</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {(Object.keys(TARGET_LABELS) as TargetTechnique[]).map((t) => (
          <button
            key={t}
            onClick={() => setTarget(t)}
            className={`min-h-12 rounded-xl px-3 text-sm ${target === t ? 'bg-blue-600 text-white' : 'bg-white ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800'}`}
          >
            {TARGET_LABELS[t]}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm font-medium text-slate-500 dark:text-slate-400">球源</p>
      <div className="mt-2 flex gap-2">
        {BALL_SOURCES.map((b) => (
          <button
            key={b.id}
            onClick={() => setBallSource(b.id)}
            className={`h-12 flex-1 rounded-xl text-sm ${ballSource === b.id ? 'bg-blue-600 text-white' : 'bg-white ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800'}`}
          >
            {b.label}
          </button>
        ))}
      </div>

      {ballSource === 'partner' && (
        <>
          <p className="mt-6 text-sm font-medium text-slate-500 dark:text-slate-400">球搭子水平</p>
          <div className="mt-2 flex gap-2">
            <button onClick={() => setPartnerLevel('beginner')} className={`h-12 flex-1 rounded-xl text-sm ${partnerLevel === 'beginner' ? 'bg-blue-600 text-white' : 'bg-white ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800'}`}>水平相近</button>
            <button onClick={() => setPartnerLevel('higher')} className={`h-12 flex-1 rounded-xl text-sm ${partnerLevel === 'higher' ? 'bg-blue-600 text-white' : 'bg-white ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800'}`}>水平更高</button>
          </div>
        </>
      )}

      <p className="mt-6 text-sm font-medium text-slate-500 dark:text-slate-400">时长</p>
      <div className="mt-2 flex gap-2">
        {DURATIONS.map((d) => (
          <button key={d} onClick={() => setDurationMin(d)} className={`h-12 flex-1 rounded-xl text-sm ${durationMin === d ? 'bg-blue-600 text-white' : 'bg-white ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800'}`}>{d} 分钟</button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
        <p className="text-sm font-medium">训练配比</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          固定动作 {ratio.fixed}% · 固定脚步 {ratio.footwork}% · 半随机 {ratio.semi}% · 前三板 {ratio.serveReceive}% · 随机/比赛 {ratio.random}%
        </p>
        <p className="mt-1 text-xs text-slate-400">动作越稳定，固定动作占比会越低、随机与比赛占比越高</p>
      </div>

      <p className="mt-8 text-sm font-medium text-slate-500 dark:text-slate-400">进阶链（技术 × 落点 × 移动 × 旋转 × 随机度 × 前后板）</p>
      <div className="mt-2 rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
        {chain.map((s) => (
          <div key={s.level} className="flex gap-3 border-b border-slate-50 py-2 last:border-0 dark:border-slate-800">
            <span className="w-6 shrink-0 font-semibold text-blue-600 dark:text-blue-400">{s.level}</span>
            <div className="min-w-0">
              <p className="text-sm font-medium">{s.name}</p>
              <p className="mt-0.5 text-xs text-slate-400">{s.rule}</p>
            </div>
          </div>
        ))}
      </div>

      {rep && (
        <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
          <p className="text-sm font-medium">双方任务（{rep.target} · L{rep.layer.slice(1)}）</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{adaptation?.rule ?? rep.rule}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">搭档：{adaptation?.partnerTask ?? rep.partnerTask}</p>
          <p className="mt-1 text-xs text-slate-400">你只注意：{rep.focusPoint} · 自检：{rep.selfCheck}</p>
        </div>
      )}

      {ballSource === 'robot' && (
        <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
          <p className="text-sm font-medium">发球机提示</p>
          <ul className="mt-1 list-disc pl-5 text-xs text-slate-500 dark:text-slate-400">
            {robotHints.map((h) => <li key={h}>{h}</li>)}
          </ul>
        </div>
      )}

      {ballSource === 'multiball' && (
        <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
          <p className="text-sm font-medium">多球下旋起板进阶</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{MULTIBALL_PROGRESSION.join(' → ')}</p>
        </div>
      )}

      <button
        onClick={start}
        disabled={safety.state === 'red'}
        className="mt-8 h-12 w-full rounded-xl bg-blue-600 text-base font-medium text-white disabled:opacity-40"
      >
        {safety.state === 'red' ? '今日先休息' : '生成训练课 →'}
      </button>

      {helpOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={() => setHelpOpen(false)}>
          <div
            className="mx-auto max-h-[82vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 pb-8 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">说明</p>
              <button onClick={() => setHelpOpen(false)} className="min-h-12 px-2 text-sm text-slate-400 dark:text-slate-500">关闭</button>
            </div>

            <p className="mt-4 text-sm font-medium">术语说明</p>
            <div className="mt-2 space-y-1">
              {Object.entries(GLOSSARY).map(([term, def]) => (
                <p key={term} className="text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-slate-600 dark:text-slate-300">{term}</span>：{def}
                </p>
              ))}
            </div>

            <p className="mt-5 text-sm font-medium">球搭子协议（{PARTNER_PROTOCOL.length} 条）</p>
            <ol className="mt-2 list-decimal pl-5 text-xs text-slate-500 dark:text-slate-400">
              {PARTNER_PROTOCOL.map((p) => <li key={p}>{p}</li>)}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
