import { AdjustedCB, PoolRequest, PoolResponse } from '../../domain/entities/Pooling';

export interface PoolingRepository {
  fetchAdjustedCB(year: number): Promise<AdjustedCB[]>;
  createPool(request: PoolRequest): Promise<PoolResponse>;
}

