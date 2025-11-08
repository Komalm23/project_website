export interface ComparisonRoute {
  routeId: string;
  baseline: number; // gCO₂e/MJ
  comparison: number; // gCO₂e/MJ
  percentDiff: number;
  compliant: boolean;
}

export interface ComparisonRouteResponse {
  routeId: string;
  baseline: number; // gCO₂e/MJ
  comparison: number; // gCO₂e/MJ
}

export interface ComparisonData {
  routes: ComparisonRoute[];
  target: number; // 89.3368 gCO₂e/MJ
}

export interface ComparisonDataResponse {
  routes: ComparisonRouteResponse[];
}

