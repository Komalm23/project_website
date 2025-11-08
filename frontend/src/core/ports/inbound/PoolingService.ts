import { AdjustedCB, PoolRequest, PoolResponse } from '../../domain/entities/Pooling';

export interface PoolingService {
  getAdjustedCB(year: number): Promise<AdjustedCB[]>;
  createPool(request: PoolRequest): Promise<PoolResponse>;
}

