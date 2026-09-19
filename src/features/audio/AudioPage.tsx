import { Link } from 'react-router-dom';
import { useAudioCue } from '../../hooks/useAudioCue';
import { useSettingsStore } from '../../stores/settingsStore';

const WORD_MAP = [
  { word: '左 / 右', act: '并步' },
  { word: '正手 / 反手', act: '徒手挥拍' },
  { word: '短 / 长', act: '上前 / 后撤' },
];

export default function AudioPage() {
  const gapRange = useSettingsStore((s) => s.audio.gapRange);
  const { running, count, start, stop } = useAudioCue(gapRange);
  const supported = 'speechSynthesis' in window;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-slate-50 px-5 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">语音训练</h2>
        <Link to="/" className="inline-flex h-12 items-center px-2 text-sm text-slate-400 dark:text-slate-500">
          返回
        </Link>
      </div>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">戴上耳机，听到指令就立刻做对应徒手动作。</p>

      <div className="mt-6 space-y-2">
        {WORD_MAP.map((w) => (
          <div key={w.word} className="flex items-center justify-between rounded-xl bg-white px-4 py-3 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
            <span className="text-sm font-medium">{w.word}</span>
            <span className="text-sm text-slate-400 dark:text-slate-500">→ {w.act}</span>
          </div>
        ))}
      </div>

      {!supported && (
        <p className="mt-4 rounded-lg bg-amber-500/15 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
          当前设备不支持语音播报，训练会静默，建议改用屏幕文字模式（暂未开放）。
        </p>
      )}

      <div className="flex flex-1 flex-col items-center justify-center">
        <button
          onClick={() => {
            if (running) stop();
            else start();
          }}
          aria-label={running ? '停止播报' : '开始播报'}
          className={`flex h-20 w-20 items-center justify-center rounded-full text-3xl text-white ${
            running ? 'bg-slate-500' : 'bg-blue-600'
          }`}
        >
          {running ? '■' : '▶'}
        </button>
        <p className="mt-4 text-sm text-slate-400">{running ? `正在播报（第 ${count} 次）…` : '点击开始'}</p>
      </div>
    </div>
  );
}
