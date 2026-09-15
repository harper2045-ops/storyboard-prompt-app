import type { Shot, Project } from './types';

export function compileShot(shot: Shot, project: Project, shotIndex: number): string {
  const lines: string[] = [];

  if (shotIndex > 0 && project.continuityLock.trim()) {
    lines.push(`Keep ${project.continuityLock.trim()} consistent with the reference`);
  }

  switch (shot.template) {
    case 'extension': {
      if (shot.motion) lines.push(shot.motion);
      if (shot.audio) lines.push(`Sound: ${shot.audio}`);
      lines.push(`Extend forward ${shot.durationSec} seconds`);
      break;
    }
    case 'video-editing': {
      if (shot.motion) lines.push(shot.motion);
      const keep = shot.extras.length > 0 ? shot.extras.join(' and ') : 'face, pose, and lighting';
      lines.push(`Keep ${keep} unchanged`);
      break;
    }
    case 'talking-head': {
      const shotType = shot.camera || 'Close-up';
      const subject = shot.subject || 'The subject';
      const line = shot.motion || 'Hello';
      const tone = shot.extras[0] || 'neutral';
      lines.push(
        `${shotType}, front-facing. ${subject} looks to camera and says, "${line}". Tone is ${tone}. Camera locked, static`,
      );
      if (shot.audio) lines.push(`Sound: ${shot.audio}`);
      break;
    }
    case 'image-to-video': {
      if (shot.motion) lines.push(shot.motion);
      if (shot.camera) lines.push(shot.camera);
      if (shot.audio) lines.push(`Sound: ${shot.audio}`);
      break;
    }
    default: {
      if (shot.camera) lines.push(shot.camera);
      if (shot.subject && shot.motion) {
        lines.push(`${shot.subject}, ${shot.motion}`);
      } else if (shot.subject) {
        lines.push(shot.subject);
      }
      if (shot.audio) lines.push(`Sound: ${shot.audio}`);
      break;
    }
  }

  if (shot.template !== 'video-editing') {
    lines.push(`${shot.durationSec} seconds, ${project.aspectRatio}`);
  }

  return lines.filter(Boolean).join('. ').replace(/\.\./g, '.').trim() + '.';
}

export function compileAllShots(project: Project): string[] {
  return project.shots.map((shot, i) => compileShot(shot, project, i));
}
