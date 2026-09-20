import { create } from 'zustand';
import { createLocalStorageRepository } from '../lib/repository';
import { genId } from '../lib/id';
import { todayStr } from '../lib/date';
import type { ReactionMode, TrainingResult } from '../types';

const repo = createLocalStorageRepository<TrainingResult>('results');

export interface NewResult {
  kind: TrainingResult['kind'];
  mode?: ReactionMode;
  metrics: Record<string, number>;
}

interface ResultsState {
  results: TrainingResult[];
  add: (r: NewResult) => void;
}

export const useResultsStore = create<ResultsState>((set) => ({
  results: repo.getAll(),
  add: (r) => {
    const item: TrainingResult = { ...r, id: genId('res'), date: todayStr(), at: Date.now() };
    repo.add(item);
    set((s) => ({ results: [item, ...s.results] }));
  },
}));
