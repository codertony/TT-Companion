import InstallGuide from '../../components/InstallGuide';
import { useInstallEnv } from '../../hooks/useInstallEnv';

export default function InstallGuidePage() {
  const { env, ua } = useInstallEnv();

  return (
    <div className="mx-auto min-h-dvh w-full max-w-md bg-slate-50 px-5 py-8 pb-24 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <h2 className="text-2xl font-semibold">桌面应用安装引导</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        把训练伴侣装成桌面应用，训练时更快打开，还能离线使用。
      </p>
      <div className="mt-6">
        {env === 'installed' ? (
          <p className="rounded-2xl bg-white p-5 text-sm text-slate-500 ring-1 ring-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800">
            应用已安装，无需引导。可从桌面或主屏幕直接打开。
          </p>
        ) : (
          <InstallGuide env={env} ua={ua} />
        )}
      </div>
    </div>
  );
}
