import { AppState } from '../types';

export function calculateSkillProgress(state: AppState) {
  const total = state.skills.length || 1;
  const done = state.skills.filter((s) => s.done).length;
  const overall = (done / total) * 100;
  const tiers: Record<number, number> = {};
  const tierTotals: Record<number, number> = {};
  state.skills.forEach((skill) => {
    tierTotals[skill.tier] = (tierTotals[skill.tier] || 0) + 1;
    if (skill.done) tiers[skill.tier] = (tiers[skill.tier] || 0) + 1;
  });
  const perTier = Object.entries(tierTotals).map(([tier, count]) => ({
    tier: Number(tier),
    progress: ((tiers[Number(tier)] || 0) / count) * 100,
  }));
  return { overall, perTier };
}

export function calculateMediaThisWeek(state: AppState) {
  const now = new Date();
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);
  return state.media.filter((m) => new Date(m.date) >= startOfWeek).length;
}

export function lastShipDate(state: AppState) {
  if (state.shipLog.length === 0) return 'N/A';
  const sorted = [...state.shipLog].sort((a, b) => b.date.localeCompare(a.date));
  return sorted[0].date;
}
