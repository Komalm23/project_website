import { RouteService, RouteFilters } from '../../ports/inbound/RouteService';
import { RouteRepository } from '../../ports/outbound/RouteRepository';
import { Route } from '../../domain/entities/Route';

export class RouteUseCase implements RouteService {
  constructor(private routeRepository: RouteRepository) {}

  async getRoutes(filters?: RouteFilters): Promise<Route[]> {
    return this.routeRepository.findAll(filters);
  }

  async setBaseline(routeId: string): Promise<void> {
    // First, unset all baselines for the same year
    const route = await this.routeRepository.findByRouteId(routeId);
    if (!route) {
      throw new Error(`Route ${routeId} not found`);
    }

    // Unset all baselines for this year
    const routes = await this.routeRepository.findAll({ year: route.year });
    for (const r of routes) {
      if (r.isBaseline) {
        await this.routeRepository.update(r.routeId, { isBaseline: false });
      }
    }

    // Set this route as baseline
    await this.routeRepository.update(routeId, { isBaseline: true });
  }

  async getComparisonData(): Promise<{ routes: Route[]; baseline: Route | null }> {
    const routes = await this.routeRepository.findAll();
    const baseline = routes.find((r) => r.isBaseline) || null;
    return { routes, baseline };
  }
}

