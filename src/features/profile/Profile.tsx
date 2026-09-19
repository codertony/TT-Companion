import { Link } from 'react-router-dom';

const links = [
  { to: '/profile/cue', name: 'ONE CUE 管理', desc: '本周唯一动作提醒 + Backlog' },
  { to: '/profile/feedback', name: '周末验证', desc: '本周 Cue 有没有迁移到真实击球' },
  { to: '/profile/settings', name: '设置', desc: '刺激参数、数据导出、清空' },
];

export default function Profile() {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-md bg-slate-50 px-5 py-8 text-slate-900">
      <h2 className="text-2xl font-semibold">我的</h2>
      <div className="mt-6 flex flex-col gap-3">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 active:scale-[0.98]">
            <p className="font-medium">{l.name}</p>
            <p className="mt-1 text-sm text-slate-400">{l.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
