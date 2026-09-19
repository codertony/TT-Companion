export type BodyPart = 'feet' | 'hip' | 'trunk' | 'arm';

export default function BodyDiagram({ active }: { active: BodyPart | null }) {
  const c = (part: BodyPart) => (active === part ? '#84cc16' : '#94a3b8');
  return (
    <svg viewBox="0 0 120 220" className="h-52 w-auto">
      <circle cx="60" cy="20" r="12" fill="#cbd5e1" />
      <line x1="60" y1="32" x2="60" y2="120" stroke={c('trunk')} strokeWidth="10" strokeLinecap="round" />
      <line x1="60" y1="48" x2="28" y2="84" stroke={c('arm')} strokeWidth="7" strokeLinecap="round" />
      <line x1="60" y1="48" x2="92" y2="84" stroke={c('arm')} strokeWidth="7" strokeLinecap="round" />
      <line x1="45" y1="120" x2="75" y2="120" stroke={c('hip')} strokeWidth="10" strokeLinecap="round" />
      <line x1="50" y1="120" x2="42" y2="200" stroke={c('feet')} strokeWidth="8" strokeLinecap="round" />
      <line x1="70" y1="120" x2="78" y2="200" stroke={c('feet')} strokeWidth="8" strokeLinecap="round" />
      <line x1="42" y1="200" x2="32" y2="200" stroke={c('feet')} strokeWidth="6" strokeLinecap="round" />
      <line x1="78" y1="200" x2="88" y2="200" stroke={c('feet')} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}
