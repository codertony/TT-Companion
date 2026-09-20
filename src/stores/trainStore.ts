import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Feeling, RunEvent, RunEventType, Scene, TrainingPlan } from '../types';

interface TrainState {
  scene: Scene | null;
  durationMin: number;
  feeling: Feeling;
  plan: TrainingPlan | null;
  stepIdx: number;
  startedAt: number | null;
  events: RunEvent[];
  setScene: (s: Scene) => void;
  setDuration: (d: number) => void;
  setFeeling: (f: Feeling) => void;
  setPlan: (p: TrainingPlan | null) => void;
  setStepIdx: (i: number) => void;
  logEvent: (type: RunEventType, stepIdx: number) => void;
  resetRun: () => void;
}

export const useTrainStore = create<TrainState>()(
  persist(
    (set) => ({
      scene: null,
      durationMin: 5,
      feeling: 'normal',
      plan: null,
      stepIdx: 0,
      startedAt: null,
      events: [],
      setScene: (scene) => set({ scene }),
      setDuration: (durationMin) => set({ durationMin }),
      setFeeling: (feeling) => set({ feeling }),
      setPlan: (plan) =>
        set(
          plan === null
            ? { plan: null, stepIdx: 0, startedAt: null, events: [] }
            : { plan, stepIdx: 0, startedAt: Date.now(), events: [{ at: Date.now(), type: 'start', stepIdx: 0 }] },
        ),
      setStepIdx: (stepIdx) => set({ stepIdx }),
      logEvent: (type, stepIdx) => set((s) => ({ events: [...s.events, { at: Date.now(), type, stepIdx }] })),
      resetRun: () => set({ plan: null, stepIdx: 0, startedAt: null, events: [] }),
    }),
    {
      name: 'ttc:train',
      version: 1,
      partialize: (s) => ({
        scene: s.scene,
        durationMin: s.durationMin,
        feeling: s.feeling,
        plan: s.plan,
        stepIdx: s.stepIdx,
        startedAt: s.startedAt,
        events: s.events,
      }),
    },
  ),
);
