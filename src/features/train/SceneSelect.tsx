import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrainStore } from '../../stores/trainStore';
import type { Scene } from '../../types';

const scenes: { id: Scene; name: string; desc: string }[] = [
  { id: 'office', name: '办公室', desc: '步法、核心、影子动作' },
  { id: 'home', name: '家', desc: '下肢稳定、启动制动、影子挥拍' },
  { id: 'club', name: '球馆', desc: '周末验证（反馈入口）' },
];

export default function SceneSelect() {
  const nav = useNavigate();
  const setScene = useTrainStore((s) => s.setScene);
  const [metroOpen, setMetroOpen] = useState(false);

  const go = (scene: Scene) => {
    setScene(scene);
    if (scene === 'club') nav('/profile/feedback');
    else nav('/train/duration');
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-slate-50 px-5 py-8 text-slate-900">
      <h2 className="text-2xl font-semibold">在哪里训练？</h2>
      <p className="mt-1 text-sm text-slate-500">先回答「我现在在哪」，系统自动筛选适合的动作。</p>

      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={() => setMetroOpen((v) => !v)}
          className="rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-100 active:scale-[0.98]"
        >
          <p className="font-medium">地铁</p>
          <p className="mt-1 text-sm text-slate-400">反应与感知，不影响他人</p>
        </button>
        {metroOpen && (
          <div className="ml-4 flex gap-3">
            <button onClick={() => go('metro_sit')} className="flex-1 rounded-xl bg-blue-50 p-3 text-sm font-medium text-blue-700">
              坐姿
            </button>
            <button onClick={() => go('metro_stand')} className="flex-1 rounded-xl bg-blue-50 p-3 text-sm font-medium text-blue-700">
              站姿
            </button>
          </div>
        )}
        {scenes.map((s) => (
          <button
            key={s.id}
            onClick={() => go(s.id)}
            className="rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-100 active:scale-[0.98]"
          >
            <p className="font-medium">{s.name}</p>
            <p className="mt-1 text-sm text-slate-400">{s.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
