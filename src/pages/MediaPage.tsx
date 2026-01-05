import { useMemo, useState } from 'react';
import { useAppState, createId } from '../state';
import { MediaItem, MediaType } from '../types';

export default function MediaPage() {
  const { state, actions } = useAppState();
  const [form, setForm] = useState<Omit<MediaItem, 'id'>>({
    date: new Date().toISOString().slice(0, 10),
    type: 'book',
    title: '',
    authorOrChannel: '',
    link: '',
    timeSpentMinutes: 30,
    progressLabel: '',
    takeaways: ['', '', ''],
    openQuestion: '',
    appliedAction: '',
    tags: [],
    relatedProductId: '',
  });
  const [typeFilter, setTypeFilter] = useState<MediaType | 'all'>('all');
  const [tagFilter, setTagFilter] = useState('');

  const handleAdd = () => {
    if (!form.title || !form.progressLabel || !form.takeaways.every((t) => t.trim())) return;
    actions.addMedia({ ...form, id: createId('media'), tags: form.tags?.filter(Boolean) });
    setForm({
      ...form,
      title: '',
      progressLabel: '',
      takeaways: ['', '', ''],
      openQuestion: '',
      appliedAction: '',
      tags: [],
    });
  };

  const filtered = useMemo(() => {
    return state.media.filter((item) => {
      const typeOk = typeFilter === 'all' || item.type === typeFilter;
      const tagOk = !tagFilter || item.tags?.some((t) => t.toLowerCase().includes(tagFilter.toLowerCase()));
      return typeOk && tagOk;
    });
  }, [state.media, typeFilter, tagFilter]);

  return (
    <div className="grid">
      <div className="card">
        <h2>Add Media Session</h2>
        <label>Date</label>
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <label>Type</label>
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as MediaType })}>
          <option value="book">Book</option>
          <option value="video">Video</option>
        </select>
        <label>Title</label>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <label>Author/Channel</label>
        <input value={form.authorOrChannel} onChange={(e) => setForm({ ...form, authorOrChannel: e.target.value })} />
        <label>Link</label>
        <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
        <label>Time spent (minutes)</label>
        <input
          type="number"
          value={form.timeSpentMinutes}
          onChange={(e) => setForm({ ...form, timeSpentMinutes: Number(e.target.value) })}
        />
        <label>Progress label</label>
        <input value={form.progressLabel} onChange={(e) => setForm({ ...form, progressLabel: e.target.value })} />
        <label>Takeaways</label>
        {form.takeaways.map((t, idx) => (
          <input
            key={idx}
            value={t}
            placeholder={`Takeaway ${idx + 1}`}
            onChange={(e) => {
              const next = [...form.takeaways] as typeof form.takeaways;
              next[idx] = e.target.value;
              setForm({ ...form, takeaways: next });
            }}
          />
        ))}
        <label>Open question</label>
        <input value={form.openQuestion} onChange={(e) => setForm({ ...form, openQuestion: e.target.value })} />
        <label>Applied action (link)</label>
        <input value={form.appliedAction} onChange={(e) => setForm({ ...form, appliedAction: e.target.value })} />
        <label>Tags (comma separated)</label>
        <input
          value={form.tags?.join(',') || ''}
          onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
        />
        <label>Related product</label>
        <select
          value={form.relatedProductId}
          onChange={(e) => setForm({ ...form, relatedProductId: e.target.value })}
        >
          <option value="">None</option>
          {state.products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button onClick={handleAdd}>Add</button>
      </div>
      <div className="card">
        <h2>Media Log</h2>
        <div className="flex">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as MediaType | 'all')}>
            <option value="all">All</option>
            <option value="book">Book</option>
            <option value="video">Video</option>
          </select>
          <input placeholder="Filter by tag" value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} />
        </div>
        {filtered.map((m) => (
          <div key={m.id} className="card" style={{ marginBottom: 12 }}>
            <h3>
              {m.title} ({m.type})
            </h3>
            <p>
              <strong>Date:</strong> {m.date} | <strong>Progress:</strong> {m.progressLabel} | <strong>Time:</strong>{' '}
              {m.timeSpentMinutes}m
            </p>
            <p>
              <strong>Takeaways:</strong> {m.takeaways.join('; ')}
            </p>
            <p>
              <strong>Open question:</strong> {m.openQuestion}
            </p>
            <p>
              <strong>Applied action:</strong> {m.appliedAction}
            </p>
            {m.tags && m.tags.length > 0 && <p>Tags: {m.tags.join(', ')}</p>}
          </div>
        ))}
        {filtered.length === 0 && <p>No media entries yet.</p>}
      </div>
    </div>
  );
}
