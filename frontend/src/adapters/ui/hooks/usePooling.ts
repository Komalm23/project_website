import { useState, useEffect, useCallback } from 'react';
import { PoolingService } from '@core/ports/inbound/PoolingService';
import { AdjustedCB, PoolMember } from '@core/domain/entities/Pooling';

export function usePooling(poolingService: PoolingService, year: number) {
  const [adjustedCBs, setAdjustedCBs] = useState<AdjustedCB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedShips, setSelectedShips] = useState<Set<string>>(new Set());
  const [poolMembers, setPoolMembers] = useState<PoolMember[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAdjustedCB = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await poolingService.getAdjustedCB(year);
      setAdjustedCBs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch adjusted CB');
    } finally {
      setLoading(false);
    }
  }, [poolingService, year]);

  useEffect(() => {
    fetchAdjustedCB();
  }, [fetchAdjustedCB]);

  const toggleShipSelection = (shipId: string) => {
    const newSelection = new Set(selectedShips);
    if (newSelection.has(shipId)) {
      newSelection.delete(shipId);
    } else {
      newSelection.add(shipId);
    }
    setSelectedShips(newSelection);
  };

  const calculatePoolSum = (): number => {
    return Array.from(selectedShips).reduce((sum, shipId) => {
      const ship = adjustedCBs.find((s) => s.shipId === shipId);
      return sum + (ship?.adjustedCB || 0);
    }, 0);
  };

  const validatePool = (): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const poolSum = calculatePoolSum();

    if (poolSum < 0) {
      errors.push('Sum of adjusted CB must be ≥ 0');
    }

    // Check if any deficit ship would exit worse
    selectedShips.forEach((shipId) => {
      const ship = adjustedCBs.find((s) => s.shipId === shipId);
      if (ship && ship.adjustedCB < 0) {
        // This would need more complex validation based on pool rules
        // For now, we'll just check the sum
      }
    });

    return { valid: errors.length === 0, errors };
  };

  const createPool = async () => {
    const validation = validatePool();
    if (!validation.valid) {
      setError(validation.errors.join(', '));
      return;
    }

    try {
      setActionLoading(true);
      setError(null);
      const response = await poolingService.createPool({
        members: Array.from(selectedShips),
        year,
      });

      if (response.success && response.members) {
        setPoolMembers(response.members);
        setSelectedShips(new Set());
        await fetchAdjustedCB();
      } else {
        setError(response.message || 'Failed to create pool');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create pool');
    } finally {
      setActionLoading(false);
    }
  };

  return {
    adjustedCBs,
    loading,
    error,
    selectedShips,
    poolMembers,
    actionLoading,
    toggleShipSelection,
    calculatePoolSum,
    validatePool,
    createPool,
    refresh: fetchAdjustedCB,
  };
}

