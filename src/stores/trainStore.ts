import { create } from 'zustand';
import type { Scene, TrainingPlan } from '../types';

interface TrainState {
  scene: Scene | null;
  durationMin: number;
  plan: TrainingPlan | null;
  setScene: (s: Scene) => void;
  setDuration: (d: number) => void;
  setPlan: (p: TrainingPlan | null) => void;
}

export const useTrainStore = create<TrainState>((set) => ({
  scene: null,
  durationMin: 5,
  plan: null,
  setScene: (scene) => set({ scene }),
  setDuration: (durationMin) => set({ durationMin }),
  setPlan: (plan) => set({ plan }),
}));
