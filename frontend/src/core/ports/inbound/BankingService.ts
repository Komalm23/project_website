import { ComplianceBalance, BankingRequest, BankingResponse } from '../../domain/entities/Banking';

export interface BankingService {
  getComplianceBalance(year: number): Promise<ComplianceBalance>;
  bankSurplus(request: BankingRequest): Promise<BankingResponse>;
  applyBankedSurplus(request: BankingRequest): Promise<BankingResponse>;
}

