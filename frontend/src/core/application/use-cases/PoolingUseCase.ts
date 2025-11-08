import { PoolingService } from '../../ports/inbound/PoolingService';
import { PoolingRepository } from '../../ports/outbound/PoolingRepository';
import { AdjustedCB, PoolRequest, PoolResponse } from '../../domain/entities/Pooling';

export class PoolingUseCase implements PoolingService {
  constructor(private poolingRepository: PoolingRepository) {}

  async getAdjustedCB(year: number): Promise<AdjustedCB[]> {
    return this.poolingRepository.fetchAdjustedCB(year);
  }

  async createPool(request: PoolRequest): Promise<PoolResponse> {
    return this.poolingRepository.createPool(request);
  }
}

