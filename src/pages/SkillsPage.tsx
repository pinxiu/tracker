import { useMemo, useState } from 'react';
import ProgressBar from '../components/ProgressBar';
import { useAppState } from '../state';
import { calculateSkillProgress } from '../utils/stats';

export default function SkillsPage() {
  const { state, actions } = useAppState();
  const [search, setSearch] = useState('');
  const progress = calculateSkillProgress(state);

  const filtered = useMemo(() => {
    return state.skills.filter((skill) => skill.name.toLowerCase().includes(search.toLowerCase()));
  }, [state.skills, search]);

  const tiers = useMemo(() => {
    const grouped: Record<number, typeof filtered> = {};
    filtered.forEach((skill) => {
      grouped[skill.tier] = grouped[skill.tier] || [];
      grouped[skill.tier].push(skill);
    });
    return grouped;
  }, [filtered]);

  return (
    <div className="grid">
      <div className="card">
        <h2>Skills</h2>
        <input placeholder="Search skills" value={search} onChange={(e) => setSearch(e.target.value)} />
        <ProgressBar value={progress.overall} label="Overall" />
        {Object.keys(tiers)
          .map(Number)
          .sort((a, b) => a - b)
          .map((tier) => (
            <div key={tier} className="card">
              <div className="section-title">
                <h3>Tier {tier}</h3>
                <ProgressBar
                  value={progress.perTier.find((t) => t.tier === tier)?.progress || 0}
                  label="Tier progress"
                />
              </div>
              {tiers[tier].map((skill) => (
                <div key={skill.id} className="flex" style={{ justifyContent: 'space-between' }}>
                  <label style={{ flex: 1 }}>
                    <input
                      type="checkbox"
                      checked={skill.done}
                      onChange={(e) => actions.toggleSkill(skill.id, e.target.checked)}
                    />{' '}
                    {skill.name}
                    {skill.description && <span style={{ color: '#475569', marginLeft: 6 }}>({skill.description})</span>}
                  </label>
                  <textarea
                    placeholder="Notes"
                    value={skill.notes || ''}
                    onChange={(e) => actions.toggleSkill(skill.id, skill.done, e.target.value)}
                  />
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}
