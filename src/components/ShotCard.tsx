import { useStore } from '../store';
import { SHOT_TEMPLATES } from '../constants';
import type { Shot } from '../types';

export function ShotCard({ shot }: { shot: Shot }) {
  const { selectedShotId, selectShot, removeShot, duplicateShot, moveShot } = useStore();
  const selected = selectedShotId === shot.id;
  const template = SHOT_TEMPLATES.find((t) => t.id === shot.template);
  const label = shot.title || `Shot ${shot.order}`;

  return (
    <div
      className={`shot-card${selected ? ' selected' : ''}`}
      onClick={() => selectShot(shot.id)}
    >
      <div className="shot-card-main">
        <span className="shot-order">{shot.order}</span>
        <div className="shot-card-text">
          <span className="shot-title">{label}</span>
          <span className="shot-meta">
            {template ? template.label : shot.template} · {shot.durationSec}s
          </span>
        </div>
      </div>
      <div className="shot-card-actions" onClick={(e) => e.stopPropagation()}>
        <button
          className="btn btn-mini"
          title="Move up"
          onClick={() => moveShot(shot.id, 'up')}
          disabled={shot.order === 1}
        >↑</button>
        <button
          className="btn btn-mini"
          title="Move down"
          onClick={() => moveShot(shot.id, 'down')}
          disabled={shot.order === useStore.getState().project.shots.length}
        >↓</button>
        <button className="btn btn-mini" title="Duplicate" onClick={() => duplicateShot(shot.id)}>⧉</button>
        <button className="btn btn-mini danger" title="Delete" onClick={() => removeShot(shot.id)}>✕</button>
      </div>
    </div>
  );
}