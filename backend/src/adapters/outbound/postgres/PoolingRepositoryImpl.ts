import { PoolingRepository } from '@core/ports/outbound/PoolingRepository';
import { Pool, PoolMember } from '@core/domain/entities/Pooling';
import { prisma } from '@shared/db/prisma';

export class PoolingRepositoryImpl implements PoolingRepository {
  async createPool(pool: Pool, members: PoolMember[]): Promise<{ pool: Pool; members: PoolMember[] }> {
    const createdPool = await prisma.pool.create({
      data: {
        year: pool.year,
        members: {
          create: members.map((m) => ({
            shipId: m.shipId,
            cbBefore: m.cbBefore,
            cbAfter: m.cbAfter,
          })),
        },
      },
      include: {
        members: true,
      },
    });

    return {
      pool: {
        id: createdPool.id,
        year: createdPool.year,
        createdAt: createdPool.createdAt,
      },
      members: createdPool.members.map((m) => ({
        poolId: m.poolId,
        shipId: m.shipId,
        cbBefore: m.cbBefore,
        cbAfter: m.cbAfter,
      })),
    };
  }
}

