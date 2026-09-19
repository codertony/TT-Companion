import { Link } from 'react-router-dom';
import CueCard from '../../components/CueCard';
import ProgressRing from '../../components/ProgressRing';
import { useCueStore } from '../../stores/cueStore';
import { useSessionStore } from '../../stores/sessionStore';
import { isThisWeek, todayStr } from '../../lib/date';

const quickLinks = [
  { to: '/reaction', name: '反应', desc: '2 分钟 · 练视觉到动作的快速映射' },
  { to: '/audio', name: '语音', desc: '3 分钟 · 通勤闭眼也能练' },
  { to: '/powerchain', name: '发力链', desc: '3 分钟 · 脚底到球拍的力量顺序' },
  { to: '/anticipation', name: '预判', desc: '3 分钟 · 触球前先判断' },
  { to: '/integration', name: '整合', desc: '3 分钟 · 判断和动作连起来' },
];

function greeting(): string {
  const h = new Date().getHours();
  if (h < 6) return '凌晨好';
  if (h < 11) return '早上好';
  if (h < 14) return '中午好';
  if (h < 18) return '下午好';
  return '晚上好';
}

export default function Home() {
  const primary = useCueStore((s) => s.primary);
  const sessions = useSessionStore((s) => s.sessions);
  const weekDays = new Set(sessions.filter((s) => isThisWeek(s.date)).map((s) => s.date)).size;
  const todayDone = sessions.some((s) => s.date === todayStr());

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-slate-50 px-5 py-8 pb-24 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <p className="text-sm text-slate-500 dark:text-slate-400">{greeting()}，今天练一点吗</p>
      <h1 className="mt-2 text-3xl font-bold">离台训练伴侣</h1>

      <div className="mt-6 flex items-center gap-4">
        <ProgressRing value={weekDays} max={7} label={`${weekDays}/7`} />
        <div className="text-sm text-slate-500 dark:text-slate-400">
          本周已练 {weekDays} 天 · 目标 7 天
          {todayDone && <span className="ml-2 text-emerald-600 dark:text-emerald-400">今天已完成</span>}
        </div>
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

      <p className="mt-8 text-sm font-medium text-slate-500 dark:text-slate-400">专项训练</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {quickLinks.map((q) => (
          <Link
            key={q.to}
            to={q.to}
            className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 active:scale-[0.98] dark:bg-slate-900 dark:ring-slate-800"
          >
            <p className="font-medium">{q.name}</p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{q.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
