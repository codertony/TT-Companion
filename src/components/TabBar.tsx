import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/', label: '首页', icon: '🏠' },
  { to: '/train', label: '训练', icon: '⚡' },
  { to: '/data', label: '数据', icon: '📊' },
  { to: '/profile', label: '我的', icon: '👤' },
];

export default function TabBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 mx-auto max-w-md border-t border-slate-200 bg-white">
      <div className="grid grid-cols-4">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2 text-xs ${
                isActive ? 'text-blue-600' : 'text-slate-400'
              }`
            }
          >
            <span className="text-lg leading-none">{t.icon}</span>
            <span>{t.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
