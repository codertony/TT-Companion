import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AssessmentResult } from '../types';
import { genId } from '../lib/id';
import { todayStr } from '../lib/date';

interface AssessmentState {
  results: AssessmentResult[];
  record: (r: Omit<AssessmentResult, 'id' | 'date'>) => void;
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set) => ({
      results: [],
      record: (r) =>
        set((s) => ({ results: [...s.results, { ...r, id: genId('ass'), date: todayStr() }] })),
    }),
    { name: 'ttc:assessments', version: 1 },
  ),
);
