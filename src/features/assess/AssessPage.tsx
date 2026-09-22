import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAssessmentStore } from '../../stores/assessmentStore';
import { useHealthStore, latestHealth } from '../../stores/healthStore';
import { ASSESSMENT_CATALOG, deriveCapacityState, type AssessmentMeta } from '../../domain/capacity';
import { identifyLimiters } from '../../domain/limiter';
import type { CapacityState } from '../../types';

const DOMAIN_LABEL: Record<string, string> = {
  physical_base: '身体基础',
  general_health: '健康状态',
  sport_prep: '专项身体预备',
  perception: '感知与控制',
  technique: '技术与表现',
};

function statusLabel(status: CapacityState['status']): string {
  if (status === 'below') return '⚠️ 短板';
  if (status === 'normal') return '✓ 正常';
  return '— 待测';
}

function AssessForm({ id, meta }: { id: string; meta: AssessmentMeta }) {
  const record = useAssessmentStore((s) => s.record);
  const results = useAssessmentStore((s) => s.results);
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [value, setValue] = useState('');
  const state = deriveCapacityState(id, results);

  const save = () => {
    if (meta.kind === 'bilateral') {
      const l = Number.parseFloat(left);
      const r = Number.parseFloat(right);
      if (Number.isNaN(l) || Number.isNaN(r)) return;
      record({ assessmentId: id, left: l, right: r, unit: meta.unit, protocolVersion: '1' });
      setLeft('');
      setRight('');
    } else {
      const v = Number.parseFloat(value);
      if (Number.isNaN(v)) return;
      record({ assessmentId: id, value: v, unit: meta.unit, protocolVersion: '1' });
      setValue('');
    }
  };

  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
      <div className="flex items-center justify-between">
        <p className="font-medium">{meta.label}</p>
        <span className="text-xs text-slate-400">{statusLabel(state?.status ?? 'unknown')}</span>
      </div>
      {meta.howTo && <p className="mt-1.5 text-xs text-slate-400">{meta.howTo}</p>}
      <div className="mt-2 flex gap-2">
        {meta.kind === 'bilateral' ? (
          <>
            <input
              type="number"
              inputMode="decimal"
              placeholder={`左（${meta.unit}）`}
              value={left}
              onChange={(e) => setLeft(e.target.value)}
              className="h-12 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
            <input
              type="number"
              inputMode="decimal"
              placeholder={`右（${meta.unit}）`}
              value={right}
              onChange={(e) => setRight(e.target.value)}
              className="h-12 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </>
        ) : (
          <input
            type="number"
            inputMode="decimal"
            placeholder={`数值（${meta.unit}）`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-12 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
        )}
      </div>
      <button onClick={save} className="mt-2 h-12 w-full rounded-xl bg-blue-600 text-sm font-medium text-white">
        保存
      </button>
      {state && state.basisCount > 0 && (
        <p className="mt-2 text-xs text-slate-400">
          已记录 {state.basisCount} 次 · 置信度 {state.confidence === 'high' ? '高' : state.confidence === 'medium' ? '中' : '低'}
        </p>
      )}
    </div>
  );
}

function HealthSection() {
  const records = useHealthStore((s) => s.records);
  const record = useHealthStore((s) => s.record);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [hr, setHr] = useState('');
  const latest = latestHealth(records);

  const bmi =
    latest?.height && latest.weight ? (latest.weight / (latest.height / 100) ** 2).toFixed(1) : null;

  const save = () => {
    record({
      height: height ? Number.parseFloat(height) : undefined,
      weight: weight ? Number.parseFloat(weight) : undefined,
      restingHr: hr ? Number.parseFloat(hr) : undefined,
    });
    setHeight('');
    setWeight('');
    setHr('');
  };

  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
      <div className="flex items-center justify-between">
        <p className="font-medium">身体与恢复（可选）</p>
        {latest && <span className="text-xs text-slate-400">最近 {latest.date.slice(5)}</span>}
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <input type="number" inputMode="decimal" placeholder="身高cm" value={height} onChange={(e) => setHeight(e.target.value)} className="h-12 w-full min-w-0 rounded-xl border border-slate-200 px-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
        <input type="number" inputMode="decimal" placeholder="体重kg" value={weight} onChange={(e) => setWeight(e.target.value)} className="h-12 w-full min-w-0 rounded-xl border border-slate-200 px-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
        <input type="number" inputMode="decimal" placeholder="静息心率" value={hr} onChange={(e) => setHr(e.target.value)} className="h-12 w-full min-w-0 rounded-xl border border-slate-200 px-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
      </div>
      <p className="mt-1 text-xs text-slate-400">静息心率：早晨起床前测，看 7–14 天趋势（越低通常心肺越好）</p>
      <button onClick={save} className="mt-2 h-12 w-full rounded-xl bg-blue-600 text-sm font-medium text-white">
        记录
      </button>
      {latest && (
        <p className="mt-2 text-xs text-slate-400">
          最近：{latest.height != null ? `${latest.height}cm` : '—'} · {latest.weight != null ? `${latest.weight}kg` : '—'} · {latest.restingHr != null ? `${latest.restingHr}bpm` : '—'}
          {bmi && <span className="ml-1">· BMI {bmi}</span>}
        </p>
      )}
    </div>
  );
}

export default function AssessPage() {
  const results = useAssessmentStore((s) => s.results);
  const entries = Object.entries(ASSESSMENT_CATALOG);
  const groups = [...new Set(entries.map(([, m]) => m.group))];

  const states = entries
    .map(([id]) => deriveCapacityState(id, results))
    .filter((s): s is CapacityState => s != null);

  const limiters = identifyLimiters(states, {
    goalRelevance: { balance: 0.9, joint_control: 0.9, strength: 0.6, mobility: 0.6, aerobic: 0.5 },
    transferEvidence: { balance: 0.8, joint_control: 0.8, strength: 0.5, mobility: 0.5, aerobic: 0.4 },
    trainability: { balance: 0.9, joint_control: 0.9, strength: 0.8, mobility: 0.7, aerobic: 0.6 },
  });

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-slate-50 px-5 py-8 pb-24 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">评估中心</h2>
        <Link to="/profile" className="inline-flex h-12 items-center px-2 text-sm text-slate-400 dark:text-slate-500">
          返回
        </Link>
      </div>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        每次按同一协议测，4–6 周复测对比，找出身体基础短板。
      </p>

      <div className="mt-4">
        <HealthSection />
      </div>

      {groups.map((g) => (
        <div key={g} className="mt-6">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{g}</p>
          <div className="mt-2 flex flex-col gap-3">
            {entries
              .filter(([, m]) => m.group === g)
              .map(([id, meta]) => (
                <AssessForm key={id} id={id} meta={meta} />
              ))}
          </div>
        </div>
      ))}

      {limiters.length > 0 && (
        <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
          <p className="text-sm font-medium">当前候选限制因素</p>
          <p className="mt-1 text-xs text-slate-400">按「短板 × 相关度 × 迁移 × 置信度 × 可训练性」排序</p>
          <div className="mt-2 space-y-2">
            {limiters.slice(0, 3).map((l) => (
              <div key={l.capacityId} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-sm font-medium">
                  {DOMAIN_LABEL[l.capacityId] ?? l.capacityId} · 优先级 {l.priority.toFixed(2)}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{l.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
