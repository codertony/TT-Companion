import { Link } from 'react-router-dom';
import { useCueStore } from '../../stores/cueStore';
import { useFeedbackStore } from '../../stores/feedbackStore';

const FEEDBACK_FORM_URL =
  'https://docs.qq.com/smartsheet/form/FCXQUMPQmTKM%2Ft00i2h%2FvYHyv6?tab=t00i2h';

type ProfileLink =
  | { key: string; to: string; name: string; desc: string; dot?: boolean }
  | { key: string; href: string; name: string; desc: string; dot?: boolean };

export default function Profile() {
  const primary = useCueStore((s) => s.primary);
  const feedback = useFeedbackStore((s) => s.feedback);

  const cueDesc = !primary
    ? '先定一个最想改的毛病'
    : primary
      ? (feedback.some((f) => f.cueId === primary.id) ? '已验证，可查看结果' : '本周还没验证')
      : '';
  const cueDot = Boolean(primary && !feedback.some((f) => f.cueId === primary.id));

  const links: ProfileLink[] = [
    { key: 'cue', to: '/profile/cue', name: 'ONE CUE 管理', desc: cueDesc, dot: cueDot },
    { key: 'assess', to: '/assess', name: '评估中心', desc: '单腿稳定 / 下肢控制，找左右短板' },
    { key: 'weekend', to: '/profile/feedback', name: '周末验证', desc: '本周 Cue 有没有迁移到真实击球' },
    { key: 'feedback', href: FEEDBACK_FORM_URL, name: '意见反馈', desc: '用一分钟告诉我们哪里不好用' },
    { key: 'settings', to: '/profile/settings', name: '设置', desc: '提示参数、主题、导出与清空' },
  ];

  const itemClass =
    'flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 active:scale-[0.98] dark:bg-slate-900 dark:ring-slate-800';

  return (
    <div className="mx-auto min-h-dvh w-full max-w-md bg-slate-50 px-5 py-8 pb-24 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <h2 className="text-2xl font-semibold">我的</h2>
      <div className="mt-6 flex flex-col gap-3">
        {links.map((l) => {
          const body = (
            <>
              <span>
                <span className="block font-medium">{l.name}</span>
                <span className="mt-1 block text-sm text-slate-400 dark:text-slate-500">{l.desc}</span>
              </span>
              {l.dot && <span className="h-2 w-2 rounded-full bg-blue-500" />}
            </>
          );
          return 'href' in l ? (
            <a key={l.key} href={l.href} target="_blank" rel="noopener noreferrer" className={itemClass}>
              {body}
            </a>
          ) : (
            <Link key={l.key} to={l.to} className={itemClass}>
              {body}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
