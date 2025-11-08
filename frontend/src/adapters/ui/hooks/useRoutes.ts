import { useState, useEffect } from 'react';
import { RouteService } from '@core/ports/inbound/RouteService';
import { Route } from '@core/domain/entities/Route';
import { RouteFilters } from '@core/ports/inbound/RouteService';

export function useRoutes(routeService: RouteService) {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RouteFilters>({});

  const fetchRoutes = async (currentFilters?: RouteFilters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await routeService.getRoutes(currentFilters || filters);
      setRoutes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch routes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleSetBaseline = async (routeId: string) => {
    try {
      await routeService.setBaseline(routeId);
      await fetchRoutes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set baseline');
    }
  };

  const applyFilters = (newFilters: RouteFilters) => {
    setFilters(newFilters);
    fetchRoutes(newFilters);
  };

  return {
    routes,
    loading,
    error,
    filters,
    setBaseline: handleSetBaseline,
    applyFilters,
    refresh: () => fetchRoutes(),
  };
}

