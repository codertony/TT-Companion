import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactionMode } from '../types';

export type ReactionPhase = 'idle' | 'showing' | 'gap' | 'finished';

export interface ReactionConfig {
  mode: ReactionMode;
  displayMs: number;
  gapRange: [number, number];
  durationSec: number;
}

const STIMULI: Record<ReactionMode, string[]> = {
  direction: ['←', '→'],
  stroke: ['FH', 'BH'],
  color: ['红', '蓝', '绿', '黄'],
  number: ['1', '2', '3', '4'],
  dual: ['红 1', '蓝 2', '绿 3', '黄 4'],
};

export function useReaction(cfg: ReactionConfig) {
  const [phase, setPhase] = useState<ReactionPhase>('idle');
  const [stimulus, setStimulus] = useState('');
  const [count, setCount] = useState(0);
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  const pick = useCallback(() => {
    const pool = STIMULI[cfg.mode];
    return pool[Math.floor(Math.random() * pool.length)];
  }, [cfg.mode]);

  const start = useCallback(() => {
    clearTimers();
    setCount(0);
    const endAt = Date.now() + cfg.durationSec * 1000;
    const loop = () => {
      if (Date.now() >= endAt) {
        setPhase('finished');
        return;
      }
      setStimulus(pick());
      setPhase('showing');
      setCount((c) => c + 1);
      timersRef.current.push(
        window.setTimeout(() => {
          setPhase('gap');
          const [lo, hi] = cfg.gapRange;
          const gap = lo + Math.random() * (hi - lo);
          timersRef.current.push(window.setTimeout(loop, gap));
        }, cfg.displayMs),
      );
    };
    loop();
  }, [cfg, clearTimers, pick]);

  const stop = useCallback(() => {
    clearTimers();
    setPhase('finished');
  }, [clearTimers]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return { phase, stimulus, count, start, stop };
}
