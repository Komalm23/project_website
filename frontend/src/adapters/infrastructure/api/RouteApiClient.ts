import { RouteRepository } from '@core/ports/outbound/RouteRepository';
import { Route } from '@core/domain/entities/Route';
import { RouteFilters } from '@core/ports/inbound/RouteService';
import { apiRequest } from '@shared/config/api';

export class RouteApiClient implements RouteRepository {
  async fetchRoutes(filters?: RouteFilters): Promise<Route[]> {
    const params = new URLSearchParams();
    if (filters?.vesselType) params.append('vesselType', filters.vesselType);
    if (filters?.fuelType) params.append('fuelType', filters.fuelType);
    if (filters?.year) params.append('year', filters.year.toString());

    const queryString = params.toString();
    const endpoint = `/routes${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest<Route[]>(endpoint);
  }

  async setBaseline(routeId: string): Promise<void> {
    await apiRequest<void>(`/routes/${routeId}/baseline`, {
      method: 'POST',
    });
  }
}

