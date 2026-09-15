import type { Shot, Project, LintWarning } from './types';

const VAGUE_WORDS = ['cinematic', 'epic', 'moves', 'cool', 'awesome', 'beautiful'];
const NEGATION_WORDS = ['no blur', "don't", 'without', 'no ', 'never'];

export function lintShot(shot: Shot): LintWarning[] {
  const warnings: LintWarning[] = [];

  if (!shot.subject.trim() && shot.template !== 'video-editing' && shot.template !== 'extension') {
    warnings.push({
      shotId: shot.id,
      field: 'subject',
      message: 'Subject is empty — name the visible subject concretely',
      severity: 'error',
    });
  }

  if (!shot.motion.trim() && shot.template !== 'video-editing') {
    warnings.push({
      shotId: shot.id,
      field: 'motion',
      message: 'Motion is empty — describe what moves and how',
      severity: 'warning',
    });
  }

  if (!shot.camera.trim() && !['extension', 'video-editing', 'talking-head', 'image-to-video'].includes(shot.template)) {
    warnings.push({
      shotId: shot.id,
      field: 'camera',
      message: 'Camera is empty — add shot type + one camera move',
      severity: 'info',
      fix: 'locked, static (calm) / slow push-in (tension)',
    });
  }

  if (!shot.audio.trim()) {
    warnings.push({
      shotId: shot.id,
      field: 'audio',
      message: 'No Sound line — vague or missing audio produces silent/weak audio',
      severity: 'error',
      fix: 'Add material- and spatial-specific sound cues',
    });
  }

  const motionCamera = `${shot.motion} ${shot.camera}`.toLowerCase();
  for (const word of VAGUE_WORDS) {
    if (motionCamera.includes(word)) {
      warnings.push({
        shotId: shot.id,
        field: 'motion',
        message: `"${word}" is vague — name the specific action + camera move`,
        severity: 'warning',
      });
    }
  }

  const fullText = `${shot.subject} ${shot.motion} ${shot.camera} ${shot.audio}`.toLowerCase();
  for (const neg of NEGATION_WORDS) {
    if (fullText.includes(neg)) {
      warnings.push({
        shotId: shot.id,
        field: 'motion',
        message: `Negation "${neg.trim()}" often ignored — state positively instead`,
        severity: 'warning',
        fix: 'Use "sharp focus" instead of "no blur"',
      });
    }
  }

  if (shot.motion.split(/[.!?]+/).filter((s) => s.trim()).length > 2) {
    warnings.push({
      shotId: shot.id,
      field: 'motion',
      message: 'Multiple actions detected — one action per clip avoids physics glitches',
      severity: 'warning',
      fix: 'Split into separate shots, extend forward from final frame',
    });
  }

  return warnings;
}

export function lintProject(project: Project): LintWarning[] {
  return project.shots.flatMap(lintShot);
}
