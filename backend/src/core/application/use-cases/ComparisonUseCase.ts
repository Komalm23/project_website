import { ComparisonRoute, ComparisonData } from '../../domain/entities/Comparison';
import { ComplianceCalculator } from '../../domain/services/ComplianceCalculator';
import { RouteService } from '../../ports/inbound/RouteService';

const TARGET_INTENSITY = 89.3368; // gCO₂e/MJ

export class ComparisonUseCase {
  constructor(private routeService: RouteService) {}

  async computeComparison(): Promise<ComparisonData> {
    const { routes, baseline } = await this.routeService.getComparisonData();

    if (!baseline) {
      throw new Error('No baseline route found');
    }

    const comparisonRoutes: ComparisonRoute[] = routes
      .filter((route) => !route.isBaseline)
      .map((route) => {
        const percentDiff = ((route.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
        const compliant = route.ghgIntensity <= TARGET_INTENSITY;

        return {
          routeId: route.routeId,
          baseline: baseline.ghgIntensity,
          comparison: route.ghgIntensity,
          percentDiff,
          compliant,
        };
      });

    return {
      routes: comparisonRoutes,
      target: TARGET_INTENSITY,
    };
  }
}

