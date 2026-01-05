import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { AppState, MediaItem, Product, ShipLogItem, Skill, WeekPlan } from './types';
import { exportState, importState as parseImport, loadState, saveState } from './storage';

const VERSION = '1.0.0';

const initialState: AppState = {
  version: VERSION,
  products: [],
  skills: [],
  media: [],
  weeks: [],
  shipLog: [],
  streak: 0,
};

function normalizeDate(date: string) {
  return date.slice(0, 10);
}

function applyActivity(state: AppState, activityDate: string) {
  const normalized = normalizeDate(activityDate);
  if (!state.lastActivityDate) {
    return { ...state, lastActivityDate: normalized, streak: 1 };
  }
  const last = new Date(state.lastActivityDate);
  const current = new Date(normalized);
  const diff = Math.floor((current.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return { ...state, lastActivityDate: normalized };
  if (diff === 1) return { ...state, lastActivityDate: normalized, streak: state.streak + 1 };
  return { ...state, lastActivityDate: normalized, streak: 1 };
}

function getMostRecentMonday() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  now.setDate(diff);
  return now.toISOString().slice(0, 10);
}

function createSeedState(): AppState {
  const products: Product[] = [
    {
      id: 'prod-map',
      name: 'China Missionary Legacy Sites Map & Routes',
      description: 'Map + site database + route planning for historical sites.',
      status: 'flagship',
      links: { repo: 'https://github.com/example/map-routes', demo: 'https://demo.example.com/map' },
      kpis: { 'Site coverage %': 'Initial 10 cities', 'Route usability score': 'Prototype' },
      kpiHistory: [],
    },
    {
      id: 'prod-chat',
      name: 'E2E Encrypted Chat with media performance',
      description: 'Secure chat with better image/video loading UX and caching.',
      status: 'secondary',
      links: { repo: 'https://github.com/example/secure-chat' },
      kpis: { 'Image load p95 (ms)': '<800', 'Video buffering incidents/week': '<5' },
      kpiHistory: [],
    },
    {
      id: 'prod-subtitles',
      name: 'Bilingual Subtitle Webapp',
      description: 'Drag/drop video to create perfectly aligned bilingual subtitles.',
      status: 'secondary',
      links: { repo: 'https://github.com/example/bilingual-subtitles' },
      kpis: { 'Alignment accuracy %': '>=95%', 'Turnaround time': '<5 min' },
      kpiHistory: [],
    },
    {
      id: 'prod-crawler',
      name: 'HK Admissions Crawler',
      description: 'Extract full program application details with evaluation and citations.',
      status: 'background',
      links: { repo: 'https://github.com/example/hk-admissions' },
      kpis: { 'Crawler completeness %': '>=90%', 'Citation correctness %': '>=98%' },
      kpiHistory: [],
    },
  ];

  const skills: Skill[] = [
    { tier: 0, name: 'Problem solving / debugging / tradeoffs', id: 's-problem', done: false },
    { tier: 0, name: 'Communication (specs, docs, decision logs)', id: 's-communication', done: false },
    { tier: 0, name: 'Software engineering craft', id: 's-craft', done: false, description: 'testing, code review, refactoring, architecture' },
    { tier: 0, name: 'SQL + data literacy', id: 's-sql', done: false },
    { tier: 1, name: 'AI tools in dev workflows', id: 's-ai-tools', done: false },
    { tier: 1, name: 'LLM basics', id: 's-llm', done: false, description: 'tokens, context, temperature, failure modes' },
    { tier: 1, name: 'Embeddings + vector search basics', id: 's-embeddings', done: false },
    { tier: 1, name: 'Prompting/context engineering + structured outputs', id: 's-prompting', done: false },
    { tier: 2, name: 'RAG (ingestion, chunking, retrieval, citations/grounding)', id: 's-rag', done: false },
    { tier: 2, name: 'Structured extraction pipelines', id: 's-extraction', done: false },
    { tier: 2, name: 'Evaluation/testing for AI systems', id: 's-eval', done: false },
    { tier: 2, name: 'Agent/tool workflows', id: 's-agent', done: false },
    { tier: 2, name: 'LLMOps basics', id: 's-llmops', done: false },
    { tier: 3, name: 'Data modeling + data quality', id: 's-data-modeling', done: false },
    { tier: 3, name: 'ETL/ELT pipelines + schedulers + idempotency', id: 's-etl', done: false },
    { tier: 3, name: 'Search systems', id: 's-search', done: false, description: 'hybrid search, ranking basics, caching' },
    { tier: 4, name: 'Cloud fundamentals', id: 's-cloud', done: false, description: 'IAM, networking, storage, compute' },
    { tier: 4, name: 'API design', id: 's-api', done: false, description: 'auth, pagination, rate limits' },
    { tier: 4, name: 'Serverless + containers deployments', id: 's-serverless', done: false },
    { tier: 4, name: 'DynamoDB mastery', id: 's-dynamo', done: false, description: 'single-table, access patterns, GSIs, TTL, streams, conditional writes, cost' },
    { tier: 5, name: 'OWASP basics, threat modeling, secrets mgmt', id: 's-owasp', done: false },
    { tier: 5, name: 'Crypto literacy', id: 's-crypto', done: false, description: 'use proven protocols, do not invent crypto' },
    { tier: 5, name: 'Privacy/compliance thinking', id: 's-privacy', done: false },
    { tier: 6, name: 'Observability', id: 's-obs', done: false, description: 'logs/metrics/traces, incident thinking' },
    { tier: 6, name: 'Performance engineering', id: 's-perf', done: false, description: 'caching, async, load testing' },
    { tier: 6, name: 'Media performance', id: 's-media-perf', done: false, description: 'progressive images, video loading, offline cache, retries' },
    { tier: 7, name: 'Human-in-the-loop UX', id: 's-hitl', done: false, description: 'review queues, evidence, editable outputs' },
    { tier: 7, name: 'Modern web UX', id: 's-web-ux', done: false, description: 'drag/drop, i18n, a11y, fast UI' },
    { tier: 7, name: 'Maps/routing product skills', id: 's-maps', done: false, description: 'geospatial data, routing, offline patterns' },
  ];

  const monday = getMostRecentMonday();

  const weeks: WeekPlan[] = [
    {
      id: 'week-1',
      weekStartDate: monday,
      flagshipProductId: 'prod-map',
      shipGoal: { text: 'Ship map data upload MVP', link: '', done: false },
      aiFocus: { text: 'RAG fundamentals', done: false },
      engFocus: { text: 'DynamoDB single-table design basics', done: false },
      mediaGoal: { text: 'Watch 1 vector search talk', done: false },
      metricsMoved: [],
      reviewText: '',
    },
  ];

  const today = new Date().toISOString().slice(0, 10);

  const shipLog: ShipLogItem[] = [
    {
      id: 'ship-1',
      date: today,
      productId: 'prod-map',
      summary: 'Uploaded initial site dataset and basic map view',
      links: ['https://demo.example.com/map/v1'],
      metricDelta: 'Site coverage +5',
    },
    {
      id: 'ship-2',
      date: today,
      productId: 'prod-chat',
      summary: 'Improved media caching for chat images',
      links: ['https://repo.example.com/commit/123'],
      metricDelta: 'Image p95 -120ms',
    },
  ];

  const media: MediaItem[] = [
    {
      id: 'media-1',
      date: today,
      type: 'book',
      title: 'Designing Data-Intensive Applications',
      authorOrChannel: 'Martin Kleppmann',
      progressLabel: 'pp 1-20',
      timeSpentMinutes: 45,
      takeaways: ['Replication vs partitioning basics', 'Importance of schemas', 'Tradeoffs in storage engines'],
      openQuestion: 'How to map DynamoDB to these patterns?',
      appliedAction: 'Wrote notes in repo',
      tags: ['data', 'backend'],
      relatedProductId: 'prod-crawler',
    },
    {
      id: 'media-2',
      date: today,
      type: 'video',
      title: 'Vector search primer',
      authorOrChannel: 'Conference Talk',
      progressLabel: '15/30 min',
      timeSpentMinutes: 30,
      takeaways: ['Chunking importance', 'Embedding quality matters', 'Grounding via citations'],
      openQuestion: 'Best eval metrics for retrieval?',
      appliedAction: 'Planned eval set for subtitles app',
      tags: ['AI', 'RAG'],
      relatedProductId: 'prod-subtitles',
    },
  ];

  return {
    version: VERSION,
    products,
    skills,
    media,
    weeks,
    shipLog,
    streak: 1,
    lastActivityDate: today,
  };
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
  actions: ReturnType<typeof createActions>;
} | null>(null);

type Action =
  | { type: 'load'; payload: AppState }
  | { type: 'seed' }
  | { type: 'addProduct'; payload: Product }
  | { type: 'updateProduct'; payload: Product }
  | { type: 'toggleSkill'; payload: { id: string; done: boolean; notes?: string } }
  | { type: 'updateSkill'; payload: Skill }
  | { type: 'addMedia'; payload: MediaItem }
  | { type: 'updateMedia'; payload: MediaItem }
  | { type: 'addWeek'; payload: WeekPlan }
  | { type: 'updateWeek'; payload: WeekPlan }
  | { type: 'addShip'; payload: ShipLogItem }
  | { type: 'updateShip'; payload: ShipLogItem }
  | { type: 'reset' }
  | { type: 'import'; payload: AppState };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'load':
      return action.payload;
    case 'seed':
      return createSeedState();
    case 'reset':
      return { ...initialState };
    case 'import':
      return action.payload;
    case 'addProduct':
      return { ...state, products: [...state.products, action.payload] };
    case 'updateProduct':
      return { ...state, products: state.products.map((p) => (p.id === action.payload.id ? action.payload : p)) };
    case 'toggleSkill': {
      const skills = state.skills.map((s) =>
        s.id === action.payload.id ? { ...s, done: action.payload.done, notes: action.payload.notes ?? s.notes } : s
      );
      const updated = { ...state, skills };
      return action.payload.done ? applyActivity(updated, new Date().toISOString()) : updated;
    }
    case 'updateSkill':
      return { ...state, skills: state.skills.map((s) => (s.id === action.payload.id ? action.payload : s)) };
    case 'addMedia':
      return applyActivity({ ...state, media: [action.payload, ...state.media] }, action.payload.date);
    case 'updateMedia':
      return { ...state, media: state.media.map((m) => (m.id === action.payload.id ? action.payload : m)) };
    case 'addWeek':
      return applyActivity({ ...state, weeks: [action.payload, ...state.weeks] }, new Date().toISOString());
    case 'updateWeek':
      return applyActivity({ ...state, weeks: state.weeks.map((w) => (w.id === action.payload.id ? action.payload : w)) }, new Date().toISOString());
    case 'addShip':
      return applyActivity({ ...state, shipLog: [action.payload, ...state.shipLog] }, action.payload.date);
    case 'updateShip':
      return { ...state, shipLog: state.shipLog.map((s) => (s.id === action.payload.id ? action.payload : s)) };
    default:
      return state;
  }
}

