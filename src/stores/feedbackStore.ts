import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Feedback } from '../types';

interface FeedbackState {
  feedback: Feedback[];
  add: (f: Feedback) => void;
}

export const useFeedbackStore = create<FeedbackState>()(
  persist(
    (set) => ({
      feedback: [],
      add: (f) => set((s) => ({ feedback: [f, ...s.feedback] })),
    }),
    { name: 'ttc:feedback', version: 1 },
  ),
);
