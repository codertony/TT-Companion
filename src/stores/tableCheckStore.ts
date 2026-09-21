import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SelfCheckRecord } from '../types';
import { genId } from '../lib/id';
import { todayStr } from '../lib/date';

interface TableCheckState {
  records: SelfCheckRecord[];
  add: (r: Omit<SelfCheckRecord, 'id' | 'date'>) => void;
}

export const useTableCheckStore = create<TableCheckState>()(
  persist(
    (set) => ({
      records: [],
      add: (r) =>
        set((s) => ({ records: [{ ...r, id: genId('chk'), date: todayStr() }, ...s.records] })),
    }),
    { name: 'ttc:tableCheck', version: 1 },
  ),
);
