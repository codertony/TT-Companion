import { Icon } from '@iconify/react';
import home from '@iconify-icons/tabler/home';
import activity from '@iconify-icons/tabler/activity';
import chartBar from '@iconify-icons/tabler/chart-bar';
import user from '@iconify-icons/tabler/user';
import train from '@iconify-icons/tabler/train';
import briefcase from '@iconify-icons/tabler/briefcase';
import pingPong from '@iconify-icons/tabler/ping-pong';

// 集中管理 App 内用到的图标（Tabler，MIT）。图标数据以对象形式传入 <Icon>，
// 构建期打入 bundle、离线可用，避免运行时联网加载。
const icons = {
  home,
  activity,
  chartBar,
  user,
  train,
  briefcase,
  pingPong,
} as const;

export type AppIconName = keyof typeof icons;

export function AppIcon({ name, className }: { name: AppIconName; className?: string }) {
  return <Icon icon={icons[name]} className={className} />;
}
