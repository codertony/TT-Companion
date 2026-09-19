export type BodyPart = 'feet' | 'hip' | 'trunk' | 'arm';

const LABELS: { part: BodyPart; x: number; y: number; text: string }[] = [
  { part: 'feet', x: 8, y: 210, text: '脚' },
  { part: 'hip', x: 86, y: 124, text: '髋' },
  { part: 'trunk', x: 86, y: 74, text: '腰腹' },
  { part: 'arm', x: 100, y: 56, text: '持拍臂' },
];

export default function BodyDiagram({ active }: { active: BodyPart | null }) {
  const c = (part: BodyPart) => (active === part ? '#84cc16' : '#475569');
  return (
    <svg viewBox="0 0 140 220" className="h-52 w-auto">
      <circle cx="70" cy="18" r="12" fill="#64748b" />
      <line x1="70" y1="30" x2="70" y2="118" stroke={c('trunk')} strokeWidth="10" strokeLinecap="round" />
      <line x1="70" y1="46" x2="40" y2="82" stroke={c('arm')} strokeWidth="7" strokeLinecap="round" />
      <line x1="70" y1="46" x2="100" y2="82" stroke={c('arm')} strokeWidth="7" strokeLinecap="round" />
      <line x1="55" y1="118" x2="85" y2="118" stroke={c('hip')} strokeWidth="10" strokeLinecap="round" />
      <line x1="60" y1="118" x2="52" y2="198" stroke={c('feet')} strokeWidth="8" strokeLinecap="round" />
      <line x1="80" y1="118" x2="88" y2="198" stroke={c('feet')} strokeWidth="8" strokeLinecap="round" />
      <line x1="52" y1="198" x2="40" y2="198" stroke={c('feet')} strokeWidth="6" strokeLinecap="round" />
      <line x1="88" y1="198" x2="100" y2="198" stroke={c('feet')} strokeWidth="6" strokeLinecap="round" />
      {LABELS.map((l) => (
        <text key={l.part} x={l.x} y={l.y} fontSize="10" fill={c(l.part)}>
          {l.text}
        </text>
      ))}
    </svg>
  );
}
