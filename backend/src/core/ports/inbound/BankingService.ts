import { BankingRequest, BankingResponse, BankEntry } from '../../domain/entities/Banking';

export interface BankingService {
  getBankRecords(shipId: string, year: number): Promise<BankEntry[]>;
  bankSurplus(request: BankingRequest): Promise<BankingResponse>;
  applyBankedSurplus(request: BankingRequest): Promise<BankingResponse>;
}

