import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings } from '../types';

const defaults: Settings = {
  reaction: { displayMs: 500, gapRange: [1000, 3000], durationSec: 30 },
  audio: { gapRange: [2000, 4000], rate: 1, repeat: 1, includeLength: false },
  mapping: { red: 'left', blue: 'right', green: 'fh', yellow: 'bh' },
  sound: true,
  theme: 'system',
};

interface SettingsState extends Settings {
  update: (partial: Partial<Settings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({ ...defaults, update: (p) => set(p) }),
    { name: 'ttc:settings', version: 1 },
  ),
);
