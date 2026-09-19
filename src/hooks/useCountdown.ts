import { useEffect, useRef, useState } from 'react';

/** 用 endAt 时间戳校正漂移的倒计时 hook */
export function useCountdown(totalSec: number, onDone: () => void) {
  const [remainSec, setRemainSec] = useState(totalSec);
  const [running, setRunning] = useState(true);
  const remainMsRef = useRef(totalSec * 1000);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!running) return;
    const endAt = Date.now() + remainMsRef.current;
    const id = setInterval(() => {
      const remainMs = endAt - Date.now();
      remainMsRef.current = Math.max(0, remainMs);
      setRemainSec(Math.ceil(remainMs / 1000));
      if (remainMs <= 0) {
        setRunning(false);
        onDoneRef.current();
      }
    }, 250);
    return () => clearInterval(id);
  }, [running]);

  const pause = () => setRunning(false);
  const resume = () => setRunning(true);

  return { remainSec, running, pause, resume };
}
