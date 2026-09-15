import { useState } from 'react';
import { useStore } from '../store';
import { ASPECT_RATIOS, VIDEO_QUALITIES } from '../constants';
import { ExportModal } from './ExportModal';

export function ProjectHeader() {
  const {
    project,
    setProjectName,
    setAspectRatio,
    setVideoQuality,
    setContinuityLock,
    importProject,
  } = useStore();
  const [showExport, setShowExport] = useState(false);

  const onImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then((text) => {
      try {
        const parsed = JSON.parse(text);
        if (parsed && Array.isArray(parsed.shots)) {
          importProject(parsed);
        } else {
          alert('Not a valid storyboard export (missing shots array).');
        }
      } catch {
        alert('Could not parse that file as JSON.');
      }
    });
    e.target.value = '';
  };

  const totalSec = project.shots.reduce((sum, sh) => sum + sh.durationSec, 0);

  return (
    <header className="header">
      <div className="header-row">
        <input
          className="header-name"
          value={project.name}
          onChange={(e) => setProjectName(e.target.value)}
          aria-label="Storyboard name"
        />
        <div className="header-stats">
          <span className="stat">{project.shots.length} shots</span>
          <span className="stat">{totalSec}s total</span>
        </div>
        <div className="header-actions">
          <label className="btn btn-ghost">
            Import
            <input
              type="file"
              accept="application/json,.json"
              onChange={onImportFile}
              hidden
            />
          </label>
          <button className="btn" onClick={() => setShowExport(true)}>
            Export
          </button>
        </div>
      </div>

      <div className="header-controls">
        <label className="field-inline">
          <span className="field-label">Aspect ratio</span>
          <select
            value={project.aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value as typeof project.aspectRatio)}
          >
            {ASPECT_RATIOS.map((ar) => (
              <option key={ar} value={ar}>{ar}</option>
            ))}
          </select>
        </label>
        <label className="field-inline">
          <span className="field-label">Quality</span>
          <select
            value={project.videoQuality}
            onChange={(e) => setVideoQuality(e.target.value as typeof project.videoQuality)}
          >
            {VIDEO_QUALITIES.map((q) => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </label>
        <label className="field-inline grow">
          <span className="field-label">Continuity lock</span>
          <input
            value={project.continuityLock}
            onChange={(e) => setContinuityLock(e.target.value)}
            placeholder='e.g. "her face, hair, and cloak" — applied to shots after shot 1'
          />
        </label>
      </div>

      {showExport && <ExportModal onClose={() => setShowExport(false)} />}
    </header>
  );
}