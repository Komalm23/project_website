import { PoolingService } from '../../ports/inbound/PoolingService';
import { PoolingRepository } from '../../ports/outbound/PoolingRepository';
import { ComplianceService } from '../../ports/inbound/ComplianceService';
import { PoolRequest, PoolResponse, PoolMember } from '../../domain/entities/Pooling';

export class PoolingUseCase implements PoolingService {
  constructor(
    private poolingRepository: PoolingRepository,
    private complianceService: ComplianceService
  ) {}

  async createPool(request: PoolRequest): Promise<PoolResponse> {
    // Validate: Sum of adjusted CB must be >= 0
    const members: PoolMember[] = [];
    let poolSum = 0;

    for (const shipId of request.members) {
      const adjustedCB = await this.complianceService.getAdjustedCB(shipId, request.year);
      poolSum += adjustedCB.adjustedCB;
      members.push({
        poolId: 0, // Will be set after pool creation
        shipId,
        cbBefore: adjustedCB.cb_before,
        cbAfter: adjustedCB.adjustedCB, // Initial value
      });
    }

    if (poolSum < 0) {
      return {
        success: false,
        message: 'Pool sum must be >= 0',
        poolSum,
      };
    }

    // Validate: Deficit ship cannot exit worse, Surplus ship cannot exit negative
    const originalCBs = new Map(members.map((m) => [m.shipId, m.cbBefore]));
    const finalCBs = this.allocatePool(members, poolSum);

    // Validate constraints
    for (const member of finalCBs) {
      const originalCB = originalCBs.get(member.shipId) || 0;
      const finalCB = member.cbAfter;

      // Deficit ship cannot exit worse
      if (originalCB < 0 && finalCB < originalCB) {
        return {
          success: false,
          message: `Deficit ship ${member.shipId} cannot exit worse`,
        };
      }

      // Surplus ship cannot exit negative
      if (originalCB >= 0 && finalCB < 0) {
        return {
          success: false,
          message: `Surplus ship ${member.shipId} cannot exit negative`,
        };
      }
    }

    // Create pool
    const { pool, members: savedMembers } = await this.poolingRepository.createPool(
      { year: request.year },
      finalCBs
    );

    return {
      success: true,
      message: 'Pool created successfully',
      members: savedMembers,
      poolSum,
    };
  }

  /**
   * Greedy allocation: Sort members desc by CB, transfer surplus to deficits
   */
  private allocatePool(members: PoolMember[], poolSum: number): PoolMember[] {
    // Sort by CB descending (surplus first)
    const sorted = [...members].sort((a, b) => b.cbAfter - a.cbAfter);

    const result: PoolMember[] = [];
    let remainingDeficit = 0;

    // Calculate total deficit
    for (const member of sorted) {
      if (member.cbAfter < 0) {
        remainingDeficit += Math.abs(member.cbAfter);
      }
    }

    // Allocate surplus to deficits
    for (const member of sorted) {
      if (member.cbAfter >= 0) {
        // Surplus ship
        const allocated = Math.min(member.cbAfter, remainingDeficit);
        result.push({
          ...member,
          cbAfter: member.cbAfter - allocated,
        });
        remainingDeficit -= allocated;
      } else {
        // Deficit ship - receives allocation
        const deficit = Math.abs(member.cbAfter);
        const allocated = Math.min(deficit, poolSum);
        result.push({
          ...member,
          cbAfter: member.cbAfter + allocated,
        });
        poolSum -= allocated;
      }
    }

    return result;
  }
}

