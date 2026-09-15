import type { ShotTemplateId } from './types';

export interface TemplateDefaults {
  subject: string;
  motion: string;
  camera: string;
  audio: string;
  durationSec: number;
  extras: string[];
  extension: boolean;
}

export const TEMPLATES: Record<ShotTemplateId, TemplateDefaults> = {
  'camera-direction': {
    subject: 'A lone figure walking down an empty rain-slicked street',
    motion: 'The figure walks steadily toward camera, reflections shifting underfoot',
    camera: 'Slow push-in, starting wide, gradually tightening on the figure',
    audio: 'soft rain on pavement, distant traffic hum, isolated footsteps echoing between buildings',
    durationSec: 10,
    extras: [],
    extension: false,
  },
  dialogue: {
    subject: 'The speaker',
    motion: '"I never thought it would end like this."',
    camera: 'Close-up, front-facing',
    audio: 'clear close dialogue, minimal room tone, soft underscore fading in',
    durationSec: 8,
    extras: ['serious'],
    extension: false,
  },
  'product-motion': {
    subject: 'A sleek glass bottle on a white marble surface',
    motion: 'Droplets of condensation form and slide down the surface, light refracting through the glass',
    camera: 'Slow orbit around the product, 360 degrees',
    audio: 'subtle condensation drip, soft ambient studio hum',
    durationSec: 8,
    extras: [],
    extension: false,
  },
  'image-to-video': {
    subject: '',
    motion: 'Gentle movement — hair shifts, background elements drift, light plays across surfaces',
    camera: 'locked, static',
    audio: 'soft ambient wind, distant environmental sounds',
    durationSec: 5,
    extras: [],
    extension: false,
  },
  'stylized-vfx': {
    subject: 'A geometric shape morphing into a flower',
    motion: 'The shape fractures, fragments reassemble into organic petals, a bloom unfolds',
    camera: 'locked, static',
    audio: 'digital crackle, soft resonant chime as the bloom completes',
    durationSec: 7,
    extras: [],
    extension: false,
  },
  'video-editing': {
    subject: '',
    motion: 'Change the background to a sunlit autumn park, warm golden-hour lighting',
    camera: '',
    audio: '',
    durationSec: 0,
    extras: ['face', 'pose', 'lighting'],
    extension: false,
  },
  'talking-head': {
    subject: 'presenter',
    motion: '"Welcome to our channel — today we are exploring something amazing."',
    camera: 'Medium close-up',
    audio: 'clear close dialogue, quiet room tone, no background music',
    durationSec: 10,
    extras: ['friendly'],
    extension: false,
  },
  extension: {
    subject: '',
    motion: 'The figure continues walking, camera follows behind as they approach a glowing doorway',
    camera: '',
    audio: 'footsteps on concrete, distant wind',
    durationSec: 5,
    extras: [],
    extension: true,
  },
  custom: {
    subject: '',
    motion: '',
    camera: '',
    audio: '',
    durationSec: 5,
    extras: [],
    extension: false,
  },
};
