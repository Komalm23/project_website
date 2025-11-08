import { ComparisonService } from '@core/ports/inbound/ComparisonService';
import { useComparison } from '../hooks/useComparison';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CompareTabProps {
  comparisonService: ComparisonService;
}

export function CompareTab({ comparisonService }: CompareTabProps) {
  const { data, loading, error } = useComparison(comparisonService);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading comparison data...</div>
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

  if (!data) {
    return <div className="text-gray-600">No comparison data available</div>;
  }

  const chartData = data.routes.map((route) => ({
    routeId: route.routeId,
    baseline: route.baseline,
    comparison: route.comparison,
    target: data.target,
  }));

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Target GHG Intensity:</strong> {data.target.toFixed(4)} gCO₂e/MJ (2% below 91.16)
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">GHG Intensity Comparison Chart</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="routeId" />
            <YAxis label={{ value: 'gCO₂e/MJ', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="baseline" fill="#8884d8" name="Baseline" />
            <Bar dataKey="comparison" fill="#82ca9d" name="Comparison" />
            <Bar dataKey="target" fill="#ffc658" name="Target" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="table-header">Route ID</th>
              <th className="table-header">Baseline (gCO₂e/MJ)</th>
              <th className="table-header">Comparison (gCO₂e/MJ)</th>
              <th className="table-header">% Difference</th>
              <th className="table-header">Compliant</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.routes.map((route) => (
              <tr key={route.routeId} className="hover:bg-gray-50">
                <td className="table-cell font-medium">{route.routeId}</td>
                <td className="table-cell">{route.baseline.toFixed(2)}</td>
                <td className="table-cell">{route.comparison.toFixed(2)}</td>
                <td className="table-cell">
                  <span className={route.percentDiff >= 0 ? 'text-red-600' : 'text-green-600'}>
                    {route.percentDiff >= 0 ? '+' : ''}
                    {route.percentDiff.toFixed(2)}%
                  </span>
                </td>
                <td className="table-cell">
                  {route.compliant ? (
                    <span className="text-green-600 font-semibold">✅ Compliant</span>
                  ) : (
                    <span className="text-red-600 font-semibold">❌ Non-compliant</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

