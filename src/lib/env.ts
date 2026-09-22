// 安装环境探测（纯函数，UA / 独立窗口标志全部以参数传入，不读 window/navigator）
// 浏览器侧的读取集中在 src/hooks/useInstallEnv.ts，便于单测注入任意环境。

export type InstallEnv =
  | 'installed'
  | 'wechat-ios'
  | 'wechat-android'
  | 'ios-safari'
  | 'chromium'
  | 'other';

export interface InstallEnvOptions {
  /** iOS：navigator.standalone === true（已加入主屏幕） */
  standalone?: boolean;
  /** Chromium：matchMedia('(display-mode: standalone)').matches（已安装为 PWA） */
  displayModeStandalone?: boolean;
}

/** 微信内置浏览器（iOS / Android / 桌面） */
export function isWeChat(ua: string): boolean {
  return /MicroMessenger/i.test(ua);
}

/** iOS / iPadOS。iPadOS 13+ 会伪装成 Mac，按 Macintosh + Touch 兜底识别 */
export function isIOS(ua: string): boolean {
  if (/iPad|iPhone|iPod/i.test(ua)) return true;
  return /Macintosh/i.test(ua) && /Touch/i.test(ua);
}

export function isAndroid(ua: string): boolean {
  return /Android/i.test(ua);
}

/** Chromium 系浏览器（桌面 Chrome / Edge / Opera / 安卓 Chrome 等） */
function isChromium(ua: string): boolean {
  return /Chrome\/|Chromium\/|Edg\/|CriOS\/|OPR\//i.test(ua);
}

/** 是否已作为 PWA / 主屏幕应用安装（纯函数，标志由调用方采集） */
export function isStandalone(opts: InstallEnvOptions = {}): boolean {
  return Boolean(opts.standalone || opts.displayModeStandalone);
}

/**
 * 汇总安装环境，供安装引导按分支渲染。
 * 优先级：已安装 > 微信内 iOS/Android > iOS Safari > Chromium > 其他
 */
export function getInstallEnv(ua: string, opts: InstallEnvOptions = {}): InstallEnv {
  if (isStandalone(opts)) return 'installed';
  if (isWeChat(ua)) {
    if (isIOS(ua)) return 'wechat-ios';
    if (isAndroid(ua)) return 'wechat-android';
    return 'other';
  }
  if (isIOS(ua)) return 'ios-safari';
  if (isAndroid(ua)) return 'chromium';
  if (isChromium(ua)) return 'chromium';
  return 'other';
}
