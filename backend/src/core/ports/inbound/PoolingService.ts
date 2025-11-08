import { PoolRequest, PoolResponse } from '../../domain/entities/Pooling';

export interface PoolingService {
  createPool(request: PoolRequest): Promise<PoolResponse>;
}

