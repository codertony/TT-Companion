import { create } from 'zustand';
import type { Feeling, Scene, TrainingPlan } from '../types';

interface TrainState {
  scene: Scene | null;
  durationMin: number;
  feeling: Feeling;
  plan: TrainingPlan | null;
  setScene: (s: Scene) => void;
  setDuration: (d: number) => void;
  setFeeling: (f: Feeling) => void;
  setPlan: (p: TrainingPlan | null) => void;
}

export const useTrainStore = create<TrainState>((set) => ({
  scene: null,
  durationMin: 5,
  feeling: 'normal',
  plan: null,
  setScene: (scene) => set({ scene }),
  setDuration: (durationMin) => set({ durationMin }),
  setFeeling: (feeling) => set({ feeling }),
  setPlan: (plan) => set({ plan }),
}));
