export default function TensionScale({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-slate-400">
        <span>0 完全松</span>
        <span>10 最大用力</span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full"
      />
      <div className="mt-1 grid grid-cols-3 text-center text-xs">
        <span className={value <= 3 ? 'font-bold text-teal-600 dark:text-teal-400' : 'text-slate-400'}>0–3 松</span>
        <span className={value >= 4 && value <= 7 ? 'font-bold text-slate-600 dark:text-slate-300' : 'text-slate-400'}>4–7 中</span>
        <span className={value >= 8 ? 'font-bold text-orange-600 dark:text-orange-400' : 'text-slate-400'}>8–10 紧</span>
      </div>
      <div className="mt-1 text-center text-2xl font-bold">{value}</div>
    </div>
  );
}
