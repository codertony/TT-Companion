import { NavLink } from 'react-router-dom';
import { AppIcon, type AppIconName } from './AppIcon';

const tabs: { to: string; label: string; icon: AppIconName }[] = [
  { to: '/', label: '首页', icon: 'home' },
  { to: '/train', label: '训练', icon: 'activity' },
  { to: '/data', label: '数据', icon: 'chartBar' },
  { to: '/profile', label: '我的', icon: 'user' },
];

export default function TabBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 mx-auto max-w-md border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] dark:border-slate-800 dark:bg-slate-900">
      <div className="grid grid-cols-4">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.to === '/'}
            className={({ isActive }) =>
              `flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs ${
                isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
              }`
            }
          >
            <AppIcon name={t.icon} className="h-6 w-6" />
            <span>{t.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
