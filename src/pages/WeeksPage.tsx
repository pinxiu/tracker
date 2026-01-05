import { useState } from 'react';
import { useAppState, createId } from '../state';
import { WeekPlan } from '../types';

const reviewTemplate = `What shipped?\nWhat broke?\nWhat I learned?\nOne thing for next week:`;

export default function WeeksPage() {
  const { state, actions } = useAppState();
  const [form, setForm] = useState<WeekPlan>({
    id: '',
    weekStartDate: new Date().toISOString().slice(0, 10),
    flagshipProductId: state.products[0]?.id,
    shipGoal: { text: '', link: '', done: false },
    aiFocus: { text: '', done: false },
    engFocus: { text: '', done: false },
    mediaGoal: { text: '', done: false },
    metricsMoved: [],
    reviewText: '',
  });

  const addWeek = () => {
    if (!form.weekStartDate) return;
    actions.addWeek({ ...form, id: createId('week') });
  };

  return (
    <div className="grid">
      <div className="card">
        <h2>Create Week</h2>
        <label>Week start date</label>
        <input type="date" value={form.weekStartDate} onChange={(e) => setForm({ ...form, weekStartDate: e.target.value })} />
        <label>Flagship product</label>
        <select
          value={form.flagshipProductId}
          onChange={(e) => setForm({ ...form, flagshipProductId: e.target.value })}
        >
          <option value="">Select</option>
          {state.products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <GoalEditor label="Ship goal" value={form.shipGoal} onChange={(val) => setForm({ ...form, shipGoal: val })} />
        <GoalEditor label="AI focus" value={form.aiFocus} onChange={(val) => setForm({ ...form, aiFocus: val })} />
        <GoalEditor label="DynamoDB/Engineering focus" value={form.engFocus} onChange={(val) => setForm({ ...form, engFocus: val })} />
        <GoalEditor label="Media goal" value={form.mediaGoal} onChange={(val) => setForm({ ...form, mediaGoal: val })} />
        <label>Review</label>
        <textarea value={form.reviewText} onChange={(e) => setForm({ ...form, reviewText: e.target.value })} />
        <button className="secondary" onClick={() => setForm({ ...form, reviewText: reviewTemplate })}>
          Generate review template
        </button>{' '}
        <button onClick={addWeek}>Add Week</button>
      </div>
      <div className="card">
        <h2>Weeks</h2>
        {state.weeks.map((week) => (
          <WeekCard key={week.id} week={week} onSave={actions.updateWeek} products={state.products} />
        ))}
        {state.weeks.length === 0 && <p>No weeks yet.</p>}
      </div>
    </div>
  );
}

function GoalEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: WeekPlan['shipGoal'];
  onChange: (v: WeekPlan['shipGoal']) => void;
}) {
  return (
    <div>
      <label>{label}</label>
      <input value={value.text} onChange={(e) => onChange({ ...value, text: e.target.value })} />
      <input placeholder="Link" value={value.link || ''} onChange={(e) => onChange({ ...value, link: e.target.value })} />
      <label>
        <input type="checkbox" checked={value.done} onChange={(e) => onChange({ ...value, done: e.target.checked })} /> Done
      </label>
    </div>
  );
}

function WeekCard({ week, onSave, products }: { week: WeekPlan; onSave: (w: WeekPlan) => void; products: { id: string; name: string }[] }) {
  const [draft, setDraft] = useState<WeekPlan>(week);
  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <h3>Week of {draft.weekStartDate}</h3>
      <label>Flagship</label>
      <select value={draft.flagshipProductId} onChange={(e) => setDraft({ ...draft, flagshipProductId: e.target.value })}>
        <option value="">Select</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <GoalEditor label="Ship goal" value={draft.shipGoal} onChange={(val) => setDraft({ ...draft, shipGoal: val })} />
      <GoalEditor label="AI focus" value={draft.aiFocus} onChange={(val) => setDraft({ ...draft, aiFocus: val })} />
      <GoalEditor label="Eng focus" value={draft.engFocus} onChange={(val) => setDraft({ ...draft, engFocus: val })} />
      <GoalEditor label="Media goal" value={draft.mediaGoal} onChange={(val) => setDraft({ ...draft, mediaGoal: val })} />
      <label>Metrics moved (comma separated key=before->after)</label>
      <textarea
        value={draft.metricsMoved
          .map((m) => `${m.metricName}:${m.before ?? ''}->${m.after ?? ''}${m.note ? ` (${m.note})` : ''}`)
          .join('\n')}
        onChange={(e) =>
          setDraft({
            ...draft,
            metricsMoved: e.target.value
              .split('\n')
              .filter(Boolean)
              .map((line) => {
                const [metricName, rest] = line.split(':');
                const [beforeAfter, note] = rest?.split('(') ?? [];
                const [before, after] = (beforeAfter || '').split('->');
                return { metricName, before, after, note: note ? note.replace(')', '') : undefined };
              }),
          })
        }
      />
      <label>Review</label>
      <textarea value={draft.reviewText} onChange={(e) => setDraft({ ...draft, reviewText: e.target.value })} />
      <button className="secondary" onClick={() => setDraft({ ...draft, reviewText: reviewTemplate })}>
        Insert template
      </button>{' '}
      <button onClick={() => onSave(draft)}>Save</button>
    </div>
  );
}
