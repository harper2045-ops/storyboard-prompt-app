import { useState } from 'react';

export function PromptPreview({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="prompt-preview">
      <div className="panel-head">
        <span className="panel-title">Prompt</span>
        <button className="btn btn-small" onClick={copy} disabled={!prompt}>
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
      <pre className={`prompt-text${prompt ? '' : ' empty'}`}>
        {prompt || 'Compiled prompt will appear here as you type…'}
      </pre>
      <p className="hint">
        Grok Imagine prompt limit: 4,096 chars. Current: {prompt.length.toLocaleString()} chars.
      </p>
    </div>
  );
}