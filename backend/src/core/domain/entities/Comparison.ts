export interface ComparisonRoute {
  routeId: string;
  baseline: number;
  comparison: number;
  percentDiff: number;
  compliant: boolean;
}

export interface ComparisonData {
  routes: ComparisonRoute[];
  target: number;
}

