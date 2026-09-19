import { Link } from 'react-router-dom';

export default function PageHeader({
  title,
  to = '/',
  backLabel = '返回',
}: {
  title: string;
  to?: string;
  backLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <Link
        to={to}
        className="inline-flex h-12 items-center px-2 text-sm text-slate-400 dark:text-slate-500"
      >
        {backLabel}
      </Link>
    </div>
  );
}
