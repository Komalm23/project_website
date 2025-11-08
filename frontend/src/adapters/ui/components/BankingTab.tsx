import { useState } from 'react';
import { BankingService } from '@core/ports/inbound/BankingService';
import { useBanking } from '../hooks/useBanking';

interface BankingTabProps {
  bankingService: BankingService;
}

export function BankingTab({ bankingService }: BankingTabProps) {
  const [year, setYear] = useState(new Date().getFullYear());
  const { balance, loading, error, actionLoading, bankSurplus, applyBanked } = useBanking(
    bankingService,
    year
  );

  const canBank = balance && balance.cb_before > 0;
  const canApply = balance && balance.cb_after < 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading compliance balance...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <label htmlFor="year-select" className="block text-sm font-medium text-gray-700 mb-2">
          Year
        </label>
        <input
          id="year-select"
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

      {balance && (
        <>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Compliance Balance KPIs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-sm text-gray-600 mb-1">CB Before</div>
                <div className="text-2xl font-bold">{balance.cb_before.toFixed(2)}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-sm text-gray-600 mb-1">Applied</div>
                <div className="text-2xl font-bold">{balance.applied.toFixed(2)}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-sm text-gray-600 mb-1">CB After</div>
                <div
                  className={`text-2xl font-bold ${
                    balance.cb_after >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {balance.cb_after.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Actions</h2>
            <div className="space-y-4">
              <div>
                <button
                  onClick={bankSurplus}
                  disabled={!canBank || actionLoading}
                  className="btn-primary"
                >
                  {actionLoading ? 'Processing...' : 'Bank Surplus'}
                </button>
                <p className="text-sm text-gray-600 mt-2">
                  Bank positive compliance balance. {!canBank && '(CB must be > 0)'}
                </p>
              </div>
              <div>
                <button
                  onClick={applyBanked}
                  disabled={!canApply || actionLoading}
                  className="btn-primary"
                >
                  {actionLoading ? 'Processing...' : 'Apply Banked Surplus'}
                </button>
                <p className="text-sm text-gray-600 mt-2">
                  Apply banked surplus to a deficit. {!canApply && '(CB after must be < 0)'}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

