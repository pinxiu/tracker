# Learning Tracker

A GitHub Pages-friendly Vite + React + TypeScript app to track AI and engineering learning across skills, weekly plans, products, media, and ship logs. All data is stored locally in `localStorage` with import/export support.

## Features
- Dashboard with overall + per-tier skill progress, streak, and weekly snapshot.
- Skills checklist grouped by tier with notes and search.
- Weekly planning/review with template helper and commitments tracking.
- Ship Log with required links and product filter.
- Media log with type and tag filters (book/video), tracking takeaways, open questions, and applied actions.
- Products page to manage descriptions, status, links, KPI targets, and metric history.
- Settings for seeding data, export/import JSON backup, reset, and base path hint.
- GitHub Pages workflow with configurable base path via `VITE_BASE`.

## Getting started
```bash
npm install
npm run dev
```
Visit the printed local URL. Data persists in the browser via `localStorage` under the key `learning_tracker_v1`.

## Building
```bash
npm run build
```
Outputs to `dist/`.

## GitHub Pages deployment
1. Set repository variable `VITE_BASE` to the desired base path (e.g. `/repo-name/`). The workflow defaults to `/` if not set.
2. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and deploys to GitHub Pages.
3. If hosting under a repo path, ensure `VITE_BASE` matches that path; the app reads `import.meta.env.VITE_BASE` for router base.

## Seeding data
Open **Settings** and click **Seed sample data**. This populates:
- Four products (map/routes, secure chat, bilingual subtitles, HK admissions crawler).
- Skill tree tiers 0–7.
- A current week plan and starter ship/media entries.

## Import/Export
- **Export JSON** downloads the current state as `learning-tracker-backup.json`.
- **Import JSON** selects a backup file and loads it after a basic shape check and version match. Imports replace current data.
- **Reset** clears all data.

## Data model
See `src/types.ts` for the full type definitions used throughout the app.

## Notes
- Base path defaults to `/`. Override with `VITE_BASE=/repo-name/` when running build/preview for GitHub Pages.
- The app is mobile-friendly with a minimal CSS layout.
