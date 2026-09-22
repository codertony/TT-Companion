import { useEffect, useState } from 'react';
import { AppIcon, type AppIconName } from './AppIcon';
import { isAndroid, type InstallEnv } from '../lib/env';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

function Step({ icon, title, desc }: { icon: AppIconName; title: string; desc?: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
        <AppIcon name={icon} className="h-6 w-6" />
      </span>
      <span className="flex min-h-12 flex-col justify-center">
        <span className="text-sm font-medium">{title}</span>
        {desc && <span className="mt-0.5 text-xs text-slate-400">{desc}</span>}
      </span>
    </li>
  );
}

const cardClass =
  'rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800';

/**
 * 安装引导内容：只按安装环境渲染对应文案，不自动弹窗。
 * env 由调用方（useInstallEnv）计算后传入。
 */
export default function InstallGuide({ env, ua = '' }: { env: InstallEnv; ua?: string }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (env !== 'chromium') return;
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, [env]);

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') setInstalled(true);
    setDeferredPrompt(null);
  };

  const copyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // 非安全上下文降级：临时 textarea 复制
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  if (env === 'installed') return null;

  if (installed) {
    return (
      <div className={cardClass}>
        <p className="text-sm font-medium">已安装成功</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">现在可以从桌面或主屏幕打开训练伴侣了。</p>
      </div>
    );
  }

  if (env === 'chromium') {
    const label = isAndroid(ua) ? '安装到桌面' : '安装到电脑';
    return (
      <div className={cardClass}>
        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
            <AppIcon name="download" className="h-6 w-6" />
          </span>
          <span>
            <span className="block font-medium">{label}</span>
            <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">
              装成独立应用，训练时不用每次找网址，还能离线打开。
            </span>
          </span>
        </div>
        <button onClick={install} disabled={!deferredPrompt} className="mt-4 h-12 w-full rounded-xl bg-blue-600 text-white disabled:opacity-40">
          {label}
        </button>
        {!deferredPrompt && (
          <p className="mt-2 text-xs text-slate-400">若按钮不可用，可点浏览器右上角菜单，选「安装应用」。</p>
        )}
      </div>
    );
  }

  if (env === 'ios-safari') {
    return (
      <div className={cardClass}>
        <p className="text-sm text-slate-500 dark:text-slate-400">在 Safari 中把训练伴侣加到主屏幕：</p>
        <ol className="mt-4 flex flex-col gap-4">
          <Step icon="share" title="点底部「分享」按钮" desc="屏幕底部居中的向上箭头图标" />
          <Step icon="squarePlus" title="下滑选「添加到主屏幕」" />
          <Step icon="check" title="点右上角「添加」" desc="完成后主屏幕会出现应用图标" />
        </ol>
      </div>
    );
  }

  if (env === 'wechat-ios' || env === 'wechat-android') {
    const openIn = env === 'wechat-ios' ? '在 Safari 中打开' : '在浏览器打开';
    return (
      <div className={cardClass}>
        <p className="text-sm font-medium">微信里装不了，先换到浏览器</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          微信限制了「添加到主屏幕」，需要先到系统浏览器打开本站，再按对应引导安装。
        </p>
        <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
          <AppIcon name="arrowUpRight" className="h-6 w-6 shrink-0" />
          <p className="text-sm">
            点右上角 <AppIcon name="dots" className="inline h-5 w-5 align-[-4px]" /> → 选「{openIn}」
          </p>
        </div>
        <button
          onClick={copyLink}
          className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-100 text-sm dark:bg-slate-800"
        >
          <AppIcon name="copy" className="h-5 w-5" />
          {copied ? '已复制' : '复制链接'}
        </button>
        <p className="mt-2 text-xs text-slate-400">复制后到浏览器地址栏粘贴打开，再按对应引导安装。</p>
      </div>
    );
  }

  return (
    <div className={cardClass}>
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
          <AppIcon name="browser" className="h-6 w-6" />
        </span>
        <span>
          <span className="block font-medium">请换 Chrome / Safari 打开</span>
          <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">
            当前浏览器不支持安装。请用手机的 Safari / Chrome，或电脑的 Chrome / Edge 打开本站再安装。
          </span>
        </span>
      </div>
    </div>
  );
}
