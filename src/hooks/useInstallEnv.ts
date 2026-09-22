import { useMemo } from 'react';
import { getInstallEnv, type InstallEnv } from '../lib/env';

export interface InstallEnvInfo {
  env: InstallEnv;
  ua: string;
}

/**
 * 采集当前浏览器的安装环境（唯一允许读 window / navigator 的位置）。
 * 探测逻辑本身保持纯函数（src/lib/env.ts），此处只负责取真实值。
 */
export function useInstallEnv(): InstallEnvInfo {
  return useMemo(() => {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const nav = navigator as Navigator & { standalone?: boolean };
    let standalone = false;
    if (typeof nav !== 'undefined' && nav.standalone === true) standalone = true;

    let displayModeStandalone = false;
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      displayModeStandalone = window.matchMedia('(display-mode: standalone)').matches;
    }

    return { env: getInstallEnv(ua, { standalone, displayModeStandalone }), ua };
  }, []);
}
