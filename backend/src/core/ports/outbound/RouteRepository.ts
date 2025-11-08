import { Route } from '../../domain/entities/Route';
import { RouteFilters } from '../inbound/RouteService';

export interface RouteRepository {
  findAll(filters?: RouteFilters): Promise<Route[]>;
  findByRouteId(routeId: string): Promise<Route | null>;
  update(routeId: string, data: Partial<Route>): Promise<Route>;
  create(data: Route): Promise<Route>;
}

