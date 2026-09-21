import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TableSession } from '../types';
import type { TableSessionPlan } from '../domain/tableSession';

interface TableState {
  sessions: TableSession[];
  plan: TableSessionPlan | null;
  setPlan: (p: TableSessionPlan | null) => void;
  add: (s: TableSession) => void;
}

export const useTableStore = create<TableState>()(
  persist(
    (set) => ({
      sessions: [],
      plan: null,
      setPlan: (plan) => set({ plan }),
      add: (s) => set((st) => ({ sessions: [s, ...st.sessions], plan: null })),
    }),
    { name: 'ttc:tableSession', version: 1, partialize: (s) => ({ sessions: s.sessions, plan: s.plan }) },
  ),
);
