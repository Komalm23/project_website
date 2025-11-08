import { useState, useEffect } from 'react';
import { ComparisonService } from '@core/ports/inbound/ComparisonService';
import { ComparisonData } from '@core/domain/entities/Comparison';

export function useComparison(comparisonService: ComparisonService) {
  const [data, setData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await comparisonService.getComparisonData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comparison data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
  };
}

