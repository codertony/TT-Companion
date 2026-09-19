import { useCallback, useRef, useState } from 'react';

const WORDS = ['左', '右', '正手', '反手', '短', '长'];

export function useAudioCue(gapRange: [number, number]) {
  const [running, setRunning] = useState(false);
  const [count, setCount] = useState(0);
  const runningRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  const speak = useCallback((word: string) => {
    if (!('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(word);
    u.lang = 'zh-CN';
    window.speechSynthesis.speak(u);
  }, []);

  const stop = useCallback(() => {
    runningRef.current = false;
    setRunning(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  const start = useCallback(() => {
    stop();
    runningRef.current = true;
    setRunning(true);
    setCount(0);
    const loop = () => {
      if (!runningRef.current) return;
      speak(WORDS[Math.floor(Math.random() * WORDS.length)]);
      setCount((c) => c + 1);
      const [lo, hi] = gapRange;
      const gap = lo + Math.random() * (hi - lo);
      timerRef.current = window.setTimeout(loop, gap);
    };
    loop();
  }, [gapRange, speak, stop]);

  return { running, count, start, stop };
}
