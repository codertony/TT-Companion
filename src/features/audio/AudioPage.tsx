import { Link } from 'react-router-dom';
import { useAudioCue } from '../../hooks/useAudioCue';
import { useSettingsStore } from '../../stores/settingsStore';

export default function AudioPage() {
  const gapRange = useSettingsStore((s) => s.audio.gapRange);
  const { running, start, stop } = useAudioCue(gapRange);

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center bg-slate-900 px-5 text-white">
      <Link to="/" className="absolute left-5 top-8 text-sm text-slate-400">
        返回
      </Link>
      <h2 className="text-lg font-semibold">语音训练</h2>
      <p className="mt-2 text-sm text-slate-400">左 / 右 / 正手 / 反手 / 短 / 长</p>
      <button
        onClick={running ? stop : start}
        className="mt-10 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl"
      >
        {running ? '■' : '▶'}
      </button>
      <p className="mt-4 text-sm text-slate-400">{running ? '正在播报…' : '点击开始'}</p>
    </div>
  );
}
