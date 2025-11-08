import { ComplianceBalance, AdjustedCB } from '../../domain/entities/Compliance';

export interface ComplianceService {
  getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance>;
  getAdjustedCB(shipId: string, year: number): Promise<AdjustedCB>;
  getAllAdjustedCB(year: number): Promise<AdjustedCB[]>;
}

