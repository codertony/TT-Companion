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
      <div className="mt-1 text-center text-2xl font-bold">{value}</div>
    </div>
  );
}
