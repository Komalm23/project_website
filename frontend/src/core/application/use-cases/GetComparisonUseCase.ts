import { ComparisonService } from '../../ports/inbound/ComparisonService';
import { ComparisonRepository } from '../../ports/outbound/ComparisonRepository';
import {
  ComparisonData,
  ComparisonRoute,
  ComparisonDataResponse,
} from '../../domain/entities/Comparison';

const TARGET_GHG_INTENSITY = 89.3368; // 2% below 91.16

export class GetComparisonUseCase implements ComparisonService {
  constructor(private comparisonRepository: ComparisonRepository) {}

  async getComparisonData(): Promise<ComparisonData> {
    const data: ComparisonDataResponse = await this.comparisonRepository.fetchComparisonData();

    // Calculate percent difference and compliance
    const routes: ComparisonRoute[] = data.routes.map((route) => {
      const percentDiff = ((route.comparison / route.baseline) - 1) * 100;
      const compliant = route.comparison <= TARGET_GHG_INTENSITY;

      return {
        ...route,
        percentDiff,
        compliant,
      };
    });

    return {
      routes,
      target: TARGET_GHG_INTENSITY,
    };
  }
}

