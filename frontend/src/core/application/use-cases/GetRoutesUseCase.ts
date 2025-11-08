import { RouteService, RouteFilters } from '../../ports/inbound/RouteService';
import { RouteRepository } from '../../ports/outbound/RouteRepository';
import { Route } from '../../domain/entities/Route';

export class GetRoutesUseCase implements RouteService {
  constructor(private routeRepository: RouteRepository) {}

  async getRoutes(filters?: RouteFilters): Promise<Route[]> {
    return this.routeRepository.fetchRoutes(filters);
  }

  async setBaseline(routeId: string): Promise<void> {
    return this.routeRepository.setBaseline(routeId);
  }
}

