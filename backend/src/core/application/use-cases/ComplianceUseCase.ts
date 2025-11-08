import { ComplianceService } from '../../ports/inbound/ComplianceService';
import { ComplianceRepository } from '../../ports/outbound/ComplianceRepository';
import { RouteRepository } from '../../ports/outbound/RouteRepository';
import { BankingRepository } from '../../ports/outbound/BankingRepository';
import { ComplianceBalance, AdjustedCB } from '../../domain/entities/Compliance';
import { ComplianceCalculator } from '../../domain/services/ComplianceCalculator';

export class ComplianceUseCase implements ComplianceService {
  constructor(
    private complianceRepository: ComplianceRepository,
    private routeRepository: RouteRepository,
    private bankingRepository: BankingRepository
  ) {}

  async getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance> {
    // Try to get existing balance
    let balance = await this.complianceRepository.getComplianceBalance(shipId, year);

    if (!balance) {
      // Calculate and store new balance
      balance = await this.computeAndStoreCB(shipId, year);
    }

    // Get applied banked amount
    const applied = await this.bankingRepository.getTotalBanked(shipId, year);
    const cbBefore = balance.cbGco2eq;
    const cbAfter = cbBefore - applied;

    return {
      ...balance,
      cbBefore,
      applied,
      cbAfter,
    };
  }

  async getAdjustedCB(shipId: string, year: number): Promise<AdjustedCB> {
    const balance = await this.getComplianceBalance(shipId, year);
    return {
      shipId,
      adjustedCB: balance.cbAfter || balance.cbGco2eq,
      cb_before: balance.cbBefore || balance.cbGco2eq,
    };
  }

  async getAllAdjustedCB(year: number): Promise<AdjustedCB[]> {
    const balances = await this.complianceRepository.getAllComplianceBalances(year);
    const adjustedCBs: AdjustedCB[] = [];

    for (const balance of balances) {
      const adjusted = await this.getAdjustedCB(balance.shipId, year);
      adjustedCBs.push(adjusted);
    }

    return adjustedCBs;
  }

  private async computeAndStoreCB(shipId: string, year: number): Promise<ComplianceBalance> {
    // Find route for this ship/year (using shipId as routeId)
    const route = await this.routeRepository.findByRouteId(shipId);
    if (!route) {
      throw new Error(`Route not found for ship ${shipId}`);
    }

    // Ensure route year matches
    if (route.year !== year) {
      throw new Error(`Route year ${route.year} does not match requested year ${year}`);
    }

    const targetIntensity = ComplianceCalculator.getTargetIntensity(year);
    const cb = ComplianceCalculator.calculateCB(
      route.ghgIntensity,
      route.fuelConsumption,
      targetIntensity
    );

    const balance: ComplianceBalance = {
      shipId,
      year,
      cbGco2eq: cb,
    };

    return this.complianceRepository.saveComplianceBalance(balance);
  }
}

