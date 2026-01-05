import ProgressBar from '../components/ProgressBar';
import { useAppState } from '../state';
import { calculateMediaThisWeek, calculateSkillProgress, lastShipDate } from '../utils/stats';

export default function DashboardPage() {
  const { state } = useAppState();
  const progress = calculateSkillProgress(state);
  const mediaCount = calculateMediaThisWeek(state);
  const lastShip = lastShipDate(state);
  return (
    <div className="grid two">
      <div className="card">
        <h2>Skills Progress</h2>
        <ProgressBar value={progress.overall} label="Overall" />
        {progress.perTier
          .sort((a, b) => a.tier - b.tier)
          .map((tier) => (
            <ProgressBar key={tier.tier} value={tier.progress} label={`Tier ${tier.tier}`} />
          ))}
      </div>
      <div className="card">
        <h2>Weekly Snapshot</h2>
        <p>
          <strong>Media sessions this week:</strong> {mediaCount}
        </p>
        <p>
          <strong>Last ship date:</strong> {lastShip}
        </p>
        <p>
          <strong>Tracked products:</strong> {state.products.length}
        </p>
        <p>
          <strong>Open skills:</strong> {state.skills.filter((s) => !s.done).length}
        </p>
      </div>
      <div className="card">
        <div className="section-title">
          <h3>Recent Ship Log</h3>
        </div>
        <ul>
          {state.shipLog.slice(0, 5).map((item) => (
            <li key={item.id}>
              <strong>{item.date}:</strong> {item.summary} ({item.links.join(', ')})
            </li>
          ))}
          {state.shipLog.length === 0 && <p>No ship entries yet.</p>}
        </ul>
      </div>
      <div className="card">
        <div className="section-title">
          <h3>Active Week</h3>
        </div>
        {state.weeks.slice(0, 1).map((week) => (
          <div key={week.id}>
            <p>
              <strong>Week of:</strong> {week.weekStartDate}
            </p>
            <p>
              <strong>Flagship product:</strong> {week.flagshipProductId || 'Set one'}
            </p>
            <p>
              <strong>Ship goal:</strong> {week.shipGoal.text} {week.shipGoal.done ? '✅' : '⏳'}
            </p>
            <p>
              <strong>AI focus:</strong> {week.aiFocus.text} {week.aiFocus.done ? '✅' : '⏳'}
            </p>
            <p>
              <strong>DynamoDB/Eng focus:</strong> {week.engFocus.text} {week.engFocus.done ? '✅' : '⏳'}
            </p>
          </div>
        ))}
        {state.weeks.length === 0 && <p>No weeks tracked yet.</p>}
      </div>
    </div>
  );
}
