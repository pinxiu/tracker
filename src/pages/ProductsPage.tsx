import { useMemo, useState } from 'react';
import { useAppState, createId } from '../state';
import { Product } from '../types';

function kpiToText(kpis: Record<string, string>) {
  return Object.entries(kpis)
    .map(([k, v]) => `${k}:${v}`)
    .join('\n');
}

function textToKpi(text: string) {
  const entries = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(':'))
    .filter((pair) => pair.length >= 2)
    .map(([k, ...rest]) => [k.trim(), rest.join(':').trim()]);
  return Object.fromEntries(entries);
}

export default function ProductsPage() {
  const { state, actions } = useAppState();
  const [form, setForm] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    status: 'secondary',
    links: {},
    kpis: {},
    kpiHistory: [],
  });

  const handleAdd = () => {
    if (!form.name.trim()) return;
    actions.addProduct({ ...form, id: createId('prod') });
    setForm({ name: '', description: '', status: 'secondary', links: {}, kpis: {}, kpiHistory: [] });
  };

  const statuses = useMemo(() => ['flagship', 'secondary', 'background'], []);

  return (
    <div className="grid">
      <div className="card">
        <h2>Add Product</h2>
        <label>Name</label>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <label>Description</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <label>Status</label>
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Product['status'] })}>
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <label>Repo Link</label>
        <input value={form.links.repo || ''} onChange={(e) => setForm({ ...form, links: { ...form.links, repo: e.target.value } })} />
        <label>Demo Link</label>
        <input value={form.links.demo || ''} onChange={(e) => setForm({ ...form, links: { ...form.links, demo: e.target.value } })} />
        <label>KPI targets (one per line, key:value)</label>
        <textarea value={kpiToText(form.kpis)} onChange={(e) => setForm({ ...form, kpis: textToKpi(e.target.value) })} />
        <button onClick={handleAdd}>Add Product</button>
      </div>
      <div className="card">
        <h2>Products</h2>
        <div className="grid two">
          {state.products.map((prod) => (
            <ProductCard key={prod.id} product={prod} onSave={actions.updateProduct} statuses={statuses} />
          ))}
          {state.products.length === 0 && <p>No products yet.</p>}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, onSave, statuses }: { product: Product; onSave: (p: Product) => void; statuses: string[] }) {
  const [draft, setDraft] = useState<Product>(product);
  const save = () => onSave(draft);
  return (
    <div className="card" style={{ marginBottom: 0 }}>
      <h3>{draft.name}</h3>
      <label>Description</label>
      <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
      <label>Status</label>
      <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as Product['status'] })}>
        {statuses.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <label>Repo</label>
      <input value={draft.links.repo || ''} onChange={(e) => setDraft({ ...draft, links: { ...draft.links, repo: e.target.value } })} />
      <label>Demo</label>
      <input value={draft.links.demo || ''} onChange={(e) => setDraft({ ...draft, links: { ...draft.links, demo: e.target.value } })} />
      <label>KPI targets (key:value per line)</label>
      <textarea value={kpiToText(draft.kpis)} onChange={(e) => setDraft({ ...draft, kpis: textToKpi(e.target.value) })} />
      <button onClick={save}>Save</button>
    </div>
  );
}
