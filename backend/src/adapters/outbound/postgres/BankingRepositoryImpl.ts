import { BankingRepository } from '@core/ports/outbound/BankingRepository';
import { BankEntry } from '@core/domain/entities/Banking';
import { prisma } from '@shared/db/prisma';

export class BankingRepositoryImpl implements BankingRepository {
  async getBankEntries(shipId: string, year: number): Promise<BankEntry[]> {
    const entries = await prisma.bankEntry.findMany({
      where: { shipId, year },
    });

    return entries.map(this.toDomain);
  }

  async createBankEntry(entry: BankEntry): Promise<BankEntry> {
    const created = await prisma.bankEntry.create({
      data: {
        shipId: entry.shipId,
        year: entry.year,
        amountGco2eq: entry.amountGco2eq,
      },
    });

    return this.toDomain(created);
  }

  async getTotalBanked(shipId: string, year: number): Promise<number> {
    const result = await prisma.bankEntry.aggregate({
      where: { shipId, year },
      _sum: {
        amountGco2eq: true,
      },
    });

    return result._sum.amountGco2eq || 0;
  }

  async applyBankedAmount(shipId: string, year: number, amount: number): Promise<void> {
    // For simplicity, we'll create a negative entry to represent applied amount
    // In a real system, you might want a separate table for applied amounts
    await prisma.bankEntry.create({
      data: {
        shipId,
        year,
        amountGco2eq: -amount, // Negative to represent application
      },
    });
  }

  private toDomain(entry: any): BankEntry {
    return {
      id: entry.id,
      shipId: entry.shipId,
      year: entry.year,
      amountGco2eq: entry.amountGco2eq,
      createdAt: entry.createdAt,
    };
  }
}

