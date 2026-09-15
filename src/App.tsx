import { useStore } from './store';
import { compileShot } from './compiler';
import { ProjectHeader } from './components/ProjectHeader';
import { ShotList } from './components/ShotList';
import { ShotEditor } from './components/ShotEditor';
import { PromptPreview } from './components/PromptPreview';
import { LintPanel } from './components/LintPanel';

export default function App() {
  const { project, selectedShotId } = useStore();
  const selected = project.shots.find((s) => s.id === selectedShotId) ?? null;
  const prompt = selected
    ? compileShot(selected, project, project.shots.findIndex((s) => s.id === selected.id))
    : '';

  return (
    <div className="app">
      <ProjectHeader />
      <main className="main">
        <ShotList />
        <section className="editor-pane">
          {selected ? (
            <>
              <div className="editor-scroll">
                <h2 className="pane-title">{selected.title || `Shot ${selected.order}`}</h2>
                <ShotEditor shot={selected} />
              </div>
              <div className="preview-pane">
                <PromptPreview prompt={prompt} />
                <LintPanel shot={selected} />
              </div>
            </>
          ) : (
            <div className="editor-empty">
              <h2>Select or add a shot</h2>
              <p>Shots you add are compiled into copy-ready Grok Imagine prompts automatically.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}