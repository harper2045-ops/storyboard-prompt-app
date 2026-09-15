import type { AspectRatio, VideoQuality, Project, Shot, ShotTemplateId } from './types';

export const ASPECT_RATIOS: AspectRatio[] = [
  '16:9', '9:16', '1:1', '4:3', '3:4', '21:9', '9:21',
  '4:5', '5:4', '3:2', '2:3', '16:10', '10:16', '1:1.91',
];

export const VIDEO_QUALITIES: VideoQuality[] = ['480p', '720p'];

export const DURATION_RANGE = { min: 1, max: 15 } as const;
export const EXTENSION_RANGE = { min: 2, max: 10 } as const;

export const SHOT_TEMPLATES: { id: ShotTemplateId; label: string; description: string }[] = [
  { id: 'camera-direction', label: 'Camera direction', description: 'Framing, paths, blocking, pacing, reveals' },
  { id: 'dialogue', label: 'Dialogue & performance', description: 'Speech-driven scenes with acting + ambience' },
  { id: 'product-motion', label: 'Product motion', description: 'Product stays central, realistic physics' },
  { id: 'image-to-video', label: 'Image-to-video', description: 'Animate stills preserving composition' },
  { id: 'stylized-vfx', label: 'Stylized VFX', description: 'Transformations, simulated physics, surreal motion' },
  { id: 'video-editing', label: 'Video editing', description: 'Edit existing footage, preserve continuity' },
  { id: 'talking-head', label: 'Talking head', description: 'Front-facing, mouth in frame, short lines' },
  { id: 'extension', label: 'Extension', description: 'New action from final frame, 2–10 new seconds' },
  { id: 'custom', label: 'Custom', description: 'Start from scratch' },
];

export const AUDIO_EXAMPLES = [
  'heavy rain drumming on corrugated metal awnings, low buzz of neon sign transformers, distant scooter fading away',
  'soft ambient wind, distant birds, creaking wooden floorboards underfoot',
  'mechanical clanking of gears, steady hum of ventilation, echoing footsteps on concrete',
  'crackling fireplace, muffled conversation, occasional clink of glasses',
  'rhythmic breathing, distant thunder, rain on window glass',
  'clear close dialogue, minimal room tone, no music',
];

export const DEFAULT_PROJECT = (): Project => ({
  id: 'demo',
  name: 'Untitled Storyboard',
  aspectRatio: '16:9',
  videoQuality: '720p',
  continuityLock: '',
  shots: [],
});

export const DEFAULT_SHOT = (order: number): Shot => ({
  id: `shot-${Date.now()}-${order}`,
  order,
  title: `Shot ${order}`,
  template: 'custom',
  subject: '',
  motion: '',
  camera: '',
  audio: '',
  durationSec: 5,
  extras: [],
  extension: false,
});
