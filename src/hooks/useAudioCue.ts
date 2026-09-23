import { useCallback, useEffect, useRef, useState } from 'react';

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
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
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

  // 组件卸载（SPA 内返回上一页）：立即清掉定时器与播报队列，避免离开后仍持续发声
  useEffect(() => {
    return () => {
      runningRef.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  // 切到后台 / 关闭标签页：同样停止播报，防止后台持续响
  useEffect(() => {
    const onHide = () => stop();
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') stop();
    };
    window.addEventListener('pagehide', onHide);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pagehide', onHide);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [stop]);

  return { running, count, start, stop };
}
