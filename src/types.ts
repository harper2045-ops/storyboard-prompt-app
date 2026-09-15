export type AspectRatio =
  | '16:9'
  | '9:16'
  | '1:1'
  | '4:3'
  | '3:4'
  | '21:9'
  | '9:21'
  | '4:5'
  | '5:4'
  | '3:2'
  | '2:3'
  | '16:10'
  | '10:16'
  | '1:1.91';

export type VideoQuality = '480p' | '720p';

export type ShotTemplateId =
  | 'camera-direction'
  | 'dialogue'
  | 'product-motion'
  | 'image-to-video'
  | 'stylized-vfx'
  | 'video-editing'
  | 'talking-head'
  | 'extension'
  | 'custom';

export interface Shot {
  id: string;
  order: number;
  title: string;
  template: ShotTemplateId;
  subject: string;
  motion: string;
  camera: string;
  audio: string;
  durationSec: number;
  extras: string[];
  extension: boolean;
}

export interface Project {
  id: string;
  name: string;
  aspectRatio: AspectRatio;
  videoQuality: VideoQuality;
  continuityLock: string;
  shots: Shot[];
}

export interface LintWarning {
  shotId: string;
  field: string;
  message: string;
  severity: 'warning' | 'error' | 'info';
  fix?: string;
}
