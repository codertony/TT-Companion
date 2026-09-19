export default function ProgressRing({
  value,
  max,
  size = 72,
  thickness = 6,
  label,
  trackColor = '#e2e8f0',
  strokeColor = '#2563eb',
  ariaLabel,
}: {
  value: number;
  max: number;
  size?: number;
  thickness?: number;
  label?: string;
  trackColor?: string;
  strokeColor?: string;
  ariaLabel?: string;
}) {
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      role="img"
      aria-label={ariaLabel ?? `进度 ${value}/${max}`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={thickness} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth={thickness}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
        {label ?? `${value}/${max}`}
      </div>
    </div>
  );
}
