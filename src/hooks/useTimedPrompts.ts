import type { TimedPrompt } from '../types';

/** 返回已过时间点里最近的一条提示（纯函数） */
export function currentPrompt(prompts: TimedPrompt[], elapsedSec: number): TimedPrompt | null {
  if (prompts.length === 0) return null;
  const sorted = [...prompts].sort((a, b) => a.atSec - b.atSec);
  let cur: TimedPrompt | null = null;
  for (const p of sorted) {
    if (elapsedSec >= p.atSec) cur = p;
    else break;
  }
  return cur;
}

export function useTimedPrompts(prompts: TimedPrompt[], elapsedSec: number): TimedPrompt | null {
  return currentPrompt(prompts, elapsedSec);
}
