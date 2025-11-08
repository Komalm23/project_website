import { ComparisonRepository } from '@core/ports/outbound/ComparisonRepository';
import { ComparisonDataResponse } from '@core/domain/entities/Comparison';
import { apiRequest } from '@shared/config/api';

export class ComparisonApiClient implements ComparisonRepository {
  async fetchComparisonData(): Promise<ComparisonDataResponse> {
    return apiRequest<ComparisonDataResponse>('/routes/comparison');
  }
}

