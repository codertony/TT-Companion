import { Link } from 'react-router-dom';
import CueCard from '../../components/CueCard';
import ProgressRing from '../../components/ProgressRing';
import { useCueStore } from '../../stores/cueStore';
import { useSessionStore } from '../../stores/sessionStore';
import { isThisWeek } from '../../lib/date';

const quickLinks = [
  { to: '/reaction', name: '反应', desc: '视觉刺激' },
  { to: '/audio', name: '语音', desc: '通勤不盯屏' },
  { to: '/powerchain', name: '发力链', desc: '稳定—传递—加速' },
  { to: '/anticipation', name: '预判', desc: '触球前判断' },
  { to: '/integration', name: '整合', desc: '认知—运动' },
];

export default function Home() {
  const primary = useCueStore((s) => s.primary);
  const sessions = useSessionStore((s) => s.sessions);
  const weekDone = sessions.filter((s) => isThisWeek(s.date)).length;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-slate-50 px-5 py-8 text-slate-900">
      <p className="text-sm text-slate-500">下午好，今天练一点吗</p>
      <h1 className="mt-2 text-3xl font-bold">离台训练伴侣</h1>

      <div className="mt-6 flex items-center gap-4">
        <ProgressRing value={weekDone} max={7} label={`${weekDone}/7`} />
        <div className="text-sm text-slate-500">本周训练完成（天）</div>
      </div>

      <div className="mt-6">
        <CueCard cue={primary} />
      </div>

      <Link
        to="/train"
        className="mt-6 block h-12 rounded-xl bg-blue-600 text-center text-base font-medium leading-[48px] text-white transition active:scale-[0.98]"
      >
        开始训练 →
      </Link>

      <p className="mt-8 text-sm font-medium text-slate-500">专项训练</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {quickLinks.map((q) => (
          <Link
            key={q.to}
            to={q.to}
            className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 active:scale-[0.98]"
          >
            <p className="font-medium">{q.name}</p>
            <p className="mt-1 text-xs text-slate-400">{q.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
