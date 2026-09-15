import { useStore } from '../store';
import { compileAllShots } from '../compiler';
import { lintProject } from '../lint';

function download(filename: string, text: string, mime: string) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'storyboard';
}

export function ExportModal({ onClose }: { onClose: () => void }) {
  const { project } = useStore();

  const prompts = compileAllShots(project);
  const issues = lintProject(project);
  const base = slugify(project.name);

  const copyAll = async () => {
    const text = prompts.join('\n\n---\n\n');
    await navigator.clipboard.writeText(text);
    alert('All shot prompts copied to clipboard.');
  };

  const downloadMd = () => {
    const md = [
      `# Storyboard: ${project.name}`,
      '',
      `- Aspect ratio: \`${project.aspectRatio}\` · Quality: \`${project.videoQuality}\` · ${project.shots.length} shots · ${project.shots.reduce((s, sh) => s + sh.durationSec, 0)}s total`,
      project.continuityLock ? `- Continuity lock: ${project.continuityLock}` : '',
      '',
      ...project.shots.flatMap((shot, i) => [
        `## Shot ${shot.order}: ${shot.title || 'Untitled'}`,
        '',
        `**Template:** ${shot.template}`,
        '',
        '```',
        prompts[i],
        '```',
        '',
      ]),
    ]
      .filter((l) => l !== '')
      .join('\n');
    download(`${base}.md`, md, 'text/markdown');
  };

  const downloadJson = () => {
    download(`${base}.json`, JSON.stringify(project, null, 2), 'application/json');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <span className="panel-title">Export “{project.name}”</span>
          <button className="btn btn-mini" onClick={onClose}>✕</button>
        </div>

        {issues.length > 0 && (
          <div className="export-warn">
            <strong>{issues.length} lint {issues.length === 1 ? 'issue' : 'issues'} remain.</strong>{' '}
            Consider fixing before generating clips.
          </div>
        )}

        <div className="export-actions">
          <button className="btn" onClick={copyAll}>Copy all prompts</button>
          <button className="btn" onClick={downloadMd}>Download .md storyboard</button>
          <button className="btn" onClick={downloadJson}>Download .json project</button>
        </div>
        <p className="hint">Import a .json back via the header Import button to restore a project.</p>
      </div>
    </div>
  );
}