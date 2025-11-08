import { useState } from 'react';
import { RoutesTab } from './adapters/ui/components/RoutesTab';
import { CompareTab } from './adapters/ui/components/CompareTab';
import { BankingTab } from './adapters/ui/components/BankingTab';
import { PoolingTab } from './adapters/ui/components/PoolingTab';
import {
  routeService,
  comparisonService,
  bankingService,
  poolingService,
} from './shared/di/services';

type Tab = 'routes' | 'compare' | 'banking' | 'pooling';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('routes');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'routes', label: 'Routes' },
    { id: 'compare', label: 'Compare' },
    { id: 'banking', label: 'Banking' },
    { id: 'pooling', label: 'Pooling' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Fuel EU Compliance Dashboard</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveTab(tab.id);
                    }
                  }}
                  className={`
                    flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'routes' && <RoutesTab routeService={routeService} />}
            {activeTab === 'compare' && <CompareTab comparisonService={comparisonService} />}
            {activeTab === 'banking' && <BankingTab bankingService={bankingService} />}
            {activeTab === 'pooling' && <PoolingTab poolingService={poolingService} />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

