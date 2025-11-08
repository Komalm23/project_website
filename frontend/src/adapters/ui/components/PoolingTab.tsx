import { useState } from 'react';
import { PoolingService } from '@core/ports/inbound/PoolingService';
import { usePooling } from '../hooks/usePooling';

interface PoolingTabProps {
  poolingService: PoolingService;
}

export function PoolingTab({ poolingService }: PoolingTabProps) {
  const [year, setYear] = useState(new Date().getFullYear());
  const {
    adjustedCBs,
    loading,
    error,
    selectedShips,
    poolMembers,
    actionLoading,
    toggleShipSelection,
    calculatePoolSum,
    validatePool,
    createPool,
  } = usePooling(poolingService, year);

  const poolSum = calculatePoolSum();
  const validation = validatePool();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading adjusted CB data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <label htmlFor="year-select-pooling" className="block text-sm font-medium text-gray-700 mb-2">
          Year
        </label>
        <input
          id="year-select-pooling"
          type="number"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value) || new Date().getFullYear())}
          className="input-field"
          min="2020"
          max="2030"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      )}

      {selectedShips.size > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Pool Sum</h3>
            <span
              className={`text-2xl font-bold ${
                poolSum >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {poolSum.toFixed(2)}
            </span>
          </div>
          {!validation.valid && (
            <div className="text-sm text-red-600 mt-2">
              {validation.errors.map((err, idx) => (
                <div key={idx}>• {err}</div>
              ))}
            </div>
          )}
          <button
            onClick={createPool}
            disabled={!validation.valid || actionLoading}
            className="btn-primary mt-4"
          >
            {actionLoading ? 'Creating Pool...' : 'Create Pool'}
          </button>
        </div>
      )}

      {poolMembers.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Pool Members (After Pooling)</h2>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th className="table-header">Ship ID</th>
                  <th className="table-header">CB Before</th>
                  <th className="table-header">CB After</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {poolMembers.map((member) => (
                  <tr key={member.shipId} className="hover:bg-gray-50">
                    <td className="table-cell font-medium">{member.shipId}</td>
                    <td className="table-cell">{member.cb_before.toFixed(2)}</td>
                    <td
                      className={`table-cell font-semibold ${
                        member.cb_after >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {member.cb_after.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Ships with Adjusted CB</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th className="table-header">Select</th>
                <th className="table-header">Ship ID</th>
                <th className="table-header">CB Before</th>
                <th className="table-header">Adjusted CB</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {adjustedCBs.map((ship) => {
                const isSelected = selectedShips.has(ship.shipId);
                return (
                  <tr
                    key={ship.shipId}
                    className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                  >
                    <td className="table-cell">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleShipSelection(ship.shipId)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="table-cell font-medium">{ship.shipId}</td>
                    <td className="table-cell">{ship.cb_before.toFixed(2)}</td>
                    <td
                      className={`table-cell font-semibold ${
                        ship.adjustedCB >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {ship.adjustedCB.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {adjustedCBs.length === 0 && (
            <div className="text-center py-8 text-gray-500">No ships found</div>
          )}
        </div>
      </div>
    </div>
  );
}

