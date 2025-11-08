import { BankingService } from '../../ports/inbound/BankingService';
import { BankingRepository } from '../../ports/outbound/BankingRepository';
import { ComplianceBalance, BankingRequest, BankingResponse } from '../../domain/entities/Banking';

export class BankingUseCase implements BankingService {
  constructor(private bankingRepository: BankingRepository) {}

  async getComplianceBalance(year: number): Promise<ComplianceBalance> {
    return this.bankingRepository.fetchComplianceBalance(year);
  }

  async bankSurplus(request: BankingRequest): Promise<BankingResponse> {
    return this.bankingRepository.bankSurplus(request);
  }

  async applyBankedSurplus(request: BankingRequest): Promise<BankingResponse> {
    return this.bankingRepository.applyBankedSurplus(request);
  }
}

