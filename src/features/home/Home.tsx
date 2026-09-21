import { Link } from 'react-router-dom';
import CueCard from '../../components/CueCard';
import ProgressRing from '../../components/ProgressRing';
import { useCueStore } from '../../stores/cueStore';
import { useSessionStore } from '../../stores/sessionStore';
import { useTableStore } from '../../stores/tableStore';
import { useTrainStore } from '../../stores/trainStore';
import { useCheckinStore, todayCheckin } from '../../stores/checkinStore';
import { evaluateSafety } from '../../domain/safety';
import { isThisWeek, todayStr } from '../../lib/date';

const quickLinks = [
  { to: '/reaction', name: '反应', desc: '2 分钟 · 练视觉到动作的快速映射' },
  { to: '/audio', name: '语音', desc: '3 分钟 · 通勤闭眼也能练' },
  { to: '/powerchain', name: '发力链', desc: '3 分钟 · 脚底到球拍的力量顺序' },
  { to: '/anticipation', name: '预判', desc: '3 分钟 · 触球前先判断' },
  { to: '/integration', name: '整合', desc: '3 分钟 · 判断和动作连起来' },
];

const READY = {
  green: {
    label: '今天适合训练',
    cls: 'bg-emerald-50 ring-emerald-100 dark:bg-emerald-950 dark:ring-emerald-900',
    text: 'text-emerald-700 dark:text-emerald-300',
  },
  yellow: {
    label: '今天降负荷练',
    cls: 'bg-amber-50 ring-amber-100 dark:bg-amber-950 dark:ring-amber-900',
    text: 'text-amber-700 dark:text-amber-300',
  },
  red: {
    label: '今天先休息',
    cls: 'bg-red-50 ring-red-100 dark:bg-red-950 dark:ring-red-900',
    text: 'text-red-700 dark:text-red-300',
  },
} as const;

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
  const tableSessions = useTableStore((s) => s.sessions);
  const plan = useTrainStore((s) => s.plan);
  const stepIdx = useTrainStore((s) => s.stepIdx);
  const startedAt = useTrainStore((s) => s.startedAt);
  const weekDays = new Set([
    ...sessions.filter((s) => isThisWeek(s.date)).map((s) => s.date),
    ...tableSessions.filter((s) => isThisWeek(s.date)).map((s) => s.date),
  ]).size;
  const todayDone =
    sessions.some((s) => s.date === todayStr()) || tableSessions.some((s) => s.date === todayStr());
  const resumable = !!(plan && startedAt && plan.steps.length > 0 && stepIdx < plan.steps.length);
  const records = useCheckinStore((s) => s.records);
  const checkin = todayCheckin(records);
  const safety = evaluateSafety(checkin ?? {});

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-slate-50 px-5 py-8 pb-24 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <p className="text-sm text-slate-500 dark:text-slate-400">{greeting()}，今天练一点吗</p>
      <h1 className="mt-2 text-3xl font-bold">乒乓球训练伴侣</h1>

      {checkin ? (
        <div className={`mt-4 rounded-2xl p-4 ring-1 ${READY[safety.state].cls}`}>
          <p className={`font-medium ${READY[safety.state].text}`}>{READY[safety.state].label}</p>
          {safety.reasons.length > 0 && (
            <p className={`mt-1 text-sm ${READY[safety.state].text}`}>{safety.reasons.join('；')}</p>
          )}
        </div>
      ) : (
        <Link
          to="/checkin"
          className="mt-4 block rounded-2xl bg-white p-4 ring-1 ring-slate-100 active:scale-[0.98] dark:bg-slate-900 dark:ring-slate-800"
        >
          <p className="font-medium">今日还没 Check-in</p>
          <p className="mt-1 text-sm text-slate-400">20 秒判断今天能不能练、练多重 →</p>
        </Link>
      )}

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

      {resumable && plan && (
        <Link
          to="/train/run"
          className="mt-4 block rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-100 active:scale-[0.98] dark:bg-amber-950 dark:ring-amber-900"
        >
          <p className="font-medium text-amber-800 dark:text-amber-300">继续上次训练</p>
          <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
            第 {stepIdx + 1}/{plan.steps.length} 步 · 点此继续
          </p>
        </Link>
      )}

      {checkin && safety.state === 'red' ? (
        <div className="mt-6 rounded-2xl bg-red-50 p-4 text-center ring-1 ring-red-100 dark:bg-red-950 dark:ring-red-900">
          <p className="font-medium text-red-700 dark:text-red-300">今天先休息，不做训练</p>
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{safety.reasons.join('；')}</p>
        </div>
      ) : (
        <Link
          to="/train"
          className="mt-6 block h-12 rounded-xl bg-blue-600 text-center text-base font-medium leading-[48px] text-white transition active:scale-[0.98]"
        >
          开始训练 →
        </Link>
      )}
      <Link
        to="/table"
        className="mt-3 block h-12 rounded-xl bg-white text-center text-base font-medium leading-[48px] text-blue-600 ring-1 ring-blue-200 transition active:scale-[0.98] dark:bg-slate-900 dark:text-blue-400 dark:ring-blue-900"
      >
        台上训练编排 →（周末上台）
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
