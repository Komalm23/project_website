import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PoolingUseCase } from './PoolingUseCase';
import { PoolingRepository } from '../../ports/outbound/PoolingRepository';
import { ComplianceService } from '../../ports/inbound/ComplianceService';
import { AdjustedCB } from '../../domain/entities/Compliance';

describe('PoolingUseCase', () => {
  let mockPoolingRepository: PoolingRepository;
  let mockComplianceService: ComplianceService;
  let poolingUseCase: PoolingUseCase;

  beforeEach(() => {
    mockPoolingRepository = {
      createPool: vi.fn(),
    };
    mockComplianceService = {
      getComplianceBalance: vi.fn(),
      getAdjustedCB: vi.fn(),
      getAllAdjustedCB: vi.fn(),
    };
    poolingUseCase = new PoolingUseCase(mockPoolingRepository, mockComplianceService);
  });

  it('should reject pool when sum is negative', async () => {
    vi.mocked(mockComplianceService.getAdjustedCB).mockResolvedValue({
      shipId: 'R001',
      adjustedCB: -100,
      cb_before: -100,
    });

    const result = await poolingUseCase.createPool({
      members: ['R001'],
      year: 2024,
    });

    expect(result.success).toBe(false);
    expect(result.message).toContain('must be >= 0');
  });

  it('should create pool when sum is positive', async () => {
    vi.mocked(mockComplianceService.getAdjustedCB)
      .mockResolvedValueOnce({
        shipId: 'R001',
        adjustedCB: 100,
        cb_before: 100,
      })
      .mockResolvedValueOnce({
        shipId: 'R002',
        adjustedCB: 50,
        cb_before: 50,
      });

    vi.mocked(mockPoolingRepository.createPool).mockResolvedValue({
      pool: { id: 1, year: 2024 },
      members: [
        { poolId: 1, shipId: 'R001', cbBefore: 100, cbAfter: 100 },
        { poolId: 1, shipId: 'R002', cbBefore: 50, cbAfter: 50 },
      ],
    });

    const result = await poolingUseCase.createPool({
      members: ['R001', 'R002'],
      year: 2024,
    });

    expect(result.success).toBe(true);
    expect(result.poolSum).toBe(150);
  });
});