function createActions(dispatch: React.Dispatch<Action>, state: AppState) {
  return {
    seed: () => dispatch({ type: 'seed' }),
    reset: () => dispatch({ type: 'reset' }),
    addProduct: (product: Product) => dispatch({ type: 'addProduct', payload: product }),
    updateProduct: (product: Product) => dispatch({ type: 'updateProduct', payload: product }),
    toggleSkill: (id: string, done: boolean, notes?: string) => dispatch({ type: 'toggleSkill', payload: { id, done, notes } }),
    updateSkill: (skill: Skill) => dispatch({ type: 'updateSkill', payload: skill }),
    addMedia: (media: MediaItem) => dispatch({ type: 'addMedia', payload: media }),
    updateMedia: (media: MediaItem) => dispatch({ type: 'updateMedia', payload: media }),
    addWeek: (week: WeekPlan) => dispatch({ type: 'addWeek', payload: week }),
    updateWeek: (week: WeekPlan) => dispatch({ type: 'updateWeek', payload: week }),
    addShip: (ship: ShipLogItem) => dispatch({ type: 'addShip', payload: ship }),
    updateShip: (ship: ShipLogItem) => dispatch({ type: 'updateShip', payload: ship }),
    export: () => exportState(state),
    import: (text: string) => dispatch({ type: 'import', payload: parseImport(text, state) }),
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [initialized, setInitialized] = React.useState(false);

  useEffect(() => {
    const loaded = loadState({ ...initialState, version: VERSION });
    dispatch({ type: 'load', payload: loaded });
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized && state.version) {
      saveState(state);
    }
  }, [state, initialized]);

  const actions = useMemo(() => createActions(dispatch, state), [dispatch, state]);

  return <AppContext.Provider value={{ state, dispatch, actions }}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('AppState missing provider');
  return ctx;
}

export function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}
