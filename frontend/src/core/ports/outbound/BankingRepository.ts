import { ComplianceBalance, BankingRequest, BankingResponse } from '../../domain/entities/Banking';

export interface BankingRepository {
  fetchComplianceBalance(year: number): Promise<ComplianceBalance>;
  bankSurplus(request: BankingRequest): Promise<BankingResponse>;
  applyBankedSurplus(request: BankingRequest): Promise<BankingResponse>;
}

