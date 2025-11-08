import { Route } from '../../domain/entities/Route';

export interface RouteFilters {
  vesselType?: string;
  fuelType?: string;
  year?: number;
}

export interface RouteService {
  getRoutes(filters?: RouteFilters): Promise<Route[]>;
  setBaseline(routeId: string): Promise<void>;
  getComparisonData(): Promise<{ routes: Route[]; baseline: Route | null }>;
}

