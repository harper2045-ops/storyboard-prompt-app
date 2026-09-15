import { useStore } from '../store';
import { SHOT_TEMPLATES } from '../constants';
import type { ShotTemplateId } from '../types';
import { ShotCard } from './ShotCard';

export function ShotList() {
  const { project, addShot } = useStore();

  const onAdd = (template: ShotTemplateId) => {
    addShot(template);
  };

  return (
    <aside className="shot-list">
      <div className="shot-list-head">
        <div className="shot-list-label">Shots</div>
        <select
          className="add-select"
          defaultValue=""
          aria-label="Add shot with template"
          onChange={(e) => {
            const v = e.target.value as ShotTemplateId;
            if (v) {
              onAdd(v);
              e.target.value = '';
            }
          }}
        >
          <option value="" disabled>+ Add shot…</option>
          {SHOT_TEMPLATES.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
      </div>
      {project.shots.length === 0 ? (
        <div className="empty-state">
          <p>No shots yet.</p>
          <p>Pick a template above — or start with a quick add below.</p>
          <div className="empty-actions">
            {SHOT_TEMPLATES.slice(0, 4).map((t) => (
              <button key={t.id} className="btn btn-small" onClick={() => onAdd(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="shot-cards">
          {project.shots.map((shot) => (
            <ShotCard key={shot.id} shot={shot} />
          ))}
        </div>
      )}
    </aside>
  );
}