import { ComplianceRepository } from '@core/ports/outbound/ComplianceRepository';
import { ComplianceBalance } from '@core/domain/entities/Compliance';
import { prisma } from '@shared/db/prisma';

export class ComplianceRepositoryImpl implements ComplianceRepository {
  async saveComplianceBalance(balance: ComplianceBalance): Promise<ComplianceBalance> {
    const saved = await prisma.shipCompliance.upsert({
      where: {
        shipId_year: {
          shipId: balance.shipId,
          year: balance.year,
        },
      },
      update: {
        cbGco2eq: balance.cbGco2eq,
      },
      create: {
        shipId: balance.shipId,
        year: balance.year,
        cbGco2eq: balance.cbGco2eq,
      },
    });

    return this.toDomain(saved);
  }

  async getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance | null> {
    const balance = await prisma.shipCompliance.findUnique({
      where: {
        shipId_year: {
          shipId,
          year,
        },
      },
    });

    return balance ? this.toDomain(balance) : null;
  }

  async getAllComplianceBalances(year: number): Promise<ComplianceBalance[]> {
    const balances = await prisma.shipCompliance.findMany({
      where: { year },
    });

    return balances.map(this.toDomain);
  }

  private toDomain(balance: any): ComplianceBalance {
    return {
      shipId: balance.shipId,
      year: balance.year,
      cbGco2eq: balance.cbGco2eq,
    };
  }
}

