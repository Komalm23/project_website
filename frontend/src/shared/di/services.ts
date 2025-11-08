import { GetRoutesUseCase } from '@core/application/use-cases/GetRoutesUseCase';
import { GetComparisonUseCase } from '@core/application/use-cases/GetComparisonUseCase';
import { BankingUseCase } from '@core/application/use-cases/BankingUseCase';
import { PoolingUseCase } from '@core/application/use-cases/PoolingUseCase';
import { RouteApiClient } from '@adapters/infrastructure/api/RouteApiClient';
import { ComparisonApiClient } from '@adapters/infrastructure/api/ComparisonApiClient';
import { BankingApiClient } from '@adapters/infrastructure/api/BankingApiClient';
import { PoolingApiClient } from '@adapters/infrastructure/api/PoolingApiClient';

// Infrastructure adapters
const routeApiClient = new RouteApiClient();
const comparisonApiClient = new ComparisonApiClient();
const bankingApiClient = new BankingApiClient();
const poolingApiClient = new PoolingApiClient();

// Use cases (application layer)
export const routeService = new GetRoutesUseCase(routeApiClient);
export const comparisonService = new GetComparisonUseCase(comparisonApiClient);
export const bankingService = new BankingUseCase(bankingApiClient);
export const poolingService = new PoolingUseCase(poolingApiClient);

