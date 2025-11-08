import { BankingRepository } from '@core/ports/outbound/BankingRepository';
import { ComplianceBalance, BankingRequest, BankingResponse } from '@core/domain/entities/Banking';
import { apiRequest } from '@shared/config/api';

export class BankingApiClient implements BankingRepository {
  async fetchComplianceBalance(year: number): Promise<ComplianceBalance> {
    return apiRequest<ComplianceBalance>(`/compliance/cb?year=${year}`);
  }

  async bankSurplus(request: BankingRequest): Promise<BankingResponse> {
    return apiRequest<BankingResponse>('/banking/bank', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async applyBankedSurplus(request: BankingRequest): Promise<BankingResponse> {
    return apiRequest<BankingResponse>('/banking/apply', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
}

