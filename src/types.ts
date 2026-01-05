export type ProductStatus = 'flagship' | 'secondary' | 'background';

export interface ProductLink {
  repo?: string;
  demo?: string;
  docs?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  status: ProductStatus;
  links: ProductLink;
  kpis: Record<string, string>;
  kpiHistory: Array<{ date: string; metrics: Record<string, number | string> }>;
}

export interface Skill {
  id: string;
  tier: number;
  name: string;
  description?: string;
  tags?: string[];
  done: boolean;
  notes?: string;
}

export type MediaType = 'book' | 'video';

export interface MediaItem {
  id: string;
  date: string;
  type: MediaType;
  title: string;
  authorOrChannel?: string;
  link?: string;
  timeSpentMinutes: number;
  progressLabel: string;
  takeaways: [string, string, string];
  openQuestion: string;
  appliedAction: string;
  tags?: string[];
  relatedProductId?: string;
}

export interface WeekPlanItem {
  text: string;
  link?: string;
  done: boolean;
}

export interface WeekPlan {
  id: string;
  weekStartDate: string;
  flagshipProductId?: string;
  shipGoal: WeekPlanItem;
  aiFocus: WeekPlanItem;
  engFocus: WeekPlanItem;
  mediaGoal: WeekPlanItem;
  metricsMoved: Array<{ metricName: string; before?: string | number; after?: string | number; note?: string }>;
  reviewText: string;
}

export interface ShipLogItem {
  id: string;
  date: string;
  productId?: string;
  summary: string;
  links: string[];
  metricDelta?: string;
  notes?: string;
}

export interface AppState {
  version: string;
  products: Product[];
  skills: Skill[];
  media: MediaItem[];
  weeks: WeekPlan[];
  shipLog: ShipLogItem[];
  lastActivityDate?: string;
  streak: number;
}
