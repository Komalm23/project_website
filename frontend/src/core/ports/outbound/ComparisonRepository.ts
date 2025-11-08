import { ComparisonDataResponse } from '../../domain/entities/Comparison';

export interface ComparisonRepository {
  fetchComparisonData(): Promise<ComparisonDataResponse>;
}

