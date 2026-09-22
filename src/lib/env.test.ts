import { describe, it, expect } from 'vitest';
import { isWeChat, isIOS, isAndroid, isStandalone, getInstallEnv } from './env';

// 真实 UA 样本（用于覆盖各分支；微信/移动 UA 为常见形态）
const UA = {
  wechatIOS:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.45(0x18002d2e) NetType/WIFI Language/zh_CN',
  wechatAndroid:
    'Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/UD1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.0.0 Mobile Safari/537.36 MicroMessenger/8.0.45',
  iosSafari:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
  // iPadOS 伪装成 Mac 的形态：Macintosh + Touch
  iPadOSMac:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Touch/1.0 Safari/604.1',
  androidChrome:
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  desktopChrome:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  desktopEdge:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
  desktopSafari:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
  desktopFirefox:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
};

describe('isWeChat', () => {
  it('识别微信内置浏览器', () => {
    expect(isWeChat(UA.wechatIOS)).toBe(true);
    expect(isWeChat(UA.wechatAndroid)).toBe(true);
    expect(isWeChat(UA.iosSafari)).toBe(false);
  });
});

describe('isIOS', () => {
  it('识别 iPhone / iPad / iPadOS 伪装 Mac', () => {
    expect(isIOS(UA.iosSafari)).toBe(true);
    expect(isIOS(UA.wechatIOS)).toBe(true);
    expect(isIOS(UA.iPadOSMac)).toBe(true);
    expect(isIOS(UA.androidChrome)).toBe(false);
    expect(isIOS(UA.desktopSafari)).toBe(false);
  });
});

describe('isAndroid', () => {
  it('识别安卓 UA', () => {
    expect(isAndroid(UA.androidChrome)).toBe(true);
    expect(isAndroid(UA.wechatAndroid)).toBe(true);
    expect(isAndroid(UA.iosSafari)).toBe(false);
  });
});

describe('isStandalone', () => {
  it('两个标志任一为真即视为已安装', () => {
    expect(isStandalone()).toBe(false);
    expect(isStandalone({ standalone: true })).toBe(true);
    expect(isStandalone({ displayModeStandalone: true })).toBe(true);
    expect(isStandalone({ standalone: false, displayModeStandalone: false })).toBe(false);
  });
});

describe('getInstallEnv', () => {
  it('已安装优先于一切', () => {
    expect(getInstallEnv(UA.wechatIOS, { standalone: true })).toBe('installed');
    expect(getInstallEnv(UA.desktopChrome, { displayModeStandalone: true })).toBe('installed');
  });

  it('微信内按系统区分 iOS / Android', () => {
    expect(getInstallEnv(UA.wechatIOS)).toBe('wechat-ios');
    expect(getInstallEnv(UA.wechatAndroid)).toBe('wechat-android');
  });

  it('iOS Safari（含 iPadOS 伪装 Mac）', () => {
    expect(getInstallEnv(UA.iosSafari)).toBe('ios-safari');
    expect(getInstallEnv(UA.iPadOSMac)).toBe('ios-safari');
  });

  it('安卓 Chrome / 桌面 Chrome / Edge 归为 chromium', () => {
    expect(getInstallEnv(UA.androidChrome)).toBe('chromium');
    expect(getInstallEnv(UA.desktopChrome)).toBe('chromium');
    expect(getInstallEnv(UA.desktopEdge)).toBe('chromium');
  });

  it('桌面 Safari / Firefox 归为 other', () => {
    expect(getInstallEnv(UA.desktopSafari)).toBe('other');
    expect(getInstallEnv(UA.desktopFirefox)).toBe('other');
  });
});
