// Dependency Injection - Wire up all services

import { RouteRepositoryImpl } from '@adapters/outbound/postgres/RouteRepositoryImpl';
import { ComplianceRepositoryImpl } from '@adapters/outbound/postgres/ComplianceRepositoryImpl';
import { BankingRepositoryImpl } from '@adapters/outbound/postgres/BankingRepositoryImpl';
import { PoolingRepositoryImpl } from '@adapters/outbound/postgres/PoolingRepositoryImpl';

import { RouteUseCase } from '@core/application/use-cases/RouteUseCase';
import { ComparisonUseCase } from '@core/application/use-cases/ComparisonUseCase';
import { ComplianceUseCase } from '@core/application/use-cases/ComplianceUseCase';
import { BankingUseCase } from '@core/application/use-cases/BankingUseCase';
import { PoolingUseCase } from '@core/application/use-cases/PoolingUseCase';

// Repositories
const routeRepository = new RouteRepositoryImpl();
const complianceRepository = new ComplianceRepositoryImpl();
const bankingRepository = new BankingRepositoryImpl();
const poolingRepository = new PoolingRepositoryImpl();

// Use Cases
export const routeService = new RouteUseCase(routeRepository);
export const comparisonUseCase = new ComparisonUseCase(routeService);
export const complianceService = new ComplianceUseCase(
  complianceRepository,
  routeRepository,
  bankingRepository
);
export const bankingService = new BankingUseCase(bankingRepository, complianceService);
export const poolingService = new PoolingUseCase(poolingRepository, complianceService);

