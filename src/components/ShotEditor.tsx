import { useStore } from '../store';
import { SHOT_TEMPLATES, AUDIO_EXAMPLES, DURATION_RANGE, EXTENSION_RANGE } from '../constants';
import { TEMPLATES } from '../templates';
import type { Shot, ShotTemplateId } from '../types';

function TemplatePicker({
  value,
  onChange,
}: {
  value: ShotTemplateId;
  onChange: (v: ShotTemplateId) => void;
}) {
  const current = SHOT_TEMPLATES.find((t) => t.id === value);
  return (
    <div className="template-grid">
      {SHOT_TEMPLATES.map((t) => (
        <button
          key={t.id}
          className={`template-chip${value === t.id ? ' active' : ''}`}
          onClick={() => onChange(t.id)}
          title={t.description}
        >
          {t.label}
        </button>
      ))}
      {current && current.description && (
        <span className="template-desc">{current.description}</span>
      )}
    </div>
  );
}

export function ShotEditor({ shot }: { shot: Shot }) {
  const { updateShot, project } = useStore();

  const setTemplate = (template: ShotTemplateId) => {
    const d = TEMPLATES[template];
    updateShot(shot.id, {
      template,
      subject: d.subject,
      motion: d.motion,
      camera: d.camera,
      audio: d.audio,
      durationSec: d.durationSec,
      extras: [...d.extras],
      extension: d.extension,
    });
  };

  const isExtension = shot.template === 'extension';
  const isVideoEdit = shot.template === 'video-editing';
  const durRange = isExtension ? EXTENSION_RANGE : DURATION_RANGE;

  return (
    <div className="shot-editor">
      <TemplatePicker value={shot.template} onChange={setTemplate} />

      <div className="field">
        <label className="field-label" htmlFor={`title-${shot.id}`}>Shot title</label>
        <input
          id={`title-${shot.id}`}
          value={shot.title}
          onChange={(e) => updateShot(shot.id, { title: e.target.value })}
        />
      </div>

      <div className="field">
        <label className="field-label" htmlFor={`subject-${shot.id}`}>
          Subject
          {isVideoEdit && <em className="label-note">(edits leave subject as-is)</em>}
        </label>
        <textarea
          id={`subject-${shot.id}`}
          value={shot.subject}
          onChange={(e) => updateShot(shot.id, { subject: e.target.value })}
          placeholder="Who/what — concretely: a lone figure, a glass bottle, a presenter…"
          rows={2}
        />
      </div>

      <div className="field">
        <label className="field-label" htmlFor={`motion-${shot.id}`}>
          Motion{isExtension ? ' — new action from final frame' : isVideoEdit ? ' — imperative change' : ' — timeline order'}
        </label>
        <textarea
          id={`motion-${shot.id}`}
          value={shot.motion}
          onChange={(e) => updateShot(shot.id, { motion: e.target.value })}
          placeholder="Key action in the FIRST sentence (sequential rendering). One action per clip."
          rows={3}
        />
      </div>

      {!['extension', 'video-editing'].includes(shot.template) && (
        <>
          <div className="field">
            <label className="field-label" htmlFor={`camera-${shot.id}`}>Camera</label>
            <textarea
              id={`camera-${shot.id}`}
              value={shot.camera}
              onChange={(e) => updateShot(shot.id, { camera: e.target.value })}
              placeholder="Shot type + ONE move: locked static · slow push-in · handheld tracking shot…"
              rows={2}
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor={`audio-${shot.id}`}>Sound</label>
            <textarea
              id={`audio-${shot.id}`}
              value={shot.audio}
              onChange={(e) => updateShot(shot.id, { audio: e.target.value })}
              placeholder="Material-, spatial-specific cues…"
              rows={2}
            />
            <div className="audio-examples">
              {AUDIO_EXAMPLES.map((a) => (
                <button
                  key={a}
                  className="btn btn-mini"
                  title="Insert example"
                  onClick={() => updateShot(shot.id, { audio: a })}
                >
                  use
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor={`dur-${shot.id}`}>
            Duration (s){isExtension ? ' — extend forward' : ''}
          </label>
          <input
            id={`dur-${shot.id}`}
            type="number"
            min={durRange.min}
            max={durRange.max}
            value={shot.durationSec}
            onChange={(e) =>
              updateShot(shot.id, { durationSec: Math.max(0, Number(e.target.value) || 0) })
            }
          />
        </div>
      </div>

      {!isVideoEdit && (
        <div className="field">
          <label className="field-label">Extras</label>
          <div className="extra-list">
            {shot.extras.map((ex, i) => (
              <span key={i} className="extra-chip">
                {ex}
                <button
                  className="btn btn-mini"
                  onClick={() =>
                    updateShot(shot.id, {
                      extras: shot.extras.filter((_, j) => j !== i),
                    })
                  }
                >✕</button>
              </span>
            ))}
            <button
              className="btn btn-mini"
              onClick={() => updateShot(shot.id, { extras: [...shot.extras, ''] })}
            >+ extra</button>
          </div>
          {shot.extras.length > 0 && (
            <div className="extra-edits">
              {shot.extras.map((ex, i) => (
                <input
                  key={i}
                  value={ex}
                  placeholder={shot.template === 'talking-head' ? 'tone, e.g. serious' : 'preservation lock, e.g. sharp focus'}
                  onChange={(e) => {
                    const next = [...shot.extras];
                    next[i] = e.target.value;
                    updateShot(shot.id, { extras: next });
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {project.continuityLock.trim() !== '' && shot.order > 1 && (
        <p className="hint">
          Continuity lock active: “Keep {project.continuityLock} consistent with the reference” will be prepended.
        </p>
      )}
    </div>
  );
}