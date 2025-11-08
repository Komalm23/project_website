import { useState } from 'react';
import { RouteService } from '@core/ports/inbound/RouteService';
import { RouteFilters } from '@core/ports/inbound/RouteService';
import { useRoutes } from '../hooks/useRoutes';

interface RoutesTabProps {
  routeService: RouteService;
}

export function RoutesTab({ routeService }: RoutesTabProps) {
  const { routes, loading, error, setBaseline, applyFilters } = useRoutes(routeService);
  const [filters, setFilters] = useState<RouteFilters>({
    vesselType: '',
    fuelType: '',
    year: undefined,
  });

  const handleFilterChange = (key: keyof RouteFilters, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const uniqueVesselTypes = Array.from(new Set(routes.map((r) => r.vesselType)));
  const uniqueFuelTypes = Array.from(new Set(routes.map((r) => r.fuelType)));
  const uniqueYears = Array.from(new Set(routes.map((r) => r.year))).sort((a, b) => b - a);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading routes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="vesselType" className="block text-sm font-medium text-gray-700 mb-1">
              Vessel Type
            </label>
            <select
              id="vesselType"
              value={filters.vesselType || ''}
              onChange={(e) => handleFilterChange('vesselType', e.target.value)}
              className="input-field w-full"
            >
              <option value="">All</option>
              {uniqueVesselTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 mb-1">
              Fuel Type
            </label>
            <select
              id="fuelType"
              value={filters.fuelType || ''}
              onChange={(e) => handleFilterChange('fuelType', e.target.value)}
              className="input-field w-full"
            >
              <option value="">All</option>
              {uniqueFuelTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <select
              id="year"
              value={filters.year || ''}
              onChange={(e) => handleFilterChange('year', e.target.value ? parseInt(e.target.value) : undefined)}
              className="input-field w-full"
            >
              <option value="">All</option>
              {uniqueYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="table-header">Route ID</th>
              <th className="table-header">Vessel Type</th>
              <th className="table-header">Fuel Type</th>
              <th className="table-header">Year</th>
              <th className="table-header">GHG Intensity (gCO₂e/MJ)</th>
              <th className="table-header">Fuel Consumption (t)</th>
              <th className="table-header">Distance (km)</th>
              <th className="table-header">Total Emissions (t)</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {routes.map((route) => (
              <tr key={route.routeId} className="hover:bg-gray-50">
                <td className="table-cell font-medium">{route.routeId}</td>
                <td className="table-cell">{route.vesselType}</td>
                <td className="table-cell">{route.fuelType}</td>
                <td className="table-cell">{route.year}</td>
                <td className="table-cell">{route.ghgIntensity.toFixed(2)}</td>
                <td className="table-cell">{route.fuelConsumption.toLocaleString()}</td>
                <td className="table-cell">{route.distance.toLocaleString()}</td>
                <td className="table-cell">{route.totalEmissions.toLocaleString()}</td>
                <td className="table-cell">
                  <button
                    onClick={() => setBaseline(route.routeId)}
                    className="btn-primary text-sm"
                  >
                    Set Baseline
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {routes.length === 0 && (
          <div className="text-center py-8 text-gray-500">No routes found</div>
        )}
      </div>
    </div>
  );
}

