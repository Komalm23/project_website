import { RouteRepository } from '@core/ports/outbound/RouteRepository';
import { Route } from '@core/domain/entities/Route';
import { RouteFilters } from '@core/ports/inbound/RouteService';
import { prisma } from '@shared/db/prisma';

export class RouteRepositoryImpl implements RouteRepository {
  async findAll(filters?: RouteFilters): Promise<Route[]> {
    const where: any = {};
    if (filters?.vesselType) where.vesselType = filters.vesselType;
    if (filters?.fuelType) where.fuelType = filters.fuelType;
    if (filters?.year) where.year = filters.year;

    const routes = await prisma.route.findMany({ where });
    return routes.map(this.toDomain);
  }

  async findByRouteId(routeId: string): Promise<Route | null> {
    const route = await prisma.route.findUnique({ where: { routeId } });
    return route ? this.toDomain(route) : null;
  }

  async update(routeId: string, data: Partial<Route>): Promise<Route> {
    const route = await prisma.route.update({
      where: { routeId },
      data: {
        isBaseline: data.isBaseline,
        vesselType: data.vesselType,
        fuelType: data.fuelType,
        year: data.year,
        ghgIntensity: data.ghgIntensity,
        fuelConsumption: data.fuelConsumption,
        distance: data.distance,
        totalEmissions: data.totalEmissions,
      },
    });
    return this.toDomain(route);
  }

  async create(data: Route): Promise<Route> {
    const route = await prisma.route.create({
      data: {
        routeId: data.routeId,
        vesselType: data.vesselType,
        fuelType: data.fuelType,
        year: data.year,
        ghgIntensity: data.ghgIntensity,
        fuelConsumption: data.fuelConsumption,
        distance: data.distance,
        totalEmissions: data.totalEmissions,
        isBaseline: data.isBaseline,
      },
    });
    return this.toDomain(route);
  }

  private toDomain(route: any): Route {
    return {
      id: route.id,
      routeId: route.routeId,
      vesselType: route.vesselType,
      fuelType: route.fuelType,
      year: route.year,
      ghgIntensity: route.ghgIntensity,
      fuelConsumption: route.fuelConsumption,
      distance: route.distance,
      totalEmissions: route.totalEmissions,
      isBaseline: route.isBaseline,
    };
  }
}

