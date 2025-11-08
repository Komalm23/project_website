import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ComparisonUseCase } from './ComparisonUseCase';
import { RouteService } from '../../ports/inbound/RouteService';
import { Route } from '../../domain/entities/Route';

describe('ComparisonUseCase', () => {
  let mockRouteService: RouteService;
  let comparisonUseCase: ComparisonUseCase;

  beforeEach(() => {
    mockRouteService = {
      getRoutes: vi.fn(),
      setBaseline: vi.fn(),
      getComparisonData: vi.fn(),
    };
    comparisonUseCase = new ComparisonUseCase(mockRouteService);
  });

  it('should compute comparison correctly', async () => {
    const baseline: Route = {
      routeId: 'R001',
      vesselType: 'Container',
      fuelType: 'HFO',
      year: 2024,
      ghgIntensity: 91.0,
      fuelConsumption: 5000,
      distance: 12000,
      totalEmissions: 4500,
      isBaseline: true,
    };

    const comparison: Route = {
      routeId: 'R002',
      vesselType: 'BulkCarrier',
      fuelType: 'LNG',
      year: 2024,
      ghgIntensity: 88.0,
      fuelConsumption: 4800,
      distance: 11500,
      totalEmissions: 4200,
      isBaseline: false,
    };

    vi.mocked(mockRouteService.getComparisonData).mockResolvedValue({
      routes: [baseline, comparison],
      baseline,
    });

    const result = await comparisonUseCase.computeComparison();

    expect(result.routes).toHaveLength(1);
    expect(result.routes[0].routeId).toBe('R002');
    expect(result.routes[0].baseline).toBe(91.0);
    expect(result.routes[0].comparison).toBe(88.0);
    expect(result.routes[0].percentDiff).toBeCloseTo(((88.0 / 91.0) - 1) * 100);
    expect(result.routes[0].compliant).toBe(true); // 88.0 < 89.3368
  });
});

