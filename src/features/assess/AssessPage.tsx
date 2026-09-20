import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAssessmentStore } from '../../stores/assessmentStore';
import { deriveCapacityState } from '../../domain/capacity';
import { identifyLimiters } from '../../domain/limiter';
import type { CapacityState } from '../../types';

function AssessForm({ id, title, unit, hint }: { id: string; title: string; unit: string; hint: string }) {
  const results = useAssessmentStore((s) => s.results);
  const record = useAssessmentStore((s) => s.record);
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const state = deriveCapacityState(id, results);

  const save = () => {
    const l = Number.parseFloat(left);
    const r = Number.parseFloat(right);
    if (Number.isNaN(l) || Number.isNaN(r)) return;
    record({ assessmentId: id, left: l, right: r, unit, protocolVersion: '1' });
    setLeft('');
    setRight('');
  };

  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{hint}</p>
      <div className="mt-3 flex gap-2">
        <input
          type="number"
          inputMode="decimal"
          placeholder={`左（${unit}）`}
          value={left}
          onChange={(e) => setLeft(e.target.value)}
          className="h-12 flex-1 rounded-xl border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
        />
        <input
          type="number"
          inputMode="decimal"
          placeholder={`右（${unit}）`}
          value={right}
          onChange={(e) => setRight(e.target.value)}
          className="h-12 flex-1 rounded-xl border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
        />
      </div>
      <button onClick={save} className="mt-3 h-12 w-full rounded-xl bg-blue-600 text-sm font-medium text-white">
        保存
      </button>
      {state && state.basisCount > 0 && (
        <p
          className={`mt-2 text-xs ${
            state.status === 'below'
              ? 'text-amber-600 dark:text-amber-400'
              : state.status === 'normal'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-400'
          }`}
        >
          {state.status === 'below'
            ? '⚠️ 左右差异明显（候选短板）'
            : state.status === 'normal'
              ? '✓ 左右均衡'
              : '数据不足'}
          {' · '}已记录 {state.basisCount} 次（置信度 {state.confidence === 'high' ? '高' : state.confidence === 'medium' ? '中' : '低'}）
        </p>
      )}
    </div>
  );
}

export default function AssessPage() {
  const results = useAssessmentStore((s) => s.results);
  const states = ['single_leg_stand', 'sit_to_stand']
    .map((id) => deriveCapacityState(id, results))
    .filter((s): s is CapacityState => s != null);

  const limiters = identifyLimiters(states, {
    goalRelevance: { balance: 0.9, joint_control: 0.9 },
    transferEvidence: { balance: 0.8, joint_control: 0.8 },
    trainability: { balance: 0.9, joint_control: 0.9 },
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
        左右各测一次，找出下肢稳定 / 控制的短板。建议 4–6 周用同一协议复测。
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <AssessForm
          id="single_leg_stand"
          title="单腿站平衡"
          unit="秒"
          hint="闭眼或睁眼单腿站立，左右各计时，取稳定站立的秒数"
        />
        <AssessForm
          id="sit_to_stand"
          title="单腿坐站"
          unit="次"
          hint="单腿从椅子站起再坐下，左右各 30 秒，计数完成次数"
        />
      </div>

      {limiters.length > 0 && (
        <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
          <p className="text-sm font-medium">当前候选限制因素</p>
          <p className="mt-1 text-xs text-slate-400">按「短板 × 相关度 × 迁移 × 置信度 × 可训练性」排序</p>
          <div className="mt-2 space-y-2">
            {limiters.map((l) => (
              <div key={l.capacityId} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-sm font-medium">
                  {l.capacityId === 'balance' ? '静态平衡' : '下肢控制'} · 优先级 {l.priority.toFixed(2)}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{l.rationale}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">建议：{l.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
