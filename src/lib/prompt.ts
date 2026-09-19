import type { PromptType } from '../types';

/** 时机化提示的类型 → 标签 + 配色（训练执行页用于区分"做法/感受/发力/注意/CUE"） */
export const PROMPT_META: Record<PromptType, { label: string; className: string }> = {
  instruction: { label: '做法', className: 'bg-blue-500/15 text-blue-600 dark:text-blue-400' },
  awareness: { label: '感受', className: 'bg-teal-500/15 text-teal-600 dark:text-teal-400' },
  force: { label: '发力', className: 'bg-orange-500/15 text-orange-600 dark:text-orange-400' },
  safety: { label: '注意', className: 'bg-amber-500/20 text-amber-700 dark:text-amber-400' },
  cue: { label: '本周 CUE', className: 'bg-violet-500/15 text-violet-600 dark:text-violet-400' },
  encourage: { label: '保持', className: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
};
