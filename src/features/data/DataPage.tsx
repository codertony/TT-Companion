import { useSessionStore } from '../../stores/sessionStore';
import { useCueStore } from '../../stores/cueStore';
import { isThisWeek, streakDays, toDateStr } from '../../lib/date';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 text-center ring-1 ring-slate-100">
      <p className="text-xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{label}</p>
    </div>
  );
}

export default function DataPage() {
  const sessions = useSessionStore((s) => s.sessions);
  const history = useCueStore((s) => s.history);
  const weekDone = sessions.filter((s) => isThisWeek(s.date)).length;
  const streak = streakDays(sessions.map((s) => s.date));
  const total = sessions.length;

  const bars = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { label: d.getDate(), count: sessions.filter((s) => s.date === toDateStr(d)).length };
  });
  const maxCount = Math.max(1, ...bars.map((b) => b.count));

  return (
    <div className="mx-auto min-h-dvh w-full max-w-md bg-slate-50 px-5 py-8 text-slate-900">
      <h2 className="text-2xl font-semibold">数据</h2>
      <p className="mt-1 text-sm text-slate-500">我有没有进步？</p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Stat label="本周" value={`${weekDone}/7`} />
        <Stat label="连续天数" value={`${streak}`} />
        <Stat label="累计训练" value={`${total}`} />
      </div>

      <p className="mt-8 text-sm font-medium text-slate-500">近 7 天训练</p>
      <div className="mt-3 flex items-end gap-2 rounded-2xl bg-white p-4 ring-1 ring-slate-100">
        {bars.map((b, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="w-full rounded-t bg-blue-500"
              style={{ height: `${Math.max(4, (b.count / maxCount) * 80)}px` }}
            />
            <span className="text-xs text-slate-400">{b.label}</span>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm font-medium text-slate-500">ONE CUE 完成</p>
      <p className="mt-2 text-sm text-slate-500">{history.filter((c) => c.status === 'done').length} 个已达成</p>
    </div>
  );
}
