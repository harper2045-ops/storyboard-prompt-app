import { lintShot } from '../lint';
import type { Shot } from '../types';

export function LintPanel({ shot }: { shot: Shot }) {
  const warnings = lintShot(shot);

  return (
    <div className="lint-panel">
      <div className="panel-head">
        <span className="panel-title">Anti-pattern check</span>
        {warnings.length > 0 && (
          <span className="lint-count">{warnings.length} {warnings.length === 1 ? 'issue' : 'issues'}</span>
        )}
      </div>
      {warnings.length === 0 ? (
        <p className="lint-ok">No issues — prompt follows the guide.</p>
      ) : (
        <ul className="lint-list">
          {warnings.map((w, i) => (
            <li key={i} className={`lint-item ${w.severity}`}>
              <div className="lint-head">
                <span className={`lint-sev ${w.severity}`}>{w.severity}</span>
                <span className="lint-field">{w.field}</span>
              </div>
              <p>{w.message}</p>
              {w.fix && <p className="lint-fix">Fix: {w.fix}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}