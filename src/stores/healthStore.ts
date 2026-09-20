import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { todayStr } from '../lib/date';

export interface HealthRecord {
  date: string;
  height?: number; // cm
  weight?: number; // kg
  restingHr?: number; // bpm（静息心率，早晨起床前测）
}

interface HealthState {
  records: HealthRecord[];
  record: (r: Omit<HealthRecord, 'date'>) => void;
}

export const useHealthStore = create<HealthState>()(
  persist(
    (set) => ({
      records: [],
      record: (r) =>
        set((s) => {
          const today = todayStr();
          const rest = s.records.filter((x) => x.date !== today);
          return { records: [...rest, { ...r, date: today }] };
        }),
    }),
    { name: 'ttc:health', version: 1 },
  ),
);

export function latestHealth(records: HealthRecord[]): HealthRecord | null {
  return records.length ? records[records.length - 1] : null;
}
