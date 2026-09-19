import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Session } from '../types';

interface SessionState {
  sessions: Session[];
  add: (s: Session) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      sessions: [],
      add: (s) => set((st) => ({ sessions: [s, ...st.sessions] })),
    }),
    { name: 'ttc:sessions', version: 1 },
  ),
);
