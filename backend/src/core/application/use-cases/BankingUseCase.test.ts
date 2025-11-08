import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BankingUseCase } from './BankingUseCase';
import { BankingRepository } from '../../ports/outbound/BankingRepository';
import { ComplianceService } from '../../ports/inbound/ComplianceService';
import { ComplianceBalance } from '../../domain/entities/Compliance';

describe('BankingUseCase', () => {
  let mockBankingRepository: BankingRepository;
  let mockComplianceService: ComplianceService;
  let bankingUseCase: BankingUseCase;

  beforeEach(() => {
    mockBankingRepository = {
      getBankEntries: vi.fn(),
      createBankEntry: vi.fn(),
      getTotalBanked: vi.fn(),
      applyBankedAmount: vi.fn(),
    };
    mockComplianceService = {
      getComplianceBalance: vi.fn(),
      getAdjustedCB: vi.fn(),
      getAllAdjustedCB: vi.fn(),
    };
    bankingUseCase = new BankingUseCase(mockBankingRepository, mockComplianceService);
  });

  it('should reject banking when CB is not positive', async () => {
    const balance: ComplianceBalance = {
      shipId: 'R001',
      year: 2024,
      cbGco2eq: -100, // Negative
    };

    vi.mocked(mockComplianceService.getComplianceBalance).mockResolvedValue(balance);

    const result = await bankingUseCase.bankSurplus({ shipId: 'R001', year: 2024 });

    expect(result.success).toBe(false);
    expect(result.message).toContain('must be positive');
  });

  it('should bank surplus when CB is positive', async () => {
    const balance: ComplianceBalance = {
      shipId: 'R001',
      year: 2024,
      cbGco2eq: 100, // Positive
    };

    vi.mocked(mockComplianceService.getComplianceBalance).mockResolvedValue(balance);
    vi.mocked(mockBankingRepository.createBankEntry).mockResolvedValue({
      id: 1,
      shipId: 'R001',
      year: 2024,
      amountGco2eq: 100,
    });

    const result = await bankingUseCase.bankSurplus({ shipId: 'R001', year: 2024 });

    expect(result.success).toBe(true);
    expect(mockBankingRepository.createBankEntry).toHaveBeenCalledWith({
      shipId: 'R001',
      year: 2024,
      amountGco2eq: 100,
    });
  });
});

