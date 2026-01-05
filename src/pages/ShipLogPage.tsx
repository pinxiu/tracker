import { useMemo, useState } from 'react';
import { useAppState, createId } from '../state';
import { ShipLogItem } from '../types';

export default function ShipLogPage() {
  const { state, actions } = useAppState();
  const [form, setForm] = useState<Omit<ShipLogItem, 'id'>>({
    date: new Date().toISOString().slice(0, 10),
    productId: state.products[0]?.id,
    summary: '',
    links: [''],
    metricDelta: '',
    notes: '',
  });

  const handleAdd = () => {
    const links = form.links.filter((l) => l.trim());
    if (!form.summary.trim() || links.length === 0) return;
    actions.addShip({ ...form, links, id: createId('ship') });
    setForm({ ...form, summary: '', links: [''], metricDelta: '', notes: '' });
  };

  const [productFilter, setProductFilter] = useState('all');
  const filtered = useMemo(() => {
    return state.shipLog.filter((s) => productFilter === 'all' || s.productId === productFilter);
  }, [state.shipLog, productFilter]);

  return (
    <div className="grid">
      <div className="card">
        <h2>Add Ship</h2>
        <label>Date</label>
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <label>Product</label>
        <select value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })}>
          {state.products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <label>Summary</label>
        <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
        <label>Links (one per line)</label>
        <textarea
          value={form.links.join('\n')}
          onChange={(e) => setForm({ ...form, links: e.target.value.split('\n') })}
        />
        <label>Metric delta</label>
        <input value={form.metricDelta} onChange={(e) => setForm({ ...form, metricDelta: e.target.value })} />
        <label>Notes</label>
        <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <button onClick={handleAdd}>Add</button>
      </div>
      <div className="card">
        <div className="flex section-title">
          <h2>Ship Log</h2>
          <select value={productFilter} onChange={(e) => setProductFilter(e.target.value)}>
            <option value="all">All products</option>
            {state.products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        {filtered.map((item) => (
          <div key={item.id} className="card" style={{ marginBottom: 12 }}>
            <h3>{item.summary}</h3>
            <p>
              <strong>Date:</strong> {item.date} | <strong>Product:</strong> {item.productId || 'n/a'}
            </p>
            <p>
              <strong>Links:</strong> {item.links.join(', ')}
            </p>
            {item.metricDelta && (
              <p>
                <strong>Metric delta:</strong> {item.metricDelta}
              </p>
            )}
            {item.notes && <p>{item.notes}</p>}
          </div>
        ))}
        {filtered.length === 0 && <p>No ship entries yet.</p>}
      </div>
    </div>
  );
}
