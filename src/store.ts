import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { Project, Shot, ShotTemplateId, AspectRatio, VideoQuality } from './types';
import { DEFAULT_PROJECT, DEFAULT_SHOT } from './constants';
import { TEMPLATES } from './templates';

interface Store {
  project: Project;
  selectedShotId: string | null;
  setProjectName: (name: string) => void;
  setAspectRatio: (ar: AspectRatio) => void;
  setVideoQuality: (q: VideoQuality) => void;
  setContinuityLock: (lock: string) => void;
  addShot: (template?: ShotTemplateId) => string;
  removeShot: (id: string) => void;
  duplicateShot: (id: string) => string;
  moveShot: (id: string, dir: 'up' | 'down') => void;
  updateShot: (id: string, patch: Partial<Shot>) => void;
  selectShot: (id: string | null) => void;
  importProject: (project: Project) => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      project: DEFAULT_PROJECT(),
      selectedShotId: null,

      setProjectName: (name) =>
        set((s) => ({ project: { ...s.project, name } })),

      setAspectRatio: (aspectRatio) =>
        set((s) => ({ project: { ...s.project, aspectRatio } })),

      setVideoQuality: (videoQuality) =>
        set((s) => ({ project: { ...s.project, videoQuality } })),

      setContinuityLock: (continuityLock) =>
        set((s) => ({ project: { ...s.project, continuityLock } })),

      addShot: (template: ShotTemplateId = 'custom') => {
        const id = nanoid(10);
        const order = get().project.shots.length + 1;
        const defaults = TEMPLATES[template];
        const shot: Shot = {
          ...DEFAULT_SHOT(order),
          id,
          template,
          subject: defaults.subject,
          motion: defaults.motion,
          camera: defaults.camera,
          audio: defaults.audio,
          durationSec: defaults.durationSec,
          extras: [...defaults.extras],
          extension: defaults.extension,
        };
        set((s) => ({
          project: { ...s.project, shots: [...s.project.shots, shot] },
          selectedShotId: id,
        }));
        return id;
      },

      removeShot: (id) =>
        set((s) => ({
          project: { ...s.project, shots: s.project.shots.filter((sh) => sh.id !== id) },
          selectedShotId: s.selectedShotId === id ? null : s.selectedShotId,
        })),

      duplicateShot: (id) => {
        const state = get();
        const shot = state.project.shots.find((sh) => sh.id === id);
        if (!shot) return '';
        const copy = { ...shot, id: nanoid(10), title: `${shot.title} (copy)` };
        const idx = state.project.shots.findIndex((sh) => sh.id === id);
        const shots = [...state.project.shots];
        shots.splice(idx + 1, 0, copy);
        shots.forEach((sh, i) => { sh.order = i + 1; });
        set({ project: { ...state.project, shots }, selectedShotId: copy.id });
        return copy.id;
      },

      moveShot: (id, dir) => {
        const shots = [...get().project.shots];
        const idx = shots.findIndex((sh) => sh.id === id);
        if (idx < 0) return;
        const swap = dir === 'up' ? idx - 1 : idx + 1;
        if (swap < 0 || swap >= shots.length) return;
        [shots[idx], shots[swap]] = [shots[swap], shots[idx]];
        shots.forEach((sh, i) => { sh.order = i + 1; });
        set((s) => ({ project: { ...s.project, shots } }));
      },

      updateShot: (id, patch) =>
        set((s) => ({
          project: {
            ...s.project,
            shots: s.project.shots.map((sh) =>
              sh.id === id ? { ...sh, ...patch } : sh,
            ),
          },
        })),

      selectShot: (selectedShotId) => set({ selectedShotId }),

      importProject: (project) => set({ project, selectedShotId: null }),
    }),
    { name: 'storyboard-prompt-app' },
  ),
);
