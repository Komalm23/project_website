import { Pool, PoolMember } from '../../domain/entities/Pooling';

export interface PoolingRepository {
  createPool(pool: Pool, members: PoolMember[]): Promise<{ pool: Pool; members: PoolMember[] }>;
}

