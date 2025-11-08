import { ComparisonData } from '../../domain/entities/Comparison';

export interface ComparisonService {
  getComparisonData(): Promise<ComparisonData>;
}

