import { useState } from 'react';
import { useAppState } from '../state';

export default function SettingsPage() {
  const { state, actions } = useAppState();
  const basePath = import.meta.env.VITE_BASE || '/';
  const [message, setMessage] = useState('');

  const handleImport = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        actions.import(String(reader.result));
        setMessage('Imported successfully');
      } catch (e) {
        setMessage(`Failed import: ${(e as Error).message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="grid">
      <div className="card">
        <h2>Settings</h2>
        <p>
          <strong>Current base path:</strong> {basePath}
        </p>
        <p>Set VITE_BASE env (e.g. /repo-name/) for GitHub Pages deployments.</p>
        <div className="flex">
          <button onClick={() => actions.export()}>Export JSON</button>
          <label className="secondary" style={{ padding: 0 }}>
            <input type="file" accept="application/json" onChange={(e) => handleImport(e.target.files?.[0] ?? null)} />
          </label>
          <button onClick={() => actions.seed()}>Seed sample data</button>
          <button className="secondary" onClick={() => actions.reset()}>Reset</button>
        </div>
        {message && <p>{message}</p>}
      </div>
      <div className="card">
        <h3>State debug</h3>
        <pre style={{ whiteSpace: 'pre-wrap', maxHeight: 280, overflow: 'auto' }}>{JSON.stringify(state, null, 2)}</pre>
      </div>
    </div>
  );
}
