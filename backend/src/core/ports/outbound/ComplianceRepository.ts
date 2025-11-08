import { ComplianceBalance, AdjustedCB } from '../../domain/entities/Compliance';

export interface ComplianceRepository {
  saveComplianceBalance(balance: ComplianceBalance): Promise<ComplianceBalance>;
  getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance | null>;
  getAllComplianceBalances(year: number): Promise<ComplianceBalance[]>;
}

