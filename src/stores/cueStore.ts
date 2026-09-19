import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cue, CueTag, CueType, Feedback, Skill } from '../types';
import { activateCue, archiveCue, applyFeedback as reduceFeedback, type CueCollection } from '../lib/cue';
import { genId } from '../lib/id';

interface CueDraft {
  text: string;
  skill: Skill;
  tags: CueTag[];
  type: CueType;
  priority: number;
}

interface CueState extends CueCollection {
  add: (draft: CueDraft) => string;
  activate: (id: string) => void;
  archive: (id: string) => void;
  submitFeedback: (f: Feedback) => void;
  reorder: (id: string, dir: -1 | 1) => void;
}

export const useCueStore = create<CueState>()(
  persist(
    (set) => ({
      primary: null,
      backlog: [],
      history: [],
      add: (draft) => {
        const id = genId('cue');
        set((s) => ({
          backlog: [...s.backlog, { ...draft, id, status: 'draft', doneWeeks: 0 } as Cue],
        }));
        return id;
      },
      activate: (id) => set((s) => activateCue(s, id)),
      archive: (id) => set((s) => archiveCue(s, id)),
      submitFeedback: (f) => set((s) => reduceFeedback(s, f)),
      reorder: (id, dir) =>
        set((s) => {
          const idx = s.backlog.findIndex((c) => c.id === id);
          const j = idx + dir;
          if (idx < 0 || j < 0 || j >= s.backlog.length) return s;
          const backlog = [...s.backlog];
          [backlog[idx], backlog[j]] = [backlog[j], backlog[idx]];
          return { backlog: backlog.map((c, i) => ({ ...c, priority: i + 1 })) };
        }),
    }),
    { name: 'ttc:cue', version: 1 },
  ),
);
