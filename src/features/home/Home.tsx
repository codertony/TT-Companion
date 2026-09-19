export default function Home() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-slate-50 px-5 py-8 text-slate-900">
      <p className="text-sm text-slate-500">下午好，今天练一点吗</p>
      <h1 className="mt-2 text-3xl font-bold">离台训练伴侣</h1>

      <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <p className="text-xs text-slate-400">本周 ONE CUE</p>
        <p className="mt-1 text-2xl font-semibold">身体先走，手不要抢</p>
        <p className="mt-2 text-sm text-slate-400">本周所有影子训练只关注这一点</p>
      </div>

      <button
        type="button"
        className="mt-6 h-12 w-full rounded-xl bg-blue-600 text-base font-medium text-white transition active:scale-[0.98]"
      >
        开始训练 →
      </button>

      <p className="mt-6 text-center text-xs text-slate-400">
        感知 · 发力 · 反应 · 预判 · 整合
      </p>
    </div>
  );
}
