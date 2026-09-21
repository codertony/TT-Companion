import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TableSession } from '../types';
import type { TableSessionPlan } from '../domain/tableSession';

interface TableState {
  sessions: TableSession[];
  plan: TableSessionPlan | null;
  idx: number;
  setPlan: (p: TableSessionPlan | null) => void;
  setIdx: (i: number) => void;
  add: (s: TableSession) => void;
}

export const useTableStore = create<TableState>()(
  persist(
    (set) => ({
      sessions: [],
      plan: null,
      idx: 0,
      setPlan: (plan) => set({ plan, idx: 0 }),
      setIdx: (idx) => set({ idx }),
      add: (s) => set((st) => ({ sessions: [s, ...st.sessions], plan: null, idx: 0 })),
    }),
    { name: 'ttc:tableSession', version: 1, partialize: (s) => ({ sessions: s.sessions, plan: s.plan, idx: s.idx }) },
  ),
);
