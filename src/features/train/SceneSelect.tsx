import { useNavigate } from 'react-router-dom';
import { useTrainStore } from '../../stores/trainStore';
import type { Scene } from '../../types';
import { AppIcon, type AppIconName } from '../../components/AppIcon';

const scenes: { id: Scene; name: string; desc: string; icon: AppIconName }[] = [
  { id: 'metro_sit', name: '地铁 · 坐', desc: '反应与感知，不影响他人', icon: 'train' },
  { id: 'metro_stand', name: '地铁 · 站', desc: '站姿平衡与足底感知', icon: 'train' },
  { id: 'office', name: '办公室', desc: '步法、核心、影子动作', icon: 'briefcase' },
  { id: 'home', name: '家', desc: '下肢稳定、启动制动、影子挥拍', icon: 'home' },
  { id: 'club', name: '球馆', desc: '周末打完球，回来记录验证结果', icon: 'pingPong' },
];

export default function SceneSelect() {
  const nav = useNavigate();
  const setScene = useTrainStore((s) => s.setScene);

  const go = (scene: Scene) => {
    setScene(scene);
    if (scene === 'club') nav('/profile/feedback');
    else nav('/train/duration');
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-slate-50 px-5 py-8 pb-24 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <h2 className="text-2xl font-semibold">在哪里训练？</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">按你现在在哪，只推荐能做的动作。</p>

      <div className="mt-6 flex flex-col gap-3">
        {scenes.map((s) => (
          <button
            key={s.id}
            onClick={() => go(s.id)}
            className="flex items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-100 active:scale-[0.98] dark:bg-slate-900 dark:ring-slate-800"
          >
            <AppIcon name={s.icon} className="h-7 w-7 shrink-0 text-slate-500 dark:text-slate-400" />
            <span className="flex-1">
              <span className="block font-medium">{s.name}</span>
              <span className="mt-0.5 block text-sm text-slate-400 dark:text-slate-500">{s.desc}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
