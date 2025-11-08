import { BankEntry, BankingRequest } from '../../domain/entities/Banking';

export interface BankingRepository {
  getBankEntries(shipId: string, year: number): Promise<BankEntry[]>;
  createBankEntry(entry: BankEntry): Promise<BankEntry>;
  getTotalBanked(shipId: string, year: number): Promise<number>;
  applyBankedAmount(shipId: string, year: number, amount: number): Promise<void>;
}

