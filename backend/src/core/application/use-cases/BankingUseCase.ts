import { BankingService } from '../../ports/inbound/BankingService';
import { BankingRepository } from '../../ports/outbound/BankingRepository';
import { ComplianceService } from '../../ports/inbound/ComplianceService';
import { BankingRequest, BankingResponse, BankEntry } from '../../domain/entities/Banking';

export class BankingUseCase implements BankingService {
  constructor(
    private bankingRepository: BankingRepository,
    private complianceService: ComplianceService
  ) {}

  async getBankRecords(shipId: string, year: number): Promise<BankEntry[]> {
    return this.bankingRepository.getBankEntries(shipId, year);
  }

  async bankSurplus(request: BankingRequest): Promise<BankingResponse> {
    const balance = await this.complianceService.getComplianceBalance(request.shipId, request.year);

    if (balance.cbGco2eq <= 0) {
      return {
        success: false,
        message: 'Cannot bank: Compliance Balance must be positive',
      };
    }

    await this.bankingRepository.createBankEntry({
      shipId: request.shipId,
      year: request.year,
      amountGco2eq: balance.cbGco2eq,
    });

    return {
      success: true,
      message: 'Surplus banked successfully',
      cb_before: balance.cbGco2eq,
      cb_after: 0,
    };
  }

  async applyBankedSurplus(request: BankingRequest): Promise<BankingResponse> {
    const balance = await this.complianceService.getComplianceBalance(request.shipId, request.year);
    const totalBanked = await this.bankingRepository.getTotalBanked(request.shipId, request.year);

    if (totalBanked <= 0) {
      return {
        success: false,
        message: 'No banked surplus available to apply',
      };
    }

    if (balance.cbAfter && balance.cbAfter >= 0) {
      return {
        success: false,
        message: 'Cannot apply: Compliance Balance after application must be negative',
      };
    }

    const deficit = Math.abs(balance.cbAfter || 0);
    const amountToApply = Math.min(totalBanked, deficit);

    await this.bankingRepository.applyBankedAmount(request.shipId, request.year, amountToApply);

    return {
      success: true,
      message: 'Banked surplus applied successfully',
      cb_before: balance.cbBefore || balance.cbGco2eq,
      cb_after: (balance.cbAfter || 0) + amountToApply,
    };
  }
}

