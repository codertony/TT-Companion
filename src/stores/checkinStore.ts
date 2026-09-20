import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CheckinInput, CheckinRecord } from '../types';
import { todayStr } from '../lib/date';

interface CheckinState {
  records: CheckinRecord[];
  /** 记录/覆盖今天的 Check-in */
  add: (c: CheckinInput) => void;
}

export const useCheckinStore = create<CheckinState>()(
  persist(
    (set) => ({
      records: [],
      add: (c) =>
        set((s) => {
          const today = todayStr();
          const rest = s.records.filter((r) => r.date !== today);
          return { records: [{ ...c, date: today }, ...rest] };
        }),
    }),
    { name: 'ttc:checkin', version: 1 },
  ),
);

/** 今天的 Check-in（无则 null） */
export function todayCheckin(records: CheckinRecord[]): CheckinRecord | null {
  return records.find((r) => r.date === todayStr()) ?? null;
}
