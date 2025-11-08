import { Route } from '../../domain/entities/Route';
import { RouteFilters } from '../inbound/RouteService';

export interface RouteRepository {
  fetchRoutes(filters?: RouteFilters): Promise<Route[]>;
  setBaseline(routeId: string): Promise<void>;
}

